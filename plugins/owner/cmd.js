import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getCalmResponse, getXAsset } from "../../system/utils.js";
import { OWNER_NUMBERS } from "../../system/config.js";

const TMP = path.join(os.tmpdir(), 'salever_cmd');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

const FORBIDDEN_RE = /(rm\s+-rf|\bshutdown\b|\breboot\b|\bsudo\b|\bpasswd\b|\bmkfs\b|\bdd\s+if=|\bssh\b|\bnc\b|\bnetcat\b|>>|>\||\|\||\||;|\&\&)/i;

const MAX_OUT_CHARS = 2000;
const EXEC_TIMEOUT_MS = 60_000;
const MAX_BUFFER = 5 * 1024 * 1024;

const ownersFromEnv = (process.env.OWNER_JIDS || '').split(',').map(s => s.trim()).filter(Boolean);

let ownersFromGlobal = [];
try {
  if (typeof global !== 'undefined' && global.owner) {
    if (Array.isArray(global.owner)) ownersFromGlobal = global.owner.map(String);
    else ownersFromGlobal = [String(global.owner)];
  }
} catch (e) { ownersFromGlobal = [] }

const rawOwners = Array.from(new Set([...ownersFromEnv, ...ownersFromGlobal, ...OWNER_NUMBERS]));
const ownerDigitsSet = new Set();
const ownerJidSet = new Set();

for (const o of rawOwners) {
  if (!o) continue;
  const s = String(o).trim();
  if (s.includes('@')) ownerJidSet.add(s);
  const digits = s.replace(/\D/g, '');
  if (digits) {
    ownerDigitsSet.add(digits);
    ownerJidSet.add(`${digits}@s.whatsapp.net`);
    ownerJidSet.add(`${digits}@c.us`);
  }
}

function isOwnerJid(sender) {
  if (!sender) return false;
  const s = String(sender);
  const bare = s.split(':')[0];
  if (ownerJidSet.has(bare)) return true;
  const digits = bare.replace(/\D/g, '');
  if (digits && ownerDigitsSet.has(digits)) return true;
  return false;
}

const test = async (m, { conn, args, usedPrefix = '.' }) => {
  try {
    const sender = m?.sender || '';
    
    if (!isOwnerJid(sender)) {
      return m.reply(await getCalmResponse('permission'));
    }

    const cmd = (args || []).join(' ').trim();
    if (!cmd) return m.reply(`📝 الاستخدام: ${usedPrefix}cmd <shell command>\nمثال: ${usedPrefix}cmd uptime`);

    if (FORBIDDEN_RE.test(cmd)) {
      return m.reply(await getCalmResponse('error') + '\n\nالأمر يحتوي على عناصر محظورة للأمان 🌿');
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(()=>{});

    exec(cmd, { timeout: EXEC_TIMEOUT_MS, maxBuffer: MAX_BUFFER }, async (err, stdout, stderr) => {
      try {
        if (err && err.killed) {
          await m.reply('⏳ انتهت المهلة (timeout) أو تم إيقاف العملية.');
          return;
        }
        
        const out = (stdout || '').toString().trim();
        const errout = (stderr || '').toString().trim();
        let full = '';
        if (out) full += `--- stdout ---\n${out}\n`;
        if (errout) full += `--- stderr ---\n${errout}\n`;
        if (!full) full = 'لا توجد مخرجات.';

        if (full.length > MAX_OUT_CHARS) {
          const fname = `cmd_output_${Date.now()}.txt`;
          const fpath = path.join(TMP, fname);
          fs.writeFileSync(fpath, full, 'utf8');
          await conn.sendMessage(m.chat, { document: fs.readFileSync(fpath), fileName: fname, mimetype: 'text/plain' }, { quoted: m });
          try { fs.unlinkSync(fpath) } catch {}
          return;
        }

        const preview = full.length > 1500 ? (full.slice(0,1500) + '\n\n... (مختصر)') : full;
        await conn.sendMessage(m.chat, { text: `✅ الأمر: \`${cmd}\`\n\n${preview}` }, { quoted: m });
      } catch (e) {
        console.error('cmd send error', e);
      }
    });

  } catch (e) {
    console.error('cmd handler error', e);
    try { await m.reply(await getCalmResponse('error')); } catch {}
  }
};

test.usage = ["cmd <shell command>"];
test.command = ["cmd", "sh", "shell"];
test.category = "owner";
export default test;