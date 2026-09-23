/**
 * 📖 Time Manga Scraper & Downloader (Fixed Quality & PDF)
 * Original developer: Monte Dev — mangatime.org (tRPC)
 * Integrated & branded for: 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 · svcp
 *
 * ملاحظات التكامل:
 *   - meowsab لا يوفّر usedPrefix أصلاً، بل prefix — نقرأ الاثنين مع افتراضي '.'،
 *     وإلا لصبحت معرفات القوائم المنسدلة "undefinedتفاصيل-مانجا 1" وتعطل الاختيار.
 *   - cheeio كان مستورداً دون استخدام، فحُذف.
 *   - handler.tags يتجاهله القائمة؛ التصنيف عبر category + usage.
 *   - الأخطاء 🅇 + ردود هادئة، والبطاقات تحمل علامة 𝑺𝒂𝒍𝒆𝒗𝑒𝓇.
 */
import axios from 'axios';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

import { BRAND, getCalmResponse } from '../../system/config.js';

const SITE = 'https://mangatime.org';
const TRPC = `${SITE}/api/trpc/search.searchSeries`;
const TRPC_BASE = `${SITE}/api/trpc`;
const cache = new Map();
const FOOTER = `${BRAND} · svcp`;
const http = axios.create({
  timeout: 30000,
  maxContentLength: 12 * 1024 * 1024,
  maxBodyLength: 12 * 1024 * 1024,
  headers: {
    'accept': 'application/json,text/plain,*/*',
    'accept-language': 'ar,en;q=0.8',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/127 Mobile Safari/537.36',
    'referer': `${SITE}/browse`
  }
});

function trpcInput(query, limit = 10) {
  return {
    0: { json: {
      query,
      filters: { genres: [], status: undefined, type: undefined, sortBy: 'popularity-desc', rating: {}, yearRange: {}, chapterCount: {} },
      limit, page: 1, sortBy: 'popularity', sortOrder: 'desc'
    }}
  };
}

async function searchManga(query) {
  const params = new URLSearchParams({
    batch: '1',
    input: JSON.stringify(trpcInput(query))
  });
  const { data } = await http.get(`${TRPC}?${params.toString()}`);
  const payload = Array.isArray(data) ? data[0] : data;
  const result = payload?.result?.data?.json;
  if (!result?.results) throw new Error('استجابة البحث غير متوقعة');
  return result.results.map((item) => ({
    id: item.id,
    title: item.title || item.slug,
    slug: item.slug,
    type: item.type || 'غير معروف',
    status: item.status || 'غير معروف',
    rating: item.rating,
    chapters: item.chapterCount ?? 'غير معروف',
    cover: absolute(item.coverUrl),
    url: `${SITE}/${item.type === 'manga' ? 'manga' : 'manhwa'}/${item.slug}`
  }));
}

function absolute(value) {
  if (!value) return null;
  return new URL(value, SITE).href;
}

async function queryTrpc(path, input) {
  const params = new URLSearchParams({
    batch: '1',
    input: JSON.stringify({ 0: { json: input } })
  });
  const { data } = await http.get(`${TRPC_BASE}/${path}?${params.toString()}`);
  const payload = Array.isArray(data) ? data[0] : data;
  const result = payload?.result?.data?.json;
  if (!result) throw new Error(`استجابة tRPC غير متوقعة: ${path}`);
  return result;
}

async function fetchSeries(selected) {
  const series = await queryTrpc('content.getSeriesBySlug', { slug: selected.slug });
  const chaptersData = await queryTrpc('content.getChapters', { seriesId: selected.id, limit: -1 });
  const type = selected.type || series.type || 'manhwa';
  const pathType = type === 'manga' ? 'manga' : type === 'manhwa' ? 'manhwa' : type;
  const chapters = (chaptersData.chapters || [])
    .filter((chapter) => !chapter.isBlocked && chapter.isUnlocked !== false)
    .map((chapter) => ({
      number: String(chapter.number),
      title: chapter.title || `الفصل ${chapter.number}`,
      pageCount: chapter.pageCount,
      url: `${SITE}/${pathType}/${selected.slug}/chapter/${chapter.number}`
    }))
    .sort((a, b) => Number(b.number) - Number(a.number));
  return {
    title: series.title || selected.title,
    slug: selected.slug,
    type,
    chapters
  };
}

async function fetchChapterImages(slug, chapterNumber) {
  const data = await queryTrpc('content.getChapterPages', {
    seriesSlug: slug,
    chapterNumber: Number(chapterNumber)
  });
  return (data.pages || []).map(absolute).filter(Boolean);
}

async function downloadImages(urls, referer) {
  const buffers = [];
  for (const url of urls) {
    const response = await http.get(url, {
      responseType: 'arraybuffer',
      headers: { referer }
    });
    buffers.push(Buffer.from(response.data));
  }
  return buffers;
}

async function makePdf(images) {
  const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
  const chunks = [];
  const finished = new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
  let pages = 0;
  for (const buffer of images) {
    try {
      const png = await sharp(buffer).png().toBuffer();
      const image = doc.openImage(png);
      doc.addPage({ size: [image.width, image.height], margin: 0 });
      doc.image(image, 0, 0, { width: image.width, height: image.height });
      pages++;
    } catch (error) {
      console.error('[MangaTime] صورة صفحة غير صالحة:', error.message);
    }
  }
  if (!pages) throw new Error('لم توجد صور صالحة لإنشاء PDF');
  doc.end();
  return finished;
}

/* توقّع ردّ فاشل بلطف دون رمي استثناء */
async function reactFail(m) {
  try { await m.react?.('🅇'); } catch { /* تجاهل */ }
}

const handler = async (m, { conn, text, usedPrefix, prefix, command }) => {
  const cmd = String(command || '').toLowerCase();
  const key = m.sender || m.chat;
  const arg = String(text || '').trim();
  /* meowsab يمرّر prefix فقط — نقبل usedPrefix إن وُجد ثم نرجع لنقطة واحدة */
  const pfx = usedPrefix || prefix || '.';

  if (cmd === 'مانجا-تايم') {
    if (!arg) {
      return m.reply(
        `📖 *الاستخدام:*\n${pfx}${command} اسم المانجا\n` +
        `مثال: ${pfx}${command} Solo Leveling 🌿`
      );
    }
    await m.react?.('⏳');
    try {
      const results = await searchManga(arg);
      if (!results.length) {
        return m.reply(`🔎 ما لقيت نتائج لـ: *${arg}* 🌿\nجرّب اسم تاني أو أقرب ✨`);
      }
      cache.set(key, results);
      const first = results[0];
      const rows = results.slice(0, 10).map((item, index) => ({
        header: `📖 النتيجة ${index + 1}`,
        title: item.title.substring(0, 60),
        description: `📌 ${item.type} | 📚 ${item.chapters} فصل | ⭐ ${item.rating ?? 'غير معروف'}`,
        id: `${pfx}تفاصيل-مانجا ${index + 1}`
      }));
      let imageMessage = null;
      if (first.cover) {
        try {
          const content = await generateWAMessageContent({ image: { url: first.cover } }, { upload: conn.waUploadToServer });
          imageMessage = content.imageMessage;
        } catch (error) { console.error('[MangaTime] فشل رفع الغلاف:', error.message); }
      }
      const caption = `📖 *نتائج MangaTime لـ:* ${arg}\n` +
        `📊 *العدد:* ${results.length}\n\n` +
        `📌 *النتيجة الأولى:* ${first.title}\n` +
        `📂 *النوع:* ${first.type}\n` +
        `📚 *الفصول:* ${first.chapters}\n\n` +
        `🔽 *اختر المانجا لعرض معلوماتها وفصولها:*`;
      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: { text: caption },
          footer: { text: `${FOOTER} • اختر النتيجة` },
          header: imageMessage ? { hasMediaAttachment: true, imageMessage } : { hasMediaAttachment: false },
          nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📋 قائمة النتائج', sections: [{ title: '📚 اختر المانجا', rows }] }) }] }
        })}}
      }, { quoted: m });
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await m.react?.('✅');
    } catch (error) {
      await reactFail(m);
      await m.reply(`${getCalmResponse('error')}\n\n🅇 خطأ البحث: ${error.message}`);
    }
    return;
  }

  if (cmd === 'تفاصيل-مانجا') {
    if (!arg) return m.reply(`📖 استخدم: ${pfx}${command} رقم_النتيجة 🌿`);
    const results = cache.get(key) || [];
    const selected = /^\d+$/.test(arg) ? results[Number(arg) - 1] : results.find((x) => x.slug === arg);
    if (!selected) {
      return m.reply(
        `📂 مفيش نتيجة محفوظة ✨\n` +
        `نفّذ ${pfx}مانجا-تايم <اسم> الأول 🌿`
      );
    }
    await m.react?.('⏳');
    try {
      const series = await fetchSeries(selected);
      cache.set(key, { ...selected, ...series });
      const chapterRows = series.chapters.slice(0, 30).map((chapter, index) => ({
        header: `📖 الفصل ${chapter.number}`,
        title: `الفصل ${chapter.number}`,
        description: `🖼️ ${chapter.pageCount ?? '?'} صفحة | ${chapter.title}`.substring(0, 72),
        id: `${pfx}تنزيل-مانجا ${chapter.number}`
      }));
      const detailsText = `📚 *${series.title}*\n\n` +
        `📂 *النوع:* ${selected.type}\n` +
        `📌 *الحالة:* ${selected.status}\n` +
        `⭐ *التقييم:* ${selected.rating ?? 'غير معروف'}\n` +
        `📚 *الفصول المتاحة:* ${series.chapters.length}\n` +
        `🔗 *الرابط:* ${selected.url}\n\n` +
        `🔽 *اختر الفصل الذي تريد تنزيله كـ PDF:*`;
      let imageMessage = null;
      if (selected.cover) {
        try {
          const content = await generateWAMessageContent({ image: { url: selected.cover } }, { upload: conn.waUploadToServer });
          imageMessage = content.imageMessage;
        } catch (error) { console.error('[MangaTime] فشل رفع الغلاف:', error.message); }
      }
      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: { text: detailsText },
          footer: { text: `${FOOTER} • معلومات المانجا والفصول` },
          header: imageMessage ? { hasMediaAttachment: true, imageMessage } : { hasMediaAttachment: false },
          nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📋 قائمة الفصول', sections: [{ title: '📚 اختر الفصل', rows: chapterRows }] }) }] }
        })}}
      }, { quoted: m });
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await m.react?.('✅');
    } catch (error) {
      await reactFail(m);
      await m.reply(`${getCalmResponse('error')}\n\n🅇 خطأ استخراج الفصول: ${error.message}`);
    }
    return;
  }

  if (cmd === 'تنزيل-مانجا') {
    if (!arg) return m.reply(`📖 استخدم: ${pfx}${command} رقم_الفصل 🌿`);
    const selected = cache.get(key);
    if (!selected?.chapters) {
      return m.reply(`📂 نفّذ ${pfx}تفاصيل-مانجا <رقم> أولًا 🌿`);
    }
    const chapter = selected.chapters.find((c) => c.number === arg) || selected.chapters[Number(arg) - 1];
    if (!chapter) return m.reply(`📄 الفصل غير متاح 🌿\nاختار رقم فصل من القائمة ✨`);
    await m.react?.('⏳');
    try {
      const pageUrls = await fetchChapterImages(selected.slug, chapter.number);
      if (!pageUrls.length) return m.reply(`📄 ما لقيت صور صفحات عامة لهذا الفصل 🌿`);
      await m.reply(`📥 وجدت ${pageUrls.length} صفحة، جاري تجهيز PDF... ✨`);
      const pageBuffers = await downloadImages(pageUrls, chapter.url);
      const pdf = await makePdf(pageBuffers);
      await conn.sendMessage(m.chat, {
        document: pdf,
        mimetype: 'application/pdf',
        fileName: `MangaTime_${selected.slug}_chapter_${chapter.number}.pdf`,
        caption: `📖 ${selected.title}\n📄 الفصل ${chapter.number}\n🖼️ الصفحات: ${pageBuffers.length}`
      }, { quoted: m });
      await m.react?.('✅');
    } catch (error) {
      await reactFail(m);
      await m.reply(`${getCalmResponse('error')}\n\n🅇 خطأ تنزيل الفصل: ${error.message}`);
    }
  }
};

handler.command = /^(مانجا-تايم|تفاصيل-مانجا|تنزيل-مانجا)$/i;
handler.help = ['مانجا-تايم <اسم>', 'تفاصيل-مانجا <رقم>', 'تنزيل-مانجا <رقم الفصل>'];
handler.category = 'downloads';
handler.usage = ['مانجا-تايم <اسم>', 'تفاصيل-مانجا <رقم>', 'تنزيل-مانجا <رقم الفصل>'];
handler.tags = ['downloader'];
export default handler;
