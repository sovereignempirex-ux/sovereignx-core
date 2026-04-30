let handler = async (m, {
    conn,
    bot
}) => {
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409792989178@newsletter',
        newsletterName: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿 👑 | بوت واتساب متطور",
        body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
        thumbnailUrl: img,
        sourceUrl: 'https://github.com/sovereignempirex-ux/sovereignx-core',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
const { images } = bot.config.info;
const img = images.random()
await conn.sendMessage(m.chat, {
  text: `
*╭───[ 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿 👑 ]───╮*
*│*
*│ 👤 المطور:* 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿
*│ 📧 الإيميل:* sovereign.empirex@gmail.com
*│*
*│ 🤖 رقم البوت:* +201283073813
*│ 📱 رقم المطور:* +9743198191
*│*
*│ 🌐 الموقع الرسمي:*
*│* https://animeplay306-dev.github.io/noho-website
*│*
*│ 📢 قناة البوت:*
*│* https://whatsapp.com/channel/0029Vb82Y93GehEEid2Xap23
*│*
*│ ⚙️ جروب التنصيب:*
*│* https://chat.whatsapp.com/EFoA83bbdfd0bwhmqEDobv
*│*
*│ 🆘 جروب الدعم:*
*│* https://chat.whatsapp.com/Eav8hCuSrBwJA2czM8zLLy
*│*
*│ 🐙 GitHub:*
*│* https://github.com/sovereignempirex-ux/sovereignx-core
*│*
*│ 📷 إنستجرام:*
*│* https://www.instagram.com/sovereign72026
*│*
*│ 🎵 تيك توك:*
*│* https://www.tiktok.com/@sovereignx8
*│*
*│ ▶️ يوتيوب:*
*│* https://youtube.com/@sovereignx-72
*│*
*│ 🧵 ثريدز:*
*│* https://www.threads.com/@sovereign72026
*│*
*│ 🐦 X (تويتر):*
*│* https://x.com/Skmkal
*│*
*│ 📘 فيسبوك:*
*│* https://www.facebook.com/share/g/1BYbxtS3EB/
*│*
*│ ⭐ لا تنسَ وضع نجمة للريبو 🌟*
*│*
*╰──────────────╯*
`,
  contextInfo: context(m.sender, img)
}, { quoted: m });
}
handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc", "script", "source"];

export default handler;
