import fs from "fs";

const handler = async (m, { conn }) => {
    try {
        // 1️⃣ إرسال النص مع المنشن الخفي
        await conn.sendMessage(m.chat, {
            text: `> ◇𝒍𝒂𝒗𝒆 𝒊𝒏 𝒕𝒉𝒆 𝒑𝒐𝒘𝒆𝒓 🍻◇`,
            mentions: [m.sender]
        }, { quoted: m });

        // 2️⃣ مسار الفيديو المحلي
        const videoPath = './video/S.mp4';

        // 3️⃣ إرسال الفيديو الدائري مع المنشن الخفي
        const videoBuffer = fs.readFileSync(videoPath);

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            ptv: true,
            mimetype: 'video/mp4',
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, {
            text: '❌ تعذر إرسال الفيديو، تأكد من وجود S.mp4 داخل المجلد'
        }, { quoted: m });
    }
};

handler.usage = ["رون"];
handler.category = "other";
handler.command = ["رون"];

export default handler;

