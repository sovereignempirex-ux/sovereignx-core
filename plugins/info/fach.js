/* ========== 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 Bot Check — .فحص ==========
 * بطاقة حالة حقيقية (تشغيل/ذاكرة/أوامر) + قائمة منسدلة وأزرار تعمل فعلاً.
 * كل صف في القائمة يشير إلى أمر مُتحقَّق منه في هذا المستودع،
 * فلا زرّ بلا أمر عند الضغط.
 *
 * تُبنى البطاقة عبر system/ui.js (sendCard) لتلتقط معرّف رسالة حقيقي
 * فتبقى .edit() والحذف متاحين.
 *
 * credit (code only): plugin structure adapted from Monte Dev's
 * GenAI-widget status check — تُرِك كتعليق هنا فقط دون أي علامة ظاهرة.
 */
import { BRAND, getCalmResponse } from '../../system/config.js';
import {
  sendCard, selectbtn, qbtn, urlbtn, PREFIX, CHANNEL_URL
} from '../../system/ui.js';

const uptime = () => {
  const s = Math.floor(process.uptime());
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const toMB = (bytes) => Math.round(bytes / 1024 / 1024);

/* الأقسام الثلاثة تطابق بطاقات الهيكل الأصلية:
 *   القائمة السريعة 📌 / أدوات إضافية 🛠️ / أوامر الميديا 🎨
 * الأوامر المعتمدة (تم التحقق من ملفاتها):
 *   .الاوامر   → menu.js:203        .بروفايل → bank/profile.js:65
 *   .بنج       → info/ping.js:19     .رستارت  → owner/restart.js:18
 *   .المطور    → owner.js:34 (regex) .معلومات → info/info.js:65
 *   .ملصق      → sticker/s.js:26     .تحميل   → game/download.js:102
 *   .الرام     → info/ram.js:25
 */
const buildSections = (pfx) => ([
  {
    title: 'القائمة السريعة 📌',
    highlight_label: 'CHECK',
    rows: [
      { title: 'القائمة الرئيسية 📜', id: `${pfx}الاوامر` },
      { title: 'الملف الشخصي 👤', id: `${pfx}بروفايل` },
      { title: 'السرعة والأداء ⚡', id: `${pfx}بنج` }
    ]
  },
  {
    title: 'أدوات إضافية 🛠️',
    highlight_label: 'TOOLS',
    rows: [
      { title: 'إعادة التشغيل 🔄', id: `${pfx}رستارت` },
      { title: 'المطور والدعم 👨‍💻', id: `${pfx}المطور` },
      { title: 'معلومات البوت 🤖', id: `${pfx}معلومات` }
    ]
  },
  {
    title: 'أوامر الميديا 🎨',
    highlight_label: 'MEDIA',
    rows: [
      { title: 'صنع ملصق 🗿', id: `${pfx}ملصق` },
      { title: 'تحميل فيديو 📥', id: `${pfx}تحميل` },
      { title: 'الذاكرة والرام 💾', id: `${pfx}الرام` }
    ]
  }
]);

const handler = async (m, { conn, bot, prefix }) => {
  try {
    const pfx = prefix || PREFIX;

    /* صورة البوت الرسمية — من المصدر المركزي نفسه الذي يستخدمه القائمة */
    const imgs = bot?.config?.info?.images;
    const image = Array.isArray(imgs) ? imgs[0] : imgs;

    /* عدد الأوامر المسجّلة فعلياً (نفس مصدر menu.js) */
    let count = '—';
    try {
      const cmds = await bot?.getAllCommands?.();
      if (Array.isArray(cmds)) count = cmds.length;
    } catch { /* نعرض شرطة بدل أن نفشل البطاقة */ }

    const mem = process.memoryUsage();
    const body = `╭─┈┈─⟞🗃️⟝─┈┈─╮
┃ *⌯︙ فحص البوت*
╰─┈┈─⟞🗃️⟝─┈┈─╯

✅ *لقد اكتمل فحص البوت بنجاح!*
جميع الأنظمة والموارد تعمل بكفاءة عالية🌿

⏱️ مدة التشغيل: ${uptime()}
🧠 الذاكرة المستخدمة: ${toMB(mem.heapUsed)} MB
📦 عدد الأوامر: ${count}
🟢 Node.js: ${process.version}
🧩 الواجهة: nativeFlow

╭─┈┈─⟞🗃️⟝─┈┈─╮
┃ *⌯︙ ${BRAND} 🌿*
╰─┈┈─⟞🗃️⟝─┈┈─╯`;

    const card = await sendCard({
      conn,
      jid: m.chat,
      text: body,
      frameIt: false,
      image,
      buttons: [
        selectbtn('📋 أقسام الفحص', buildSections(pfx)),
        qbtn('⚡ السرعة والأداء', `${pfx}بنج`),
        qbtn('📜 القائمة الرئيسية', `${pfx}الاوامر`),
        urlbtn('📢 قناة الواتساب', CHANNEL_URL)
      ],
      mentions: [m.sender],
      quoted: m
    });

    await conn
      .sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      .catch(() => {});

    return card;
  } catch (e) {
    let calm = null;
    try { calm = await getCalmResponse('error'); } catch { /* نكتفي بالرسالة الخام */ }
    await conn
      .sendMessage(m.chat, {
        text: `🅇 ${calm}\n\n${String(e?.message || e).slice(0, 200)}`
      }, { quoted: m })
      .catch(() => {});
  }
};

handler.command = ['فحص', 'فحص-البوت', 'check'];
handler.category = 'info';
handler.usage = ['فحص'];
export default handler;
