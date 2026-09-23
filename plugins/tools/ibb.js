/* ========== Image Uploader (ImgBB + Pixeldrain) - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import fetch from 'node-fetch';
import FormData from 'form-data';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const IMGBB_KEYS = [
  '7a38ad69727561d8adb5fcbbc7080e09',
  '33ab161c1a9ae4c282fa49fd77ac5b89'
];

function extractImageMessage(m) {
  try {
    const context = m.quoted ? m.quoted : m;
    if (!context) return null;
    if (context.mtype === 'imageMessage' || context.mediaType === 'image' || context.type === 'image') {
      return context.msg || context.message?.imageMessage || context;
    }
    const mime = context.mimetype || context.msg?.mimetype || '';
    if (mime.startsWith('image/')) return context.msg || context;
    const rootMsg = context.message || context.msg || context;
    if (rootMsg) {
      if (rootMsg.imageMessage) return rootMsg.imageMessage;
      if (rootMsg.viewOnceMessage?.message?.imageMessage) return rootMsg.viewOnceMessage.message.imageMessage;
      if (rootMsg.documentMessage && (rootMsg.documentMessage.mimetype || '').startsWith('image/')) return rootMsg.documentMessage;
    }
  } catch (error) { console.error('[IBB] Error extracting image:', error); }
  return null;
}

async function getMediaBuffer(imgMsg, m) {
  if (m.quoted && typeof m.quoted.download === 'function') {
    try {
      const buffer = await m.quoted.download();
      if (buffer && buffer.length > 500) return buffer;
    } catch (e) { console.log('[IBB] Primary download failed, trying fallback...'); }
  }
  try {
    const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
    const stream = await downloadContentFromMessage(imgMsg, 'image');
    let bufferList = [];
    for await (const chunk of stream) bufferList.push(chunk);
    const finalBuffer = Buffer.concat(bufferList);
    if (finalBuffer && finalBuffer.length > 500) return finalBuffer;
  } catch (e) { console.error('[IBB] Stream download error:', e); }
  return null;
}

async function uploadToImgBB(buffer, apiKey) {
  try {
    const base64Image = buffer.toString('base64');
    const form = new FormData();
    form.append('image', base64Image);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: form });
    const data = await response.json();
    if (data?.success && data.data?.url) return data.data.url;
  } catch (err) { console.error(`[IBB] ImgBB error with key ${apiKey.substring(0,5)}...:`, err.message); }
  return null;
}

async function uploadToPixeldrain(buffer) {
  try {
    const form = new FormData();
    form.append('file', buffer, { filename: `media_${Date.now()}.jpg` });
    const response = await fetch('https://pixeldrain.com/api/file', { method: 'POST', body: form });
    const data = await response.json();
    if (data?.id) return `https://pixeldrain.com/api/file/${data.id}`;
  } catch (err) { console.error('[IBB] Pixeldrain error:', err.message); }
  return null;
}

const test = async (m, { conn, usedPrefix, command }) => {
  const targetMsg = extractImageMessage(m);
  if (!targetMsg) return m.reply(`${await getCalmResponse('notFound')}\n\n📝 *الاستخدام:*\nرد على صورة واكتب .${command}`);

  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const imageBuffer = await getMediaBuffer(targetMsg, m);
    if (!imageBuffer || imageBuffer.length < 500) throw new Error('فشل تنزيل الصورة 🌿');

    let uploadedUrl = null, selectedProvider = '';

    uploadedUrl = await uploadToImgBB(imageBuffer, IMGBB_KEYS[0]);
    if (uploadedUrl) selectedProvider = 'ImgBB API (المفتاح الأساسي)';
    else {
      uploadedUrl = await uploadToImgBB(imageBuffer, IMGBB_KEYS[1]);
      if (uploadedUrl) selectedProvider = 'ImgBB API (المفتاح الاحتياطي)';
    }
    if (!uploadedUrl) {
      uploadedUrl = await uploadToPixeldrain(imageBuffer);
      if (uploadedUrl) selectedProvider = 'Pixeldrain';
    }

    if (!uploadedUrl) throw new Error('فشل الرفع على جميع الخوادم 🌿');

    const fileSizeKB = (imageBuffer.length / 1024).toFixed(2);
    const captionText = `✅ *تم رفع الصورة بنجاح!*

⚙️ *المحرك:* ${selectedProvider}
💾 *الحجم:* ${fileSizeKB} KB

🔗 *الرابط:*
${uploadedUrl}

🌿 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`;

    await conn.sendMessage(m.chat, { image: imageBuffer, caption: captionText }, { quoted: m });
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });

  } catch (error) {
    console.error('[IBB ERROR]:', error);
    m.reply(`${await getCalmResponse('error')}\n\n🔍 ${error.message || 'خطأ غير معروف'}`);
  }
};

test.usage = ["ibb (بالرد على صورة)"];
test.command = ["ibb", "upload", "رفع", "رفع-صورة"];
test.category = "tools";
export default test;