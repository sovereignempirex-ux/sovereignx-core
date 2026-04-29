import fs from "fs";

const handler = async (m, { conn }) => {
    const videoPath = './video/M.mp4';

    try {
        const videoBuffer = fs.readFileSync(videoPath);

        // رسالة نصية + منشن خفي
        await conn.sendMessage(m.chat, {
            text: `> 🍺M̸E̸D̸O̸R̸Y̸A̸ A̸T̸ Y̸O̸U̸R̸ S̸E̸R̸V̸I̸C̸E̸🍻`,
            mentions: [m.sender]
        }, { quoted: m });

        // فيديو + منشن خفي
        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            ptv: true,
            mimetype: 'video/mp4',
            mentions: [m.sender]
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, {
            text: '*❌≥ تعذر إرسال الفيديو M.mp4*'
        }, { quoted: m });
    }
};

handler.usage = ["ميـ亗دورياᴿ‿ْˣメ", "ميدوريا"];
handler.category = "other";
handler.command = ["ميـ亗دورياᴿ‿ْˣメ", "ميدوريا"];

export default handler;

