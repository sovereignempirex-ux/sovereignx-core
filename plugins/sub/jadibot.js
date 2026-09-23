/* ========== Sub-Bot Manager (Jadibot) - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import qrcode from 'qrcode';
import NodeCache from 'node-cache';
import {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  areJidsSameUser,
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia
} from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import pino from 'pino';
import { makeWASocket } from '@whiskeysockets/baileys';
import { fileURLToPath } from 'url';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALEVER_IMG = 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg';
const JADI_FOLDER = path.join('Sessions', 'SubBot');
const INSTALLS_FILE = path.join(__dirname, '..', '..', 'system', 'config', 'subbot_installs.json');
const STATUS_FILE = path.join(__dirname, '..', '..', 'system', 'config', 'subbot_status.json');
const LIMIT_FILE = path.join(__dirname, '..', '..', 'system', 'config', 'subbot_limits.json');
const BANNED_CHATS_FILE = path.join(__dirname, '..', '..', 'system', 'config', 'banned_chats.json');

const DEFAULT_MAX_INSTALLS = 6;
const MAX_RECONNECT = 5;
const RECONNECT_BASE_DELAY = 1500;
const HANDLER_CACHE_TTL = 300000;
const WATCHDOG_INTERVAL_MS = 20000;

const DISK_CHECK_INTERVAL_MS = 3 * 60000;
const DISK_CRITICAL_MB = 150;
const DISK_WARNING_MB = 300;
const MAX_PREKEYS_PER_SESSION = 20;

const SHARED_RETRY_CACHE = new NodeCache({ stdTTL: 60, checkperiod: 120 });

function isENOSPC(err) {
  return err?.code === 'ENOSPC' || err?.message?.includes('ENOSPC') || err?.message?.includes('no space left');
}

function getFreeDiskMB() {
  try {
    const out = execSync("df -m / | tail -1 | awk '{print $4}'", { encoding: 'utf8', timeout: 5000 });
    return parseInt(out.trim(), 10) || 9999;
  } catch { return 9999; }
}

function cleanPreKeys(sessionPath) {
  try {
    const files = fs.readdirSync(sessionPath);
    const preKeys = files
      .filter(f => f.startsWith('pre-key-') && f.endsWith('.json'))
      .map(f => ({ file: f, num: parseInt(f.replace('pre-key-', '').replace('.json', ''), 10) }))
      .filter(x => !isNaN(x.num))
      .sort((a, b) => a.num - b.num);
    if (preKeys.length <= MAX_PREKEYS_PER_SESSION) return 0;
    const toDelete = preKeys.slice(0, preKeys.length - MAX_PREKEYS_PER_SESSION);
    let deleted = 0;
    for (const { file } of toDelete) {
      try { fs.unlinkSync(path.join(sessionPath, file)); deleted++ } catch {}
    }
    return deleted;
  } catch { return 0; }
}

async function cleanAllPreKeys() {
  const baseDir = path.join(process.cwd(), JADI_FOLDER);
  if (!fs.existsSync(baseDir)) return 0;
  let total = 0;
  for (const uid of fs.readdirSync(baseDir)) {
    const sp = path.join(baseDir, uid);
    try {
      if (!fs.statSync(sp).isDirectory()) continue;
      total += cleanPreKeys(sp);
    } catch {}
  }
  return total;
}

async function emergencyCleanup() {
  console.warn('[SALEVER] 🚨 تنظيف طارئ — pre-keys...');
  const deleted = await cleanAllPreKeys();
  console.warn(`[SALEVER] ✅ انتهى — محذوف: ${deleted} pre-key | حر: ${getFreeDiskMB()}MB`);
}

let _diskMonitorRunning = false;
function startDiskMonitor() {
  if (_diskMonitorRunning) return;
  _diskMonitorRunning = true;
  const check = async () => {
    try {
      const freeMB = getFreeDiskMB();
      if (freeMB < DISK_CRITICAL_MB) {
        console.error(`[SALEVER] 🚨 حرج: ${freeMB}MB — تنظيف pre-keys فوري!`);
        await cleanAllPreKeys();
      } else if (freeMB < DISK_WARNING_MB) {
        console.warn(`[SALEVER] ⚠️ منخفض: ${freeMB}MB — تنظيف خفيف...`);
        await cleanAllPreKeys();
      }
    } catch (e) { console.error('[SALEVER] monitor error:', e.message); }
  };
  check();
  setInterval(check, DISK_CHECK_INTERVAL_MS);
  console.log(`[SALEVER] ✅ مراقب الديسك — فحص كل ${DISK_CHECK_INTERVAL_MS / 60000} دقيقة`);
}

function writeJSON(fp, data) {
  try {
    const freeMB = getFreeDiskMB();
    if (freeMB < 10) {
      console.error(`[SALEVER] ⛔ رفض الكتابة — ${freeMB}MB`);
      emergencyCleanup().catch(() => {});
      return false;
    }
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    const tmp = fp + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, fp);
    return true;
  } catch (e) {
    if (isENOSPC(e)) {
      console.error('[SALEVER] 🚨 ENOSPC في writeJSON — تنظيف طارئ...');
      try { fs.unlinkSync(fp + '.tmp') } catch {}
      emergencyCleanup().catch(() => {});
    }
    return false;
  }
}

let _baileysVersion = null;
let _baileysVersionTime = 0;
async function getBaileysVersion() {
  const now = Date.now();
  if (_baileysVersion && now - _baileysVersionTime < 30 * 60000) return _baileysVersion;
  try {
    const { version } = await fetchLatestBaileysVersion();
    _baileysVersion = version;
    _baileysVersionTime = now;
    return version;
  } catch { return _baileysVersion || [2, 3000, 0]; }
}

const LOCKS = new Map();
const ACTIVE_SESSIONS = new Map();
const RECONNECT_ATTEMPTS = new Map();
const SOCKET_STATES = new Map();

if (!Array.isArray(global.conns)) global.conns = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function acquireLock(key) {
  if (LOCKS.has(key)) throw new Error('LOCK_BUSY');
  LOCKS.set(key, true);
}
const releaseLock = key => LOCKS.delete(key);

function readJSON(fp, def = null) {
  try {
    if (!fs.existsSync(fp)) {
      if (def !== null) { writeJSON(fp, def); return def; }
      return null;
    }
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch { return def; }
}

const getMax = () => readJSON(LIMIT_FILE, { max: DEFAULT_MAX_INSTALLS })?.max || DEFAULT_MAX_INSTALLS;
const getStatus = () => {
  const d = readJSON(STATUS_FILE, { enabled: true, allowSubBotInstall: false });
  return { enabled: d.enabled !== false, allowSubBotInstall: d.allowSubBotInstall === true };
};
const loadInstalls = () => readJSON(INSTALLS_FILE, []);
const saveInstalls = a => writeJSON(INSTALLS_FILE, a);
const isInstalled = id => loadInstalls().includes(id);
const isChatBanned = id => readJSON(BANNED_CHATS_FILE, []).includes(id);

function addInstall(id) { const a = loadInstalls(); if (!a.includes(id)) { a.push(id); saveInstalls(a); } }
function removeInstall(id) { const a = loadInstalls(), i = a.indexOf(id); if (i >= 0) { a.splice(i, 1); saveInstalls(a); return true; } return false; }

function extractUserId(jid = '') { return jid.split('@')[0].split(':')[0]; }

function isBotConnected(userId) {
  try {
    if (!fs.existsSync(path.join(process.cwd(), JADI_FOLDER, userId, 'creds.json'))) return false;
    return global.conns.some(s => extractUserId(s?.user?.id || '') === userId && s?.ws?.readyState === 1);
  } catch { return false; }
}

function cleanupSession(userId, deleteDisk = false) {
  ACTIVE_SESSIONS.delete(userId);
  RECONNECT_ATTEMPTS.delete(userId);
  SOCKET_STATES.delete(userId);
  LOCKS.delete(`${userId}_lock`);
  if (deleteDisk) {
    const sp = path.join(process.cwd(), JADI_FOLDER, userId);
    if (fs.existsSync(sp)) try { fs.rmSync(sp, { recursive: true, force: true }) } catch {}
  }
}

function removeConnSocket(userId) {
  const i = global.conns.findIndex(s => extractUserId(s?.user?.id || '') === userId);
  if (i >= 0) {
    try { global.conns[i].ev?.removeAllListeners?.() } catch {}
    try { global.conns[i].ws?.terminate?.() } catch {}
    global.conns.splice(i, 1);
  }
}

let _handlerMod = null;
let _handlerCacheTime = 0;
async function getSubHandler() {
  const now = Date.now();
  if (_handlerMod && now - _handlerCacheTime < HANDLER_CACHE_TTL) return _handlerMod;
  try {
    _handlerMod = await import('../../handler.js');
    _handlerCacheTime = now;
    return _handlerMod;
  } catch (e) {
    console.error('[SALEVER] 🅇 فشل تحميل handler:', e.message);
    return null;
  }
}

const TEXT = {
  codeBody: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞🅇⟝─┈─┈─┈─╮
┃  خطوات ربط البوت الفرعي
╰─┈─┈─┈─⟞🅇⟝─┈─┈─┈─╯

┃ ١. افتح واتساب ← الإعدادات
┃ ٢. الأجهزة المرتبطة ← ربط جهاز
┃ ٣. اضغط: ربط برقم الهاتف
┃ ٤. أدخل الكود بالأسفل

> الكود صالح لـ 45 ثانية ✨`,

  qrBody: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞🅇⟝─┈─┈─┈─╮
┃  وضع QR كود
╰─┈─┈─┈─⟞🅇⟝─┈─┈─┈─╯

┃ ١. اضغط الثلاث نقاط أعلى اليمين
┃ ٢. اختر الأجهزة المتصلة
┃ ٣. امسح هذا الكود
┃ ⚠️ ينتهي خلال 45 ثانية!

> 🌿`,

  connected: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞✅⟝─┈─┈─┈─╮
┃  البوت الفرعي متصل
╰─┈─┈─┈─⟞✅⟝─┈─┈─┈─╯

┃ ✅ اتصل ودخل المجال
┃ 🛡️ الآن تحت الحماية

> ✨`,

  reconnecting: (cur, total) => `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞🔄⟝─┈─┈─┈─╮
┃  إعادة ربط البوتات الفرعية
╰─┈─┈─┈─⟞🔄⟝─┈─┈─┈─╯

┃ الجلسة: ${cur}/${total}

> ⏳`,

  reconnectDone: (ok, fail) => `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞✅⟝─┈─┈─┈─╮
┃  انتهت إعادة الربط
╰─┈─┈─┈─⟞✅⟝─┈─┈─┈─╯

┃ ✔️ ناجح: ${ok}
┃ ✖️ فاشل: ${fail}

> 🌿`,

  noOffline: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

لا توجد بوتات فرعية غير متصلة حالياً 🍃`,

  noSpace: (cur, max) => `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞🚫⟝─┈─┈─┈─╮
┃  لا توجد مساحات متاحة (${cur}/${max})
╰─┈─┈─┈─⟞🚫⟝─┈─┈─┈─╯

> جرّب لاحقاً ✨`,

  stopped: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

تم إيقاف البوت الفرعي بنجاح ✅

> 🌿`,

  alreadyConnected: userId => `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿

╭─┈─┈─┈─⟞⚠️⟝─┈─┈─┈─╮
┃  البوت (+${userId}) متصل بالفعل
┃  استخدم "إلغاء" لإيقافه أولاً
╰─┈─┈─┈─⟞⚠️⟝─┈─┈─┈─╯

> 🌿`
};

async function sendCodeMessage(conn, m, code) {
  const fmt = code.match(/.{1,4}/g)?.join('-') || code;
  try {
    let imageMessage = null;
    try {
      const prepared = await prepareWAMessageMedia({ image: { url: SALEVER_IMG } }, { upload: conn.waUploadToServer });
      imageMessage = prepared.imageMessage;
    } catch {}
    const built = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      interactiveMessage: {
        ...(imageMessage ? { header: { hasMediaAttachment: true, imageMessage } } : {}),
        body: { text: TEXT.codeBody },
        footer: { text: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓' },
        nativeFlowMessage: {
          buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: `🅇 انسخ الكود • ${fmt} 🅇`, copy_code: fmt }) }],
          messageParamsJson: ''
        }
      }
    }), { userJid: conn.user?.id, quoted: m });
    await conn.relayMessage(m.chat, built.message, { messageId: built.key.id });
  } catch {
    await conn.sendMessage(m.chat, { image: { url: SALEVER_IMG }, caption: `${TEXT.codeBody}\n\nالكود: ${fmt}` }, { quoted: m }).catch(() => {});
  }
}

async function sendConnectedMessage(conn, m) {
  if (!m?.chat) return;
  await conn.sendMessage(m.chat, { image: { url: SALEVER_IMG }, caption: TEXT.connected }, { quoted: m }).catch(() => {});
}

export async function initSubBots(conn) {
  startDiskMonitor();
  const installed = loadInstalls();
  if (!installed.length) { startHealthWatchdog(conn); return; }
  console.log(`[SALEVER] 🚀 إعادة تشغيل ${installed.length} بوت فرعي...`);
  let ok = 0, fail = 0;
  for (const userId of [...installed]) {
    try {
      const sessionPath = path.join(process.cwd(), JADI_FOLDER, userId);
      if (!fs.existsSync(path.join(sessionPath, 'creds.json'))) { console.warn(`[SALEVER] ⚠️ لا يوجد creds لـ ${userId}`); fail++; continue; }
      removeConnSocket(userId);
      cleanupSession(userId, false);
      await yukiJadiBot({ sessionPath, m: null, conn, userId, mode: 'code' });
      ok++;
      await sleep(100);
    } catch (e) { console.error(`[SALEVER] 🅇 فشل ${userId}:`, e.message); fail++; }
  }
  console.log(`[SALEVER] ✅ ناجح: ${ok} | 🅇 فاشل: ${fail}`);
  startHealthWatchdog(conn);
}

let _watchdogRunning = false;
export function startHealthWatchdog(conn, intervalMs = WATCHDOG_INTERVAL_MS) {
  if (_watchdogRunning) return;
  _watchdogRunning = true;
  setInterval(async () => {
    const installed = loadInstalls();
    for (const userId of installed) {
      try {
        const deadSocket = global.conns.find(s => extractUserId(s?.user?.id || '') === userId && s?.ws?.readyState !== 1);
        if (deadSocket) { removeConnSocket(userId); cleanupSession(userId, false); }
        if (!isBotConnected(userId) && !ACTIVE_SESSIONS.has(userId)) {
          const sessionPath = path.join(process.cwd(), JADI_FOLDER, userId);
          if (!fs.existsSync(path.join(sessionPath, 'creds.json'))) continue;
          const freeMB = getFreeDiskMB();
          if (freeMB < DISK_CRITICAL_MB) { console.warn(`[WATCHDOG] ⏸️ تأجيل ${userId} — ديسك ممتلئ`); await emergencyCleanup(); continue; }
          console.log(`[WATCHDOG] 🔄 إعادة تشغيل: ${userId}`);
          RECONNECT_ATTEMPTS.delete(userId);
          await yukiJadiBot({ sessionPath, m: null, conn, userId, mode: 'code' }).catch(e => console.error(`[WATCHDOG] 🅇 ${userId}:`, e.message));
          await sleep(1000);
        }
      } catch (e) { console.error(`[WATCHDOG] ⚠️ خطأ: ${userId}`, e.message); }
    }
  }, intervalMs);
  console.log(`[WATCHDOG] ✅ يعمل — فحص كل ${intervalMs / 1000}s`);
}

const handler = async (m, { conn, args, isOwner }) => {
  try {
    const principalJid = global.conn?.user?.id;
    const currentJid = conn.user?.id;
    const isSubBot = principalJid && !areJidsSameUser(principalJid, currentJid);
    const cmd = m.command || '';
    const arg0 = args[0]?.toLowerCase();
    const isStop = arg0 === 'إلغاء' || arg0 === 'الغاء' || arg0 === 'stop';
    const status = getStatus();
    const isInstallCmd = /^(qr|code)$/i.test(cmd);
    const isReconnectCmd = /^(تنصيب|reconnect)$/i.test(cmd);

    if (isReconnectCmd) {
      const installed = loadInstalls();
      const offline = installed.filter(uid => !isBotConnected(uid));
      if (!offline.length) return m.reply(TEXT.noOffline);
      let ok = 0, fail = 0;
      for (let idx = 0; idx < offline.length; idx++) {
        const uid = offline[idx];
        await m.reply(TEXT.reconnecting(idx + 1, offline.length));
        try {
          const sessionPath = path.join(process.cwd(), JADI_FOLDER, uid);
          if (!fs.existsSync(path.join(sessionPath, 'creds.json'))) { fail++; continue; }
          removeConnSocket(uid);
          cleanupSession(uid, false);
          RECONNECT_ATTEMPTS.delete(uid);
          await yukiJadiBot({ sessionPath, m: null, conn, userId: uid, mode: 'code' });
          ok++;
          await sleep(100);
        } catch { fail++; }
      }
      return conn.sendMessage(m.chat, { image: { url: SALEVER_IMG }, caption: TEXT.reconnectDone(ok, fail) }, { quoted: m }).catch(() => {});
    }

    if (isSubBot && isInstallCmd && !status.allowSubBotInstall) return;
    if (!status.enabled && !isOwner) return;
    if (isChatBanned(m.chat) && !isOwner) return;

    const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user?.id : m.sender);
    if (!who) return;
    const userId = extractUserId(who);
    if (!userId) return;

    const liveCount = global.conns.filter(s => s?.user && s?.ws?.readyState === 1).length;
    if (liveCount >= getMax() && !isInstalled(userId)) return m.reply(TEXT.noSpace(liveCount, getMax()));

    if (isStop) {
      removeConnSocket(userId);
      removeInstall(userId);
      cleanupSession(userId, true);
      return m.reply(TEXT.stopped);
    }

    const sessionPath = path.join(process.cwd(), JADI_FOLDER, userId);
    const mode = /^qr$/i.test(cmd) ? 'qr' : 'code';

    if (isBotConnected(userId)) return m.reply(TEXT.alreadyConnected(userId));
    if (ACTIVE_SESSIONS.has(userId)) return;

    if (!isInstalled(userId)) addInstall(userId);
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    await yukiJadiBot({ sessionPath, m, conn, userId, mode });

  } catch (e) { console.error('[SALEVER] handler error:', e.message); }
};

handler.usage = ["code", "qr", "تنصيب", "reconnect", "إلغاء"];
handler.command = ["code", "qr", "تنصيب", "reconnect", "إلغاء"];
handler.category = "sub";
export default handler;

export async function yukiJadiBot({ sessionPath, m, conn, userId, mode = 'code' }) {
  if (!userId) return;
  const lockKey = `${userId}_lock`;
  try {
    if (ACTIVE_SESSIONS.has(userId)) return;
    try { await acquireLock(lockKey); } catch (lockErr) { if (lockErr.message === 'LOCK_BUSY') return; throw lockErr; }
    if (ACTIVE_SESSIONS.has(userId)) { releaseLock(lockKey); return; }
    ACTIVE_SESSIONS.set(userId, Date.now());
    const { state, saveCreds: _saveCreds } = await useMultiFileAuthState(sessionPath);
    const version = await getBaileysVersion();
    const saveCreds = async () => {
      try {
        const freeMB = getFreeDiskMB();
        if (freeMB < 10) { await emergencyCleanup(); return; }
        cleanPreKeys(sessionPath);
        await _saveCreds();
      } catch (e) {
        if (isENOSPC(e)) { console.error(`[SALEVER] 🚨 ENOSPC في saveCreds (${userId})`); await emergencyCleanup(); }
        else { console.error(`[SALEVER] saveCreds error (${userId}):`, e.message); }
      }
    };
    const socketState = { codeSent: false, connectedSent: false, qrMsg: null };
    SOCKET_STATES.set(userId, socketState);
    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      browser: ['Ubuntu', 'Chrome', '120.0'], version, printQRInTerminal: false, markOnlineOnConnect: false,
      syncFullHistory: false, shouldSyncHistoryMessage: () => false, generateHighQualityLinkPreview: false,
      connectTimeoutMs: 30000, keepAliveIntervalMs: 25000, defaultQueryTimeoutMs: 60000, maxRetries: 5,
      msgRetryCounterCache: SHARED_RETRY_CACHE,
      getMessage: async key => { try { return (await sock?.store?.loadMessage?.(key.remoteJid, key.id))?.message || undefined; } catch { return undefined; } },
      patchMessageBeforeSending: msg => {
        if (msg.buttonsMessage || msg.templateMessage || msg.listMessage) {
          return { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} }, ...msg } } };
        }
        return msg;
      }
    };
    let sock = makeWASocket(connectionOptions);
    sock.isInit = false;
    let handlersAttached = false;
    const creloadHandler = async (restatConn = false) => {
      if (restatConn) {
        const oldChats = sock.chats;
        try { sock.ev?.removeAllListeners?.() } catch {}
        try { sock.ws?.terminate?.() } catch {}
        sock = makeWASocket(connectionOptions, { chats: oldChats });
        sock.isInit = false;
        handlersAttached = false;
      }
      if (handlersAttached) {
        sock.ev.off('messages.upsert', sock._msgHandler);
        sock.ev.off('connection.update', sock._connHandler);
        sock.ev.off('creds.update', sock._credsHandler);
      }
      sock._msgHandler = async ({ messages, type }) => {
        if (type !== 'notify') return;
        try {
          const mod = await getSubHandler();
          if (!mod?.handler) return;
          for (const msg of messages) {
            await mod.handler(sock, msg).catch(e => console.error(`[SALEVER] msg error (${userId}):`, e.message));
          }
        } catch (e) { console.error(`[SALEVER] upsert error (${userId}):`, e.message); }
      };
      sock._connHandler = connectionUpdate;
      sock._credsHandler = saveCreds;
      sock.ev.on('messages.upsert', sock._msgHandler);
      sock.ev.on('connection.update', sock._connHandler);
      sock.ev.on('creds.update', sock._credsHandler);
      handlersAttached = true;
    };
    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update;
      const st = SOCKET_STATES.get(userId);
      if (!st) return;
      if (isNewLogin) sock.isInit = false;
      if (qr && mode === 'qr' && m?.chat) {
        if (st.qrMsg?.key) conn.sendMessage(m.chat, { delete: st.qrMsg.key }).catch(() => {});
        try {
          const qrBuf = await qrcode.toBuffer(qr, { scale: 8 });
          st.qrMsg = await conn.sendMessage(m.chat, { image: qrBuf, caption: TEXT.qrBody }, { quoted: m }).catch(() => null);
          if (st.qrMsg?.key) setTimeout(() => conn.sendMessage(m.chat, { delete: st.qrMsg.key }).catch(() => {}), 45000);
        } catch (err) { console.warn(`[SALEVER] QR send failed: ${userId}`, err.message); }
        return;
      }
      if (qr && mode === 'code' && m && !st.codeSent) {
        st.codeSent = true;
        try {
          const code = await sock.requestPairingCode(userId);
          if (typeof code === 'string' && code.length > 0) { await sendCodeMessage(conn, m, code); }
          else { st.codeSent = false; }
        } catch (err) {
          console.warn(`[SALEVER] ${userId}: فشل الكود —`, err.message);
          st.codeSent = false;
          if (m?.chat) await m.reply(`فشل إرسال الكود (+${userId})، حاول مجدداً 🌿`).catch(() => {});
        }
      }
      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
      if (connection === 'open') {
        RECONNECT_ATTEMPTS.delete(userId);
        ACTIVE_SESSIONS.delete(userId);
        sock.isInit = true;
        const alreadyIn = global.conns.some(s => extractUserId(s?.user?.id || '') === userId);
        if (!alreadyIn && sock?.user) {
          global.conns.push(sock);
          if (!isInstalled(userId)) addInstall(userId);
          if (m && !st.connectedSent) { st.connectedSent = true; sendConnectedMessage(conn, m).catch(() => {}); }
        }
        try { await joinChannels(sock); } catch {}
        console.log(`\n✅ ${sock.user?.name || userId} (+${userId}) connected`);
        return;
      }
      if (connection === 'close') {
        if ([DisconnectReason.loggedOut, 401, 403, 405].includes(reason)) {
          console.warn(`[SALEVER] 🚫 جلسة (+${userId}) أُغلقت نهائياً — كود: ${reason}`);
          removeConnSocket(userId); removeInstall(userId); cleanupSession(userId, true); return;
        }
        if (reason === 440) {
          console.warn(`[SALEVER] ⚠️ جلسة (+${userId}) استُبدلت`);
          removeConnSocket(userId); cleanupSession(userId, false); return;
        }
        const attempts = (RECONNECT_ATTEMPTS.get(userId) || 0) + 1;
        if (attempts <= MAX_RECONNECT) {
          RECONNECT_ATTEMPTS.set(userId, attempts);
          ACTIVE_SESSIONS.delete(userId);
          removeConnSocket(userId);
          const delay = RECONNECT_BASE_DELAY * attempts;
          console.log(`[SALEVER] 🔄 إعادة ربط (+${userId}) — محاولة ${attempts}/${MAX_RECONNECT} بعد ${delay}ms`);
          setTimeout(() => { yukiJadiBot({ sessionPath, m: null, conn, userId, mode }).catch(() => {}); }, delay);
        } else {
          console.warn(`[SALEVER] ⏳ تجاوز الحد (+${userId}) — الـ Watchdog سيعيد`);
          removeConnSocket(userId); cleanupSession(userId, false); RECONNECT_ATTEMPTS.delete(userId);
        }
      }
    }
    await creloadHandler(false);
  } catch (e) {
    console.error(`[SALEVER] 🅇 ${userId}:`, e.message);
    cleanupSession(userId, false);
    if (m?.chat) await m.reply(`حدث خطأ أثناء ربط (+${userId})\nحاول مرة أخرى 🌿`).catch(() => {});
  } finally { releaseLock(lockKey); }
}

async function joinChannels(sock) {
  try {
    if (!global.ch || typeof global.ch !== 'object') return;
    for (const value of Object.values(global.ch)) {
      if (typeof value === 'string' && value.endsWith('@newsletter')) {
        await sock.newsletterFollow(value).catch(() => {});
      }
    }
  } catch {}
}