/* ========== 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 · بحث تيك توك (كاروسيل) ==========
 * API البحث: monte-dev.online — تصميم وتطوير Monte Dev & ziad.
 *
 * شكل الكروت مطابق لمخطط meowsab لـ conn.sendCarousel:
 *   header{hasMediaAttachment} / body / footer / nativeFlowMessage{buttons}
 * وأزرار البطاقات من نوع Ue = { name, params } (نفس شكل qbtn/urlbtn/copybtn).
 *
 * الاستخدام:
 *   .تيك قطة       ← يمرّ عبر الموجّه الذكي في plugins/download/tiktok.js
 *   .بحث_تيك قطة   ← البحث مباشرة
 *
 * ملاحظة: مخطط meowsab يشترط cards.min(2)، لذا النتيجة الواحدة
 * أو أي فشل في الكاروسيل يسقط سريعاً إلى قائمة نصية — لا يضيع ردّ أبداً.
 */

import { BRAND, getCalmResponse } from '../../system/config.js';
import { CHANNEL_JID } from '../../system/ui.js';

const SEARCH_API = 'https://www.monte-dev.online/api/search/tiktok-search?q=';
const MAX_CARDS = 5;

/* ========== مساعدات ========== */
const isHttp = (u) => typeof u === 'string' && /^https?:\/\/\S+$/i.test(u.trim());

function thumbOf(v) {
  const a = v?.video?.thumbnail;
  const b = v?.video?.thumbnail_dynamic;
  return isHttp(a) ? a : (isHttp(b) ? b : '');
}

/* رابط موحّد أطول عمراً من رابط المعاينة الموقّع */
function watchUrl(v) {
  const user = v?.author?.username;
  if (user && v?.id) return `https://www.tiktok.com/@${user}/video/${v.id}`;
  return isHttp(v?.url) ? v.url : '';
}

function tidy(s, max = 200) {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

/* قائمة نصية بديلة (نتيجة واحدة أو فشل الكاروسيل) */
function plainList(q, videos, usedPrefix) {
  const rows = videos.slice(0, MAX_CARDS).map((v, i) => {
    const who = v?.author?.username ? '@' + v.author.username : 'TikTok';
    return `${i + 1}. ${tidy(v?.desc, 70) || 'بدون وصف'}\n   ${who}\n   ${watchUrl(v)}`;
  }).join('\n\n');

  return `🔎 نتائج بحث تيك توك → *[ ${q} ]*\n\n${rows}\n\n` +
         `✎ تنزيل: ${usedPrefix}تيك <رابط>\n` +
         `> ${BRAND} · svcp`;
}

/* ========== دالة البحث (تُستدعى أيضاً من الموجّه الذكي) ========== */
export async function tiktokSearch(m, { conn, text, usedPrefix = '.', command } = {}) {
  const q = String(text ?? '').trim();

  if (!q) {
    return m.reply(`${getCalmResponse('notFound')}\n\n✎ اكتب كلمة للبحث، مثال:\n${usedPrefix}تيك قطة`);
  }

  let loading = null;
  try {
    loading = await m.reply(`${getCalmResponse('thinking')}\n🔎 بحث عن: *${q}*`);
  } catch { /* لا نعترض */ }

  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(q));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const videos = (json?.result?.videos || [])
      .filter((v) => v && isHttp(watchUrl(v)) && thumbOf(v));

    if (!videos.length) {
      if (loading?.key?.id) await conn.sendMessage(m.chat, { delete: loading.key }).catch(() => {});
      return m.reply(`${getCalmResponse('notFound')}\n\n🔎 ما لقيت نتائج لـ *[ ${q} ]* 🌿\nجرّب كلمة تانية ✨`);
    }

    const cards = videos.slice(0, MAX_CARDS).map((v, i) => {
      const link = watchUrl(v);
      const st = v.stats || {};
      const tags = Array.isArray(v.hashtags) ? v.hashtags.slice(0, 3).join(' ') : '';

      const lines = [
        `*${tidy(v.desc) || 'بدون وصف'}*`,
        '',
        `👁️ ${st.plays || '—'} • ❤️ ${st.likes || '—'} • 💬 ${st.comments || '—'}`
      ];
      if (tags) lines.push('', tags);

      return {
        imageUrl: thumbOf(v),
        bodyText: lines.join('\n'),
        footerText: `${v.author?.username ? '@' + v.author.username : 'TikTok'} • #${i + 1}`,
        buttons: [
          { name: 'cta_url',     params: { display_text: '▶️╎ مـشـاهـدة', url: link } },
          { name: 'quick_reply', params: { display_text: '⬇️╎ تـنـزيـل',  id: `${usedPrefix}تيك ${link}` } },
          { name: 'cta_copy',    params: { display_text: '📋╎ نـسـخ',     copy_code: link } }
        ]
      };
    });

    if (loading?.key?.id) await conn.sendMessage(m.chat, { delete: loading.key }).catch(() => {});

    /* cards.min(2) في مخطط meowsab */
    if (cards.length >= 2 && typeof conn.sendCarousel === 'function') {
      try {
        return await conn.sendCarousel(m.chat, {
          headerText: `🔎 بحث تيك توك → *[ ${q} ]*`,
          globalFooterText: `${BRAND} · svcp`,
          cards,
          mentions: m.sender ? [m.sender] : [],
          newsletter: { name: BRAND, jid: CHANNEL_JID }
        });
      } catch (e) {
        console.error('[tiktok-search]', e?.message || e);
      }
    }

    return m.reply(plainList(q, videos, usedPrefix));
  } catch (error) {
    console.error('[tiktok-search]', error?.message || error);
    try { if (loading?.key?.id) await conn.sendMessage(m.chat, { delete: loading.key }); } catch { /* تجاهل */ }
    try { await m.react('🅇'); } catch { /* تجاهل */ }
    return m.reply(`${getCalmResponse('error')}\n\n🅇 تعذّر إكمال البحث الآن 🌿`);
  }
}

/* ========== الأمر ========== */
async function handler(m, ctx) {
  return tiktokSearch(m, ctx);
}

handler.category = 'search';
handler.usage = ['بحث_تيك'];
handler.command = ['tiktoksearch', 'بحث-تيك', 'بحث_تيك', 'تيك-بحث'];
export default handler;
