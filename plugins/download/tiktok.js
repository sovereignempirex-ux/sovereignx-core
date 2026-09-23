/* ========== 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 · تيك توك (موجّه ذكي) ==========
 * .تيك <رابط>  → تنزيل الفيديو (ssstik)
 * .تيك <كلمة>  → بحث كاروسيل عبر plugins/search/tiktok.js
 *
 * نفس منطق الاتجاه: رابط ← تحميل، كلمة ← بحث.
 */

import crypto from 'crypto';
import cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

import { tiktokSearch } from '../search/tiktok.js';
import { getCalmResponse } from '../../system/config.js';

/* يُعامل كرابط: http/https، أو نطاق تيك توك يليه مسار */
const LINK_RE = /https?:\/\/\S+|www\.\S+|(?:[a-z0-9-]+\.)*tiktok\.com\/\S+|tikcdn\.\S+/i;

const ff = async (m, { text, conn, usedPrefix = '.', command } = {}) => {
  const q = String(text ?? '').trim();

  if (!q) {
    return m.reply(
      `${getCalmResponse('notFound')}\n\n` +
      `✎ رابط ← تنزيل الفيديو\n` +
      `✎ كلمة ← بحث في تيك توك\n\n` +
      `مثال: ${usedPrefix}تيك قطة`
    );
  }

  /* ---------- مسار 1: رابط ← تنزيل ---------- */
  if (LINK_RE.test(q)) {
    try {
      const videoData = await downloadTikTok(q);

      if (!videoData.videoUrl && !videoData.audioUrl) {
        try { await m.react('🅇'); } catch { /* تجاهل */ }
        return m.reply(`${getCalmResponse('error')}\n\n🅇 تعذّر تنزيل الفيديو 🌿`);
      }

      if (videoData.videoUrl) {
        await conn.sendMessage(m.chat, {
          video: { url: videoData.videoUrl },
          caption: `🌿 ${videoData.description || 'بدون وصف'}`
        });
      }

      if (videoData.audioUrl) {
        await conn.sendMessage(m.chat, {
          audio: { url: videoData.audioUrl },
          mimetype: 'audio/mpeg'
        });
      }
    } catch (error) {
      console.error('[tiktok]', error?.message || error);
      try { await m.react('🅇'); } catch { /* تجاهل */ }
      return m.reply(`${getCalmResponse('error')}\n\n🅇 تعذّر تنزيل الفيديو، جرّب الرابط تاني 🌿`);
    }
    return;
  }

  /* ---------- مسار 2: كلمة ← بحث ---------- */
  return tiktokSearch(m, { conn, text: q, usedPrefix, command });
};

ff.usage = ['تيك'];
ff.category = 'downloads';
ff.command = ['تيك', 'tiktok', 'tt'];
export default ff;


async function downloadTikTok(url) {

  let data = qs.stringify({
    'id': url,
    'locale': 'en',
    'tt': crypto.randomBytes(8).toString('hex'),
  });

  let config = {
    method: 'POST',
    url: 'https://ssstik.io/abc?url=dl',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  const response = await axios.request(config);
  const $ = cheerio.load(response.data);

  return {
    author: $('h2').first().text().trim(),
    description: $('.maintext').text().trim(),
    videoUrl: $('a[href*="tikcdn.io"]:not(#hd_download)').first().attr('href'),
    audioUrl: $('.download_link.music').attr('href'),
    hdVideo: $('#hd_download').attr('href')
  };
}
