import fs from "fs";

const handler = async (m, { conn }) => {
    try {
        // 1️⃣ إرسال النص مع المنشن الخفي
        await conn.sendMessage(m.chat, {
            text: `> ◇𝒍𝒂𝒗𝒆 𝒊𝒏 𝒕𝒉𝒆 𝒑𝒐𝒘𝒆𝒓 🍻◇`,
            mentions: [m.sender]
        }, { quoted: m });

        // 2️⃣ مسار الفيديو المحلي
        const videoPath = './video/K.mp4';

        // 3️⃣ إرسال الفيديو الدائري مع المنشن الخفي
        const videoBuffer = fs.readFileSync(videoPath);

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            ptv: true,
            mimetype: 'video/mp4',
            mentions: [m.sender]
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, {
            text: '*❌≥ تعذر إرسال الفيديو K.mp4*'
        }, { quoted: m });
    }
};

handler.usage = ["كانيكي"];
handler.category = "other";
handler.command = ["كانيكي"];

export default handler;
