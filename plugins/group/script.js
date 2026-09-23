import { BOT_NUMBER, DEV_NUMBER } from "../../system/config.js";

let handler = async (m, {
    conn,
    bot
}) => {
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363412381946365@newsletter',
        newsletterName: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑺𝒂𝒍𝒆𝒗𝒆𝒓 🎪 | بوت واتساب مبنى على إطار 𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
        body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
const { images } = bot.config.info;
const img = images.random()
await conn.sendMessage(m.chat, { 
  text: `*╭───[ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 👑 ]───╮*
*│*
*│ 👤 المطور:* svcp
*│ 📧 الإيميل:* sovereign.empirex@gmail.com
*│*
*│ 🤖 رقم البوت:* +${BOT_NUMBER}
*│ 📱 رقم المطور:* +${DEV_NUMBER}
*│*
*│ 🌐 الموقع الرسمي:*
*│* https://animeplay306-dev.github.io/noho-website
*│*
*│ 📢 قناة البوت:*
*│* https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K
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
*╰──────────────╯*`,
  contextInfo: context(m.sender, img)
}, { quoted: reply_status });
}
handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc"];

export default handler;
