/* ========== Auto AI Reply - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style (Free AI) ========== */
/* رد تلقائي متصل بذكاء اصطناعي مجاني — يعمل داخل مجلد plugins/auto
 * - في الخاص: يرد على كل الرسائل (غير أوامر)
 * - في الجروب: يرد فقط عند منشن البوت أو الرد على رسالته
 * - مجاني بالكامل: Scrapy.ZeroAI ثم AiChat (pollinations) كاحتياط
 */

import { Scrapy } from "meowsab";
import { AiChat, getCalmResponse } from "../../system/utils.js";

/* =========== State (Toggle) ========== */
if (!global.autoAI) {
  global.autoAI = { enabled: true, cooldown: new Map() };
}
const COOLDOWN_MS = 5000; // 5 ثوانٍ لكل شات
const digits = (j) => (j || "").split("@")[0].split(":")[0];

/* =========== Free AI Helper ========== */
async function askAI(text, name) {
  const prompt =
    `أنت مساعد واتساب اسمه 𝑺𝒂𝒍𝒆𝒗𝒆ﺮ، رد بهدوء وأدب وجمال بالعربية ` +
    `(ويمكن الدارجة)، قصير ومفيد وسريع، بدون رموز 🅇، احترم من يكلمك. ` +
    `المستخدم ${name || "صديقي"} يقول: ${text}`;

  // 1) Scrapy.ZeroAI (مجاني)
  try {
    const { data } = await Scrapy.ZeroAI(text, prompt);
    if (data?.answer && String(data.answer).trim()) {
      return String(data.answer).trim();
    }
  } catch (_) {}

  // 2) AiChat / pollinations (مجاني - احتياط)
  try {
    const r = await AiChat({ text: encodeURIComponent(prompt), model: "openai" });
    if (r && typeof r === "string" && !r.trim().startsWith("<")) {
      return r.trim();
    }
  } catch (_) {}

  return null;
}

/* =========== Main Hook ========== */
export default async function before(m, { conn, bot }) {
  try {
    // تفضيلات المالك: تشغيل/ايقاف الرد التلقائي
    const raw = (m.text || "").trim();
    if (m.isOwner && raw) {
      if (/(ايقاف|وقف|تعطيل|اغلاق)[\s\S]*(الذكاء|الرد التلقائي|ai|الالكتروني)/i.test(raw)) {
        global.autoAI.enabled = false;
        await m.reply(`🅇 تم ايقاف الرد التلقائي 🌿`);
        return false;
      }
      if (/(تشغيل|تفعيل|شغّل|شغل)[\s\S]*(الذكاء|الرد التلقائي|ai|الالكتروني)/i.test(raw)) {
        global.autoAI.enabled = true;
        await m.reply(`🅇 تم تشغيل الرد التلقائي ✨`);
        return false;
      }
    }

    if (!global.autoAI.enabled) return false;
    if (m.fromMe) return false;            // لا يرد على نفسه
    if (bot?.isSubBot) return false;       // البوت الفرعي لا يشارك (تجنّب تكرار)
    if (!raw || raw.length < 2) return false;
    if (/^(status|broadcast)@/.test(m.chat)) return false;

    // تخطي الأوامر (تبدأ ببادئة) حتى تعمل أوامر البوت عادي
    const prefixes = [".", "/", "!"];
    if (prefixes.some((p) => raw.startsWith(p))) return false;

    // حد التبريد لكل شات
    const now = Date.now();
    const last = global.autoAI.cooldown.get(m.chat) || 0;
    if (now - last < COOLDOWN_MS) return false;

    // هل البوت مستهدف؟ (منشن أو رد على رسالته)
    const botNum = digits(conn.user?.id);
    const botLid = digits(conn.user?.lid);
    const mentioned =
      Array.isArray(m.mentionedJid) &&
      m.mentionedJid.some((j) => {
        const d = digits(j);
        return d && (d === botNum || (botLid && d === botLid));
      });
    const repliedToBot =
      m.quoted &&
      (m.quoted.fromMe === true ||
        (m.quoted.sender && digits(m.quoted.sender) === botNum));

    const isPrivate = !m.isGroup;

    // في الخاص يرد على كل شيء، في الجروب فقط عند استهداف البوت
    if (!isPrivate && !mentioned && !repliedToBot) return false;

    // تنظيف النص من المنشن قبل الإرسال للذكاء
    const clean = raw.replace(/@\d{5,}/g, "").trim();
    if (!clean) return false;

    global.autoAI.cooldown.set(m.chat, now);

    const name = m.pushName || m.name || "صديقي";
    const answer = await askAI(clean, name);
    if (!answer) return false;

    await m.reply(`${answer}\n\n✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 🅇`);
  } catch (e) {
    console.error("[autoAI]", e?.message || e);
  }

  return false;
}
