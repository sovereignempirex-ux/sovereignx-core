/* ========== Downloader (YouTube) - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import crypto from "crypto";
import axios from "axios";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

class SaveTube {
  constructor() {
    this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
    this.m = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;
    this.is = axios.create({
      headers: {
        'content-type': 'application/json',
        'origin': 'https://yt.savetube.me',
        'user-agent': 'Mozilla/5.0 (Android 15; Mobile)'
      }
    });
  }
  async decrypt(enc) {
    const buf = Buffer.from(enc, 'base64');
    const key = Buffer.from(this.ky, 'hex');
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString());
  }
  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn");
    return res.data.cdn;
  }
  async download(url, type = 'video', quality = '720') {
    const id = url.match(this.m)?.[3];
    if (!id) throw "Invalid YouTube URL";
    const cdn = await this.getCdn();
    const info = await this.is.post(`https://${cdn}/v2/info`, { url: `https://www.youtube.com/watch?v=${id}` });
    const dec = await this.decrypt(info.data.data);
    const dl = await this.is.post(`https://${cdn}/download`, { id, downloadType: type, quality, key: dec.key });
    return { title: dec.title, duration: dec.durationLabel || dec.duration, thumb: dec.thumbnail, download: dl.data.data.downloadUrl };
  }
}

const test = async (m, { conn, args, usedPrefix, command }) => {
  if (!args.length) {
    return m.reply(`${await getCalmResponse('notFound')}\n\n📝 *الاستخدام:*\n${usedPrefix}${command} <رابط يوتيوب> [audio]\n\n*مثال:*\n${usedPrefix}${command} https://youtu.be/xxxx\n${usedPrefix}${command} https://youtu.be/xxxx audio`);
  }

  const url = args[0];
  const isAudio = /audio|mp3|صوت/i.test(args.slice(1).join(' ')) || /audio|mp3/i.test(command);
  const waitMsg = await m.reply(`${await getCalmResponse('thinking')}\n\n📥 جاري التحضير...`);

  try {
    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } }).catch(() => {});

    const st = new SaveTube();
    const res = await st.download(url, isAudio ? 'audio' : 'video', isAudio ? '128' : '720');

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: res.download },
        mimetype: 'audio/mpeg',
        fileName: `${res.title}.mp3`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "📥 تحميل صوتي",
            body: res.title,
            thumbnailUrl: res.thumb,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: res.download },
        caption: `📥 *تم التحميل بنجاح*\n\n📝 *العنوان:* ${res.title}\n⏱️ *المدة:* ${res.duration}\n🔗 *المصدر:* ${url}\n\n✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "📥 تحميل فيديو",
            body: res.title,
            thumbnailUrl: res.thumb,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {});

  } catch (err) {
    console.error('[download]', err);
    await conn.sendMessage(m.chat, { react: { text: '🅇', key: m.key } }).catch(() => {});
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || err}\n\n💡 جرّب رابط صحيح يوتيوب`);
  }
};

test.usage = ["download <رابط>", "dl <رابط> audio"];
test.command = ["download", "dl", "تنزيل", "تحميل", "ytvideo", "يتيوب"];
test.category = "download";
export default test;
