/* ========== Nasheed Downloader - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import crypto from "crypto";
import axios from "axios";
import yts from "yt-search";
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
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn");
    return res.data.cdn;
  }
  async download(url) {
    const id = url.match(this.m)?.[3];
    if (!id) throw "Invalid YouTube URL";
    const cdn = await this.getCdn();
    const info = await this.is.post(`https://${cdn}/v2/info`, { url: `https://www.youtube.com/watch?v=${id}` });
    const dec = await this.decrypt(info.data.data);
    const dl = await this.is.post(`https://${cdn}/download`, { id, downloadType: 'audio', quality: '128', key: dec.key });
    return { title: dec.title, duration: dec.durationLabel || dec.duration, thumb: dec.thumbnail, download: dl.data.data.downloadUrl };
  }
}

const NASHEED_QUERIES = [
  "دربنا درب طويل نشيد الحرب", "نشيد الحرب قادمون", "نشيد اثبت يا قلبي",
  "نشيد صليل الصوارم", "نشيد يا عابد الحرمين", "نشيد خيبر خيبر يا يهود",
  "نشيد قادم يا أقصى حماسي", "نشيد لبيك يا أقصى", "نشيد نحن جند الله",
  "نشيد أمتي قد لاح فجر", "نشيد عزة الاسلام", "نشيد يا رجال الله",
  "نشيد ديني حزين بدون موسيقى", "أناشيد إسلامية جهادية حماسية",
  "نشيد أين أسود السنة", "نشيد الحرب جهادي 2024", "نشيد قوة الايمان",
  "نشيد دعوني أناجي حبيبي", "نشيد غرباء", "نشيد نمضي على درب النضال"
];

const test = async (m, { conn, text }) => {
  try {
    let query = text?.trim();

    if (!query) {
      query = NASHEED_QUERIES[Math.floor(Math.random() * NASHEED_QUERIES.length)];
    }

    await conn.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } }).catch(() => {});

    const waitMsg = await m.reply(`${await getCalmResponse('thinking')}\n\n🔍 جاري البحث عن: ${query}`);

    const search = await yts(query + " نشيد");
    if (!search.videos.length) throw 'ما لقيت حتى نشيد';

    const videos = search.videos.slice(0, 5);
    const video = videos[Math.floor(Math.random() * videos.length)];

    await waitMsg.edit(`⚔️ تم اختيار: ${video.title}\n⏳ جاري التحميل...`);

    const st = new SaveTube();
    const res = await st.download(video.url);

    const caption = `⚔️ *نشيد الحرب / ديني*

📝 *العنوان:* ${res.title}
⏱️ *المدة:* ${res.duration}
🔗 *المصدر:* ${video.url}

✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓`;

    await conn.sendMessage(m.chat, {
      audio: { url: res.download },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "⚔️ نشيد",
          body: res.title,
          thumbnailUrl: res.thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {});

  } catch (e) {
    console.error('[nasheed]', e);
    await conn.sendMessage(m.chat, { react: { text: '🅇', key: m.key } }).catch(() => {});
    m.reply(`${await getCalmResponse('error')}\n\n🔍 ${e?.message || e}`);
  }
};

test.usage = ["نشيد", "نشيد <كلمات>", "اناشيد", "نشيد-حرب"];
test.command = ["نشيد", "اناشيد", "نشيد-حرب", "nashid", "nasheed"];
test.category = "islamic";
export default test;