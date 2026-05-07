import { resolve } from 'path';
import { readdirSync } from 'fs';

let handler = async (m, { conn, participants, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ ~ يعمل في الجروبات فقط');
    if (!isOwner) return m.reply('❌ ~ هذا الأمر للمطور فقط');

    const groupId = m.chat;
    const botJid = conn.user.id;

    // ─── استخراج المطورين ───
    const ownerJids = (global.owner || [])
        .map(([jid]) => (jid?.replace(/[^0-9]/g, '') || '') + '@s.whatsapp.net')
        .filter(Boolean);

    // ─── استخراج صاحب الجروب (superadmin) ───
    const creator = participants.find(p => p.admin === 'superadmin');
    const creatorJid = creator ? creator.id : null;

    // ─── قائمة المحميين ───
    const protectedJids = new Set([
        botJid,
        ...ownerJids,
        ...(creatorJid ? [creatorJid] : [])
    ]);

    // ─── اللي هيتطردوا ───
    const toKick = participants
        .filter(p => !protectedJids.has(p.id))
        .map(p => p.id);

    if (toKick.length === 0) {
        return m.reply('ℹ️ ~ مفيش حد يتطرد (الجروب فاضي أو كلهم محميين)');
    }

    // ─── 1️⃣ البحث عن أغنية وإرسالها ───
    const audioDir = '/data/data/com.termux/files/home/SALEVER/BOT/m';
    let audioPath;
    try {
        const files = readdirSync(audioDir);
        const mp3File = files.find(f => f.endsWith('.mp3'));
        if (!mp3File) {
            return m.reply('⚠️ ~ ما لقيتش ولا ملف .mp3 في مجلد m');
        }
        audioPath = resolve(audioDir, mp3File);
    } catch (e) {
        return m.reply('⚠️ ~ ما قدرتش أفتح مجلد الأغاني');
    }

    try {
        await conn.sendMessage(groupId, {
            audio: { url: audioPath },
            mimetype: 'audio/mpeg',
            ptt: false
        });
    } catch (e) {
        console.error('Audio error:', e);
    }

    // ─── 2️⃣ الطرد الجماعي ───
    await m.reply(`🚫 ~ جاري طرد ${toKick.length} عضو...`);

    try {
        // طرد دفعة واحدة
        await conn.groupParticipantsUpdate(groupId, toKick, 'remove');

        await conn.sendMessage(groupId, {
            text: `✅ ~ تم طرد ${toKick.length} عضو بنجاح\n🔒 ~ المحميين: ${protectedJids.size} (البوت + المطورين + المالك)`,
            mentions: toKick
        });

    } catch (error) {
        console.error('Kick error:', error);
        m.reply('❌ ~ فشل في الطرد الجماعي: ' + error.message);
    }
};

handler.command = ['تحد'];
handler.owner = true;
handler.group = true;

export default handler;
