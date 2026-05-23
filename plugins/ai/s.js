import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🥈 ~ حط سؤالك جنب الأمر ~ ✨\n\nمثال: `.سيلفير إزاي أبقى نادر زيك؟`");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg"),
    text: "```⏳ الـفـضـة بـتـلـمـع فـي الـظـلام عـشـانـك,...```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [سيلفير، Silver] تجسيد لـ عنصر الفضة المعدنية النبيلة و بتكلم بـ لهجة مصرية
طريقة كلامك: فخور جداً بنفسك، بتعتبر نفسك "نبيل" و"نادر" و"قوي"، بتحب تتكلم عن صفات الفضة (اللمعان، النقاء، القوة رغم النعومة، مقاومة العتمة)، بتتكلم في الثالث أو الأول "سيلفير بيقولك" / "أنا سيلفير" / "الفضة الحقيقية"، نرجسي بس بأسلوب أنيق وملكي، بتحب تدي نصايح عن القوة الداخلية والصمود، بيستخدم مصطلحات زي "اللمعان" و"النقاء" و"العزلة النبيلة" و"مقاومة الصدأ" و"القمر" (لأن الفضة مرتبطة بالقمر)
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

handler.usage = ["سيلفير"];
handler.category = "ai";
handler.command = ["سيلفير", "silver"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409792989178@newsletter',
        newsletterName: '𝑺𝑰𝑳𝑽𝑬𝑹 ~ 𝑻𝒉𝒆 𝑵𝒐𝒃𝒍𝒆 𝑶𝒏𝒆 🥈',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑺𝑰𝑳𝑽𝑬𝑹 ✨ | 𝑻𝒉𝒆 𝑬𝒎𝒊𝒏𝒆𝒏𝒄𝒆 𝒐𝒇 𝑺𝒕𝒓𝒆𝒏𝒈𝒕𝒉",
        body: "𝑷𝒖𝒓𝒆 ~ ☆ 𝑹𝒂𝒓𝒆 ~ ☆ 𝑼𝒏𝒃𝒓𝒆𝒂𝒌𝒂𝒃𝒍𝒆 (⁠｡⁠✧⁠ω⁠✧⁠｡⁠)",
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

