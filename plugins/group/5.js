const handler = async (m, { conn }) => {
    // 👤 تحديد المستخدم (رد / منشن / المرسل)
    let who = m.quoted ? m.quoted.sender 
            : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] 
            : m.sender;

    // ✅ تأكد إن الـ JID صحيح
    if (!who.includes('@s.whatsapp.net') && !who.includes('@g.us')) {
        who = who.includes('@') ? who : who + '@s.whatsapp.net';
    }

    try {
        // 🖼️ جلب صورة البروفايل
        let pp;
        try {
            pp = await conn.profilePictureUrl(who, 'image');
        } catch (err) {
            console.log('Profile pic error:', err.message);
            pp = 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg';
        }

        // 👤 جلب الاسم
        let name;
        try {
            name = await conn.getName(who);
        } catch {
            name = who.split('@')[0];
        }

        const id = who.split('@')[0];

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: `*👤 الاسم:* ${name || 'غير معروف'}\n*🆔 الـ ID:* ${id}\n*📱 الرقم:* @${id}`,
            mentions: [who]
        }, { quoted: m });

    } catch (e) {
        console.error('Error in 5 command:', e);
        await conn.sendMessage(m.chat, {
            text: '*❌≥ تعذر جلب بيانات المستخدم*\n\n*تأكد من:*\n• أن المستخدم ليس مخفياً\n• أنك منشن شخص صحيح\n• أو رد على رسالته'
        }, { quoted: m });
    }
};

handler.usage = ["5 @منشن", "5 (رد على رسالة)"];
handler.category = "group";
handler.command = ["5"];

export default handler;
