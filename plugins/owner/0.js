const handler = async (m, { conn, participants }) => {
    // التحقق من صلاحية المطور
    if (!global.owner || !global.owner.some(([jid]) => jid === m.sender)) {
        return m.reply('❌ ~ هذا الأمر للمطور فقط');
    }

    if (!m.isGroup) {
        return m.reply('❌ ~ يستخدم هذا الأمر في الجروبات فقط');
    }

    const groupId = m.chat;
    const botJid = conn.user.id;
    
    // قائمة المطورين
    const ownerJids = (global.owner || [])
        .map(([jid]) => jid)
        .filter(Boolean)
        .map(jid => jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    try {
        // 1️⃣ قفل الشات (إعلان - فقط الأدمن يكتب)
        await conn.groupSettingUpdate(groupId, 'announcement');
        await m.reply('🔒 ~ تم قفل الشات');

        // 2️⃣ إنزال كل الأدمن (ما عدا البوت)
        const currentAdmins = participants
            .filter(p => p.admin && p.id !== botJid)
            .map(p => p.id);

        if (currentAdmins.length > 0) {
            await conn.groupParticipantsUpdate(groupId, currentAdmins, 'demote');
            await m.reply(`⬇️ ~ تم إنزال ${currentAdmins.length} أدمن`);
        }

        // 3️⃣ رفع المطورين
        const groupMembers = participants.map(p => p.id);
        const ownersInGroup = ownerJids.filter(jid => groupMembers.includes(jid));
        const missingOwners = ownerJids.filter(jid => !groupMembers.includes(jid));

        if (ownersInGroup.length > 0) {
            await conn.groupParticipantsUpdate(groupId, ownersInGroup, 'promote');
            await m.reply(`⬆️ ~ تم رفع ${ownersInGroup.length} مطور كأدمن`);
        }

        // إشعار بالمطورين اللي مش موجودين
        if (missingOwners.length > 0) {
            const missingList = missingOwners.map(j => '@' + j.split('@')[0]).join(', ');
            await m.reply(`⚠️ ~ مطورين غير موجودين في الجروب:\n${missingList}`, { mentions: missingOwners });
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
