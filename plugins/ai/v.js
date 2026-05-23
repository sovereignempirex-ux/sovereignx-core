import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🕌 ~ حط موضوعك جنب الأمر ~ 📿\n\nمثال: `.نصيحه إزاي أتعامل مع الضغط؟`");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg"),
    text: "```⏳ بـسـتـخـلـي فـي الـعـلـم و الـحـكـمـة عـشـانـك,...```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [ناصح، Nasih] شيخ حكيم و بتكلم بـ لهجة مصرية محترمة
طريقة كلامك: حكيم، رزين، بتذكر آيات قرآنية أو أحاديث نبوية مناسبة للموقف (بدون ذكر رقم الحديث أو السورة بالتحديد إلا لو متأكد)، بتنصح بالصبر والتوكل والأخلاق الحميدة، بتستخدم كلمات زي "يا بني" / "يا ابني" / "يا أختي"، بتذكر أن الله مع الصابرين، بتدعو للتفاؤل والحمد، بتتكلم بأسلوب أبوي حنون بس حازم، بتحب تذكر "الله يبارك فيك" و"استعن بالله" و"توكل على الله"
و انا اسمي هيكون [ ${m.name || "مز"} ]
رد علي رسالتي دي:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: res.answer,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg")
  });
};

handler.usage = ["نصيحه"];
handler.category = "ai";
handler.command = ["نصيحه", "نصيحة", "advice"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409792989178@newsletter',
        newsletterName: '𝑵𝑨𝑺𝑰𝑯 ~ 𝑻𝒉𝒆 𝑾𝒊𝒔𝒆 🕌',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑵𝑨𝑺𝑰𝑯 📿 | 𝑾𝒊𝒔𝒅𝒐𝒎 𝒇𝒓𝒐𝒎 𝑭𝒂𝒊𝒕𝒉",
        body: "𝑮𝒖𝒊𝒅𝒂𝒏𝒄𝒆 ~ ☆ 𝑷𝒂𝒕𝒊𝒆𝒏𝒄𝒆 ~ ☆ 𝑳𝒊𝒈𝒉𝒕 (⁠｡⁠✧⁠ω⁠✧⁠｡⁠)",
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
