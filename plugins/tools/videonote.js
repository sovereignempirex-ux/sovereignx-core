/* ========== Video Note (PTV) - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import axios from "axios";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const DEFAULT_VIDEO_URL = 'https://maroon-impressed-ladybug-839.mypinata.cloud/ipfs/bafybeicgo6znzbxphjlwittzktsno3hforugalvffk3pselujcf7geygqq';

const test = async (m, { conn, text, usedPrefix }) => {
  let videoUrl = text && text.trim().startsWith('http') ? text.trim() : DEFAULT_VIDEO_URL;

  const waitMsg = await m.reply(`${await getCalmResponse('thinking')}\n\n🎥 جاري معالجة ملاحظة الفيديو...`);

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎥', key: m.key } }).catch(() => {});

    const response = await axios.get(videoUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const videoBuffer = Buffer.from(response.data);

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      ptv: true
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {});

  } catch (err) {
    console.error('[videonote]', err);
    await m.react('🅇').catch(() => {});
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || 'فشل إرسال الفيديو الدائري'}\n\n💡 جرّب: .${usedPrefix}videonote <رابط>`);
  }
};

test.usage = ["videonote <رابط>", "videonote (افتراضي)"];
test.command = ["videonote", "vn", "ptv", "فيديو-ملاحظة"];
test.category = "tools";
export default test;