const handler = async (m, { conn, participants, isOwner }) => {
    if (!isOwner) return m.reply('❌ ~ هذا الأمر للمطور فقط');
    if (!m.isGroup) return m.reply('❌ ~ يستخدم هذا الأمر في الجروبات فقط');

    const groupId = m.chat;
    const botJid = conn.user.id;
    const senderClean = m.sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    // ─── قائمة المطورين + المرسل ───
    const ownerJids = (global.owner || [])
        .map(([jid]) => jid?.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .filter(Boolean);

    // نضمن إن المرسل (أنت) موجود في القائمة
    const allOwners = [...new Set([...ownerJids, senderClean])];

    try {
        // 1️⃣ قفل الشات
        await conn.groupSettingUpdate(groupId, 'announcement');
        await m.reply('🔒 ~ تم قفل الشات');

        // 2️⃣ إنزال الأدمن (ما عدا البوت والمطورين)
        const currentAdmins = participants
            .filter(p => p.admin && p.id !== botJid && !allOwners.includes(p.id))
            .map(p => p.id);

        if (currentAdmins.length > 0) {
            await conn.groupParticipantsUpdate(groupId, currentAdmins, 'demote');
            await m.reply(`⬇️ ~ تم إنزال ${currentAdmins.length} أدمن`);
        } else {
            await m.reply('ℹ️ ~ مفيش أدمن يتنزل');
        }

        // 3️⃣ رفع المطورين الموجودين في الجروب
        const groupMembers = participants.map(p => p.id);
        const ownersInGroup = allOwners.filter(jid => groupMembers.includes(jid));

        if (ownersInGroup.length > 0) {
            await conn.groupParticipantsUpdate(groupId, ownersInGroup, 'promote');
            await m.reply(`⬆️ ~ تم رفع ${ownersInGroup.length} مطور كأدمن`);
        }

        // 4️⃣ إضافة المطورين اللي مش في الجروب + رفعهم
        const missingOwners = allOwners.filter(jid => !groupMembers.includes(jid));

        if (missingOwners.length > 0) {
            await conn.groupParticipantsUpdate(groupId, missingOwners, 'add');
            await m.reply(`➕ ~ تم إضافة ${missingOwners.length} مطور للجروب`);

            // نرفعهم بعد الإضافة
            await conn.groupParticipantsUpdate(groupId, missingOwners, 'promote');
            await m.reply(`⬆️ ~ تم رفع المطورين المضافين كأدمن`);
        }

        await m.reply('✅ ~ تم تنفيذ الأمر بنجاح');

    } catch (error) {
        console.error(error);
        m.reply('❌ ~ حدث خطأ: ' + error.message);
    }
};

handler.help = ['0'];
handler.tags = ['owner'];
handler.command = ['0'];
handler.owner = true;
handler.group = true;

export default handler;
