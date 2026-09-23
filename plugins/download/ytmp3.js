/* ========== YouTube MP3 Downloader - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import crypto from "crypto";
import axios from "axios";
import { getCalmResponse } from "../../system/utils.js";

const SALEVER_IMG = 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg';

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
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn");
    return { status: true, data: res.data.cdn };
  }
  async download(url) {
    const id = url.match(this.m)?.[3];
    if (!id) throw "رابط يوتيوب غير صالح 🌿";
    const cdn = await this.getCdn();
    const info = await this.is.post(`https://${cdn.data}/v2/info`, { url: `https://www.youtube.com/watch?v=${id}` });
    const dec = await this.decrypt(info.data.data);
    const dl = await this.is.post(`https://${cdn.data}/download`, { id, downloadType: 'audio', quality: '128', key: dec.key });
    return { title: dec.title, duration: dec.duration, thumb: dec.thumbnail, download: dl.data.data.downloadUrl };
  }
}

const test = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(`📝 *الاستخدام:*\n.ytmp3 <رابط يوتيوب>\n\n*مثال:*\n.ytmp3 https://youtu.be/U2vyax9Uufc`);
  }
  
  const url = args[0];
  const st = new SaveTube();
  
  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    const waitMsg = await m.reply(await getCalmResponse('thinking'));
    
    const res = await st.download(url);
    let caption = `🎵 *${res.title}*\n⏱ *المدة:* ${res.duration}\n📦 *الصيغة:* MP3\n\n🌿 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`;

    await conn.sendMessage(m.chat, {
      audio: { url: res.download },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      caption
    }, { quoted: m });
    
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '🅇', key: m.key } });
    m.reply(`${await getCalmResponse('error')}\n\n🔍 ${e}`);
  }
};

test.usage = ["ytmp3 <youtube_url>"];
test.command = ["ytmp3", "ytmp3", "ytaudio"];
test.category = "download";
export default test;