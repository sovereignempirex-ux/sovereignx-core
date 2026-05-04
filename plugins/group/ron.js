import fs from "fs";

const handler = async (m, { conn }) => {

    const videoPath = './video/S.mp4';

    try {

        const videoBuffer = fs.readFileSync(videoPath);

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            ptv: true, // 🔥 فيديو دائرة
            mimetype: 'video/mp4',
            jpegThumbnail: null
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
