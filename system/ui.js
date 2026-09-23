/* ========== 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 Modern UI Kit (Internal) ==========
 * طبقة موحّدة للقوائم والأزرار — بدون أي استيراد خارجي.
 *
 * كيف تعمل:
 *   plugins/auto/0-ui.js يستدعي installUI() مرة واحدة لكل رسالة،
 *   فيتم ترقية m.reply فقط، فتصبح كل الأوامر الـ159 ترسل بطاقات
 *   حديثة (nativeFlow) تلقائياً دون لمس أي ملف أمر.
 *
 * لماذا لا نرقّي conn.sendMessage؟
 *   لأن عدة بلاغات تلتقط نتيجته وتستخدمها لاحقاً:
 *     edit:   hack.js (مراحل التهكير) وعبد.js (العدّاد التنازلي)
 *     quoted: yahyah.js (تنبيه الطرد قبل الطرد)
 *   تعديل أو اقتباس رسالة بطاقية (interactive) مرفوض من واتساب،
 *   فتصبح هذه الأوامر صامتة. الأصل (نص عادي بمفتاح حقيقي) هو الصحيح.
 *
 * ملاحظات أمان:
 *   - sendButton يذهب إلى relayMessage مباشرةً (لا تكرار مع sendMessage)
 *     ويُعيد undefined، لذلك نلتقط المعرّف الحقيقي من خيارات relayMessage
 *     عبر تغليف مؤقت + قفل تسلسلي يمنع تداخل الالتقاط.
 *   - أي فشل يعود سريعاً إلى النص الأصلي، فلا يضيع رد أبداً.
 *   - النص الطويل جداً يُرسل نصاً عادياً كما هو.
 *   - النتيجة تحمل دائماً .key حقيقياً (لحذف رسالة "انتظر") و .edit().
 */

import { BRAND } from './config.js';

/* ========== ثوابت العلامة ========== */
export const PREFIX = '.';
export const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K';
export const CHANNEL_JID = '120363412381946365@newsletter';
export const FOOTER = `${BRAND} · svcp`;
export const MAX_TEXT = 5000;

/* ========== مصانع الأزرار (nativeFlow) ========== */
export const qbtn = (label, id) => ({
  name: 'quick_reply',
  params: { display_text: String(label), id: String(id).trim() }
});

export const urlbtn = (label, url) => ({
  name: 'cta_url',
  params: { display_text: String(label), url: String(url) }
});

export const copybtn = (label, code) => ({
  name: 'cta_copy',
  params: { display_text: String(label), copy_code: String(code) }
});

export const callbtn = (label, phone) => ({
  name: 'cta_call',
  params: { display_text: String(label), phone_number: String(phone) }
});

export const selectbtn = (title, sections) => ({
  name: 'single_select',
  params: { title: String(title), sections }
});

/* ========== أزرار التنقل القياسية ========== */
export const homeButtons = () => [
  qbtn('❑ القائمة', `${PREFIX}الاوامر`),
  urlbtn('◈ القناة', CHANNEL_URL)
];

/* ========== إطار البطاقة ========== */
export const frame = (text) =>
  `╭─┈┈─⟞🅇⟝─┈┈─╮\n┃ *${BRAND} 🌿*\n╰─┈┈─⟞🅇⟝─┈┈─╯\n\n${String(text).replace(/\s+$/, '')}`;

/* ========== مفتاح رسالة حقيقي مُعاد بناؤه ==========
 * نحتاج فقط ما تستخدمه البلاغات فعلياً:
 *   .key.id   → الحذف (24 موقعاً)
 *   .key      → الحذف الكامل و edit: (video-downloader, ai/q, web)
 *   .edit()   → s.js, h.js, nasheed.js (لم تكن موجودة أصلاً في meowsab) */
function makeKey(jid, id) {
  return { id: id || null, remoteJid: jid, fromMe: true };
}

/* .edit() = حذف البطاقة القديمة ثم إرسال نص جديد،
 * مع تحديث نفس المفتاح ليشير إلى الرسالة الجديدة،
 * حتى ينجح الحذف اللاحق (nasheed.js و video-downloader.js). */
function makeEdit(conn, jid, key) {
  return async function edit(newText) {
    try {
      if (key.id) {
        await conn.sendMessage(jid, {
          delete: { id: key.id, remoteJid: key.remoteJid, fromMe: key.fromMe !== false }
        });
      }
    } catch { /* لا نعترض */ }

    try {
      const sent = await conn.sendMessage(jid, { text: String(newText ?? '') });
      if (sent && sent.key) {
        key.id = sent.key.id || key.id;
        key.remoteJid = sent.key.remoteJid || key.remoteJid;
      }
      return sent;
    } catch {
      return null;
    }
  };
}

/* ========== قفل تسلسلي لالتقاط المعرّف ==========
 * تغليف relayMessage مؤقتاً حول sendButton؛ القفل يمنع أن تلتقط
 * إرسالتان متزامنتان المعرّف الخاطئ. */
let captureChain = Promise.resolve();

async function sendAndCapture(conn, work) {
  const prev = captureChain;
  let release;
  captureChain = new Promise((resolve) => { release = resolve; });
  await prev;

  const hadOwn = Object.prototype.hasOwnProperty.call(conn, 'relayMessage');
  const original = conn.relayMessage;
  let capturedId = null;

  try {
    conn.relayMessage = function (jid, content, options) {
      if (!capturedId && options && typeof options.messageId === 'string') {
        capturedId = options.messageId;
      }
      return original.apply(this, arguments);
    };

    const result = await work();
    return { result, messageId: capturedId };
  } finally {
    if (hadOwn) conn.relayMessage = original;
    else delete conn.relayMessage;
    release();
  }
}

/* ========== إرسال بطاقة ========== */
export async function sendCard(opts) {
  const {
    conn, jid, text,
    frameIt = true,
    buttons,
    footer = FOOTER,
    mentions = [],
    newsletter = { name: BRAND, jid: CHANNEL_JID },
    quoted,
    image
  } = opts || {};

  if (!conn || !jid || typeof conn.sendButton !== 'function') {
    throw new Error('sendCard: conn.sendButton غير متاح');
  }
  if (typeof conn.relayMessage !== 'function') {
    /* لا نرسل بطاقة أصلاً حتى لا تُرسل بدون معرّف (سيسقط المتراجع للنص الأصلي) */
    throw new Error('sendCard: conn.relayMessage غير متاح');
  }

  const payload = {
    bodyText: frameIt ? frame(text) : String(text ?? ''),
    footerText: footer,
    buttons: Array.isArray(buttons) ? buttons : homeButtons(),
    mentions: Array.isArray(mentions) ? mentions : [],
    newsletter
  };
  if (image) payload.imageUrl = image;

  const { messageId } = await sendAndCapture(
    conn,
    () => conn.sendButton(jid, payload, quoted)
  );

  const key = makeKey(jid, messageId);
  return { key, edit: makeEdit(conn, jid, key) };
}

/* ========== تزيين نتيجة النص الأصلي ==========
 * حتى تبقى .edit() متاحة حتى لو سقطنا للمسار الأصلي. */
function decorate(msg, conn) {
  try {
    if (msg && msg.key && typeof msg.edit !== 'function') {
      msg.edit = makeEdit(conn, msg.key.remoteJid, msg.key);
    }
  } catch { /* تزيين اختياري */ }
  return msg;
}

/* ========== بديل مُرقّى لـ m.reply ==========
 * fallback = الدالة الأصلية للرجوع إليها عند أي مشكلة. */
export async function modernReply(m, text, opts, fallback, conn) {
  const plain = async () => {
    try {
      return decorate(await fallback(text, opts), conn);
    } catch {
      return null;
    }
  };

  try {
    if (!m || typeof text !== 'string' || !text.trim()) return plain();
    if (text.length > MAX_TEXT) return plain();

    return await sendCard({
      conn,
      jid: m.chat,
      text,
      buttons: homeButtons(),
      mentions: m.sender ? [m.sender] : [],
      quoted: m
    });
  } catch {
    return plain();
  }
}

/* ========== كشف الرسالة النصية البسيطة ========== */
const PLAIN_KEYS = new Set(['text', 'mentions']);

function isPlain(content) {
  if (!content || typeof content !== 'object') return false;
  if (typeof content.text !== 'string' || !content.text.trim()) return false;
  if (content.text.length > MAX_TEXT) return false;
  for (const k of Object.keys(content)) if (!PLAIN_KEYS.has(k)) return false;
  return true;
}

/* ========== تغليف conn.sendMessage (غير مُفعَّل افتراضياً) ==========
 * موجود للتوافق فقط. لا يُستدعى من installUI؛ انظر التعليق في رأس الملف:
 * hack.js وعبد.js وyahyah.js تعتمد على edit:/quoted: لرسائل {text}
 * المباشرة، وتحويلها إلى بطاقات يُعطّلها. */
export function wrapConn(conn) {
  try {
    if (!conn || typeof conn.sendMessage !== 'function' || conn.__svUI) return false;
    if (typeof conn.sendButton !== 'function') return false;

    try {
      Object.defineProperty(conn, '__svUI', { value: true, enumerable: false, configurable: true });
    } catch { conn.__svUI = true; }

    const orig = conn.sendMessage.bind(conn);

    conn.sendMessage = async (jid, content, opts) => {
      if (isPlain(content)) {
        try {
          return await sendCard({
            conn,
            jid,
            text: content.text,
            buttons: homeButtons(),
            mentions: content.mentions || [],
            quoted: opts && opts.quoted
          });
        } catch { /* نعود للمسار الأصلي */ }
      }
      return orig(jid, content, opts);
    };

    return true;
  } catch {
    return false;
  }
}

/* ========== التركيب الكامل لكل رسالة ========== */
export function installUI(m, conn) {
  try {
    if (!m || typeof m.reply !== 'function' || !conn) return false;

    if (!m.__svUI) {
      try {
        Object.defineProperty(m, '__svUI', { value: true, enumerable: false, configurable: true });
      } catch { m.__svUI = true; }

      const original = m.reply.bind(m);
      m.reply = (text, opts) => modernReply(m, text, opts, original, conn);
    }

    /* مقصود: لا نستدعي wrapConn — انظر رأس الملف. */
    return true;
  } catch {
    return false;
  }
}

export default { installUI, wrapConn, sendCard, modernReply, frame, homeButtons, qbtn, urlbtn, copybtn, callbtn, selectbtn, FOOTER, PREFIX, CHANNEL_URL, CHANNEL_JID };
