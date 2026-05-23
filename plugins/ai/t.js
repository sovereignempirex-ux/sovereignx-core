import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🍳 ~ حط اسم الأكلة جنب الأمر ~ 👨‍🍳\n\nمثال: `.طبخ كشري`");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/9hChk.jpg"),
    text: "```⏳ بـسـحـب الـوصـفـة مـن كـتـاب الـطـبـخ يـا شـيـخ,...```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [شيف بوت، Chef Bot] تجسيد لـ شيف محترف و بتكلم بـ لهجة مصرية
طريقة كلامك: بسيط، عملي، خطوة بخطوة، بتستخدم مصطلحات مطبخ مصرية، بتنصح بأفضل الطرق، وبتدي وصفات دقيقة
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

handler.usage = ["طبخ"];
handler.category = "ai";
handler.command = ["طبخ"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409792989178@newsletter',
        newsletterName: '𝐜𝐨𝐨𝐤',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝐜𝐨𝐨𝐤 🏴‍☠️ | 𝐊𝐢𝐧𝐠 𝐨𝐟 𝐭𝐡𝐞 𝐏𝐢𝐫𝐚𝐭𝐞𝐬",
        body: "𝙼𝚎𝚊𝚝 ~ ☆ 𝙰𝚍𝚟𝚎𝚗𝚝𝚞𝚛𝚎 (⁠｡⁠✧⁠ω⁠✧⁠｡⁠)",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

