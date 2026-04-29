import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

// 👨‍💻 معلومات المطورين
const OWNERS = [
  { name: "𝓡𝓮𝓷 ⑅⃝♡", jid: "218924499104@s.whatsapp.net" },
  { name: "♡◇ℳ𝒶𝓁𝒶𝓀◇♡", jid: "97431298191@s.whatsapp.net" }
];

// 🗂️ تخزين مؤقت للروابط والبحث
const tempStorage = new Map();
const userSessions = new Map();

// 🌐 نظام اكتشاف اللغة
function detectLanguage(input) {
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!input) return 'ar';
  if (arabicRegex.test(input)) return 'ar';
  return 'en';
}

// 🔍 كشف المنصة
function detectPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube ▶️';
  if (url.includes('tiktok.com')) return 'TikTok 🎵';
  if (url.includes('instagram.com')) return 'Instagram 📸';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook 📘';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X 🐦';
  return 'موقع الويب 🌐';
}

// 🎬 البحث بطريقة 1: yt-dlp
async function searchWithYtdlp(query) {
  try {
    const args = ['--dump-json', '--playlist-end', '10', `ytsearch10:${query}`];
    const result = await ytDlpExec(...args);
    return result.map(item => ({
      title: item.title,
      url: item.webpage_url || item.url,
      thumbnail: item.thumbnail,
      duration: item.duration,
      views: item.view_count,
      channel: item.uploader,
      source: 'ytdlp'
    }));
  } catch (e) {
    console.log("ytdlp failed, trying next...");
    return [];
  }
}

// 🎬 البحث بطريقة 2: Web Scraping (YouTube HTML)
async function searchWithScraping(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const results = [];
    
    // استخراج البيانات من السكريبت
    const scriptTag = $('script').filter((i, el) => {
      return $(el).html().includes('var ytInitialData');
    }).first();
    
    if (scriptTag.length) {
      const jsonStr = scriptTag.html().match(/var ytInitialData = (.+);/)[1];
      const jsonData = JSON.parse(jsonStr);
      const videos = jsonData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents || [];
      
      videos.forEach((item, idx) => {
        if (idx >= 10) return;
        const video = item.videoRenderer;
        if (video) {
          results.push({
            title: video.title?.runs[0]?.text || 'Unknown',
            url: `https://youtube.com/watch?v=${video.videoId}`,
            thumbnail: video.thumbnail?.thumbnails[0]?.url || '',
            duration: video.lengthText?.simpleText || '0:00',
            views: video.viewCountText?.simpleText || '0',
            channel: video.ownerText?.runs[0]?.text || 'Unknown',
            source: 'scraping'
          });
        }
      });
    }
    return results;
  } catch (e) {
    console.log("scraping failed, trying next...");
    return [];
  }
}

// 🎬 البحث بطريقة 3: Invidious API (بدون مفتاح)
async function searchWithInvidious(query) {
  try {
    const instances = [
      'https://vid.puffyan.us',
      'https://inv.riverside.rocks',
      'https://yt.artemislena.eu'
    ];
    
    const results = [];
    
    for (const instance of instances) {
      try {
        const { data } = await axios.get(`${instance}/api/v1/search?q=${encodeURIComponent(query)}`, {
          timeout: 5000
        });
        
        data.slice(0, 5).forEach(video => {
          results.push({
            title: video.title,
            url: `https://youtube.com/watch?v=${video.videoId}`,
            thumbnail: video.videoThumbnails?.[0]?.url || '',
            duration: formatSeconds(video.lengthSeconds),
            views: video.viewCount,
            channel: video.author,
            source: 'invidious'
          });
        });
        
        if (results.length > 0) break;
      } catch (e) { continue; }
    }
    return results;
  } catch (e) {
    return [];
  }
}

// 🎬 أمر البحث الرئيسي (يجمع كل الطرق)
async function searchCommand(m, { conn, text }) {
  try {
    if (!text) return m.reply("*💙 ~ اكتب اسم البحث ~ ❤️*");

    const lang = detectLanguage(text);
    const loadingMsg = await m.reply("🔍 ~ جاري البحث بـ 3 طرق مختلفة (yt-dlp + Scraping + API)...");

    // 🔄 محاولة البحث بـ 3 طرق
    let results = [];
    
    // المحاولة 1: yt-dlp
    if (results.length === 0) results = await searchWithYtdlp(text);
    
    // المحاولة 2: Web Scraping
    if (results.length === 0) results = await searchWithScraping(text);
    
    // المحاولة 3: Invidious API
    if (results.length === 0) results = await searchWithInvidious(text);

    if (results.length === 0) {
      await conn.sendMessage(m.chat, { delete: loadingMsg.key });
      return m.reply("*❌ ~ فشل البحث في جميع الطرق ~*\n*جرب لاحقاً أو غيّر كلمة البحث*");
    }

    await conn.sendMessage(m.chat, { 
      edit: loadingMsg.key, 
      text: `✅ ~ نجح البحث via: ${results[0]?.source || 'mixed'} (${results.length} نتيجة)` 
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));

    // 💾 حفظ النتائج للمستخدم
    const sessionId = `${m.chat}_${m.sender}`;
    userSessions.set(sessionId, {
      results: results,
      query: text,
      time: Date.now()
    });

    const cards = results.slice(0, 10).map((item, index) => {
      const linkId = `dl_${sessionId}_${index}`;
      tempStorage.set(linkId, item.url);
      
      return {
        imageUrl: item.thumbnail || 'https://via.placeholder.com/320x180?text=No+Image',
        bodyText: `*${item.title || 'Unknown'}*\n\n⏱️ ${item.duration || 'N/A'} • 👁️ ${formatViews(item.views)} • 👤 ${item.channel || 'Unknown'}`,
        footerText: `${detectPlatform(item.url)} • #${index + 1}`,
        buttons: [
          { 
            name: 'cta_url', 
            params: { display_text: '▶️╎ مـشـاهـدة', url: item.url } 
          },
          { 
            name: 'cta_copy', 
            params: { display_text: '📋╎ نـسـخ', copy_code: item.url } 
          },
          { 
            name: 'quick_reply', 
            params: { 
              display_text: '⬇️╎ تـنـزيـل', 
              id: `.يوتيوب ${item.url}`  // ✅ بيستخدم أمر .يوتيوب الموجود في البوت
            } 
          }
        ]
      };
    });

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    return await conn.sendCarousel(m.chat, {
      headerText: `🎬 نتائج البحث → *[ ${text} ]*`,
      globalFooterText: `👑 ${OWNERS.map(o => o.name).join(' & ')}`,
      cards: cards,
      mentions: [m.sender],
      newsletter: {
        name: '♡◇ℳ𝒶𝓁𝒶𝓀◇♡',  // ✅ تم التغيير هنا
        jid: '120363426301694741@newsletter'
      }
    });

  } catch (error) {
    console.error(error);
    m.react("❌");
    return m.reply("*❌ ~ خطأ غير متوقع ~*");
  }
}

// 🛠️ دوال مساعدة
function ytDlpExec(...args) {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', args, { shell: true });
    let output = '';
    ytdlp.stdout.on('data', (data) => output += data.toString());
    ytdlp.on('close', (code) => {
      if (code !== 0) return reject(new Error('Failed'));
      try {
        const lines = output.trim().split('\n').filter(l => l.startsWith('{'));
        resolve(lines.map(JSON.parse));
      } catch (e) { resolve([]); }
    });
  });
}

function formatSeconds(sec) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(count) {
  if (!count) return '0';
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}

// 📋 تعريف الأوامر
searchCommand.category = "search";
searchCommand.command = ["بحث", "فيديو", "yt", "search"];
searchCommand.desc = "بحث بـ 3 طرق (yt-dlp + Scraping + API)";

// ✅ تصدير فقط أمر البحث (التحميل بيستخدم أمر .يوتيوب الموجود)
export default searchCommand;
