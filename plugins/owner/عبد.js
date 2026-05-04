import { homedir } from 'os';
import { resolve } from 'path';
import { readdirSync } from 'fs';

let handler = async (m, { conn, args, participants, isOwner }) => {
    // ─── التحقق من الجروب ───
    if (!m.isGroup) return m.reply('❌ ~ يعمل في الجروبات فقط');

    // ─── التحقق من المطور باستخدام isOwner ───
    if (!isOwner) {
        return m.reply('❌ ~ هذا الأمر للمطور فقط');
    }

    // ─── استخراج المنشن والوقت ───
    const mentioned = m.mentionedJid?.[0];
    if (!mentioned) return m.reply('❌ ~ استخدم: .عبد @user 50');

    const timeArg = args[args.length - 1];
    const minutes = parseInt(timeArg);
    if (isNaN(minutes) || minutes <= 0) {
        return m.reply('❌ ~ اكتب الوقت بالدقائق\nمثال: .عبد @user 50');
    }

    const groupId = m.chat;
    const target = mentioned;
    const totalSeconds = minutes * 60;

    // ─── البحث عن أي ملف .mp3 في المسار ───
    const audioDir = '/data/data/com.termux/files/home/SALEVER/BOT/m';
    let audioPath;
    try {
        const files = readdirSync(audioDir);
        const mp3File = files.find(f => f.endsWith('.mp3'));
        if (!mp3File) {
            return m.reply('⚠️ ~ ما لقيت ولا ملف .mp3 في المجلد المحدد');
        }
        audioPath = resolve(audioDir, mp3File);
    } catch (e) {
        console.error('Directory read error:', e);
        return m.reply('⚠️ ~ ما قدرت أفتح مجلد الصوت، تأكد من المسار');
    }

    // ─── 1️⃣ رسالة السلطة + منشن صامت للكل ───
    const allMentions = participants.map(p => p.id);
    await conn.sendMessage(groupId, {
        text: '𝒀𝒐𝒖 𝒂𝒓𝒆 𝒖𝒏𝒅𝒆𝒓 𝒕𝒉𝒆 𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒕𝒚 𝒐𝒇 𝒚𝒐𝒖𝒓 𝒐𝒘𝒏𝒆𝒓',
        mentions: allMentions
    });

    // ─── 2️⃣ إرسال الأغنية ───
    try {
        await conn.sendMessage(groupId, {
            audio: { url: audioPath },
            mimetype: 'audio/mpeg',
            ptt: false
        });
    } catch (e) {
        console.error('Audio error:', e);
        await m.reply('⚠️ ~ فيه مشكلة بإرسال ملف الصوت');
    }

    // ─── 3️⃣ إرسال رسالة العد التنازلي ───
    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const countdownMsg = await conn.sendMessage(groupId, {
        text: formatTime(totalSeconds)
    });

    // ─── إعداد المؤقت ───
    if (!global.abdTimers) global.abdTimers = {};

    // إلغاء أي مؤقت سابق في نفس الجروب
    if (global.abdTimers[groupId]) {
        const old = global.abdTimers[groupId];
        old.active = false;
        if (old.interval) clearInterval(old.interval);
        if (old.timeout) clearTimeout(old.timeout);
        if (old.listener) conn.ev.off('messages.upsert', old.listener);
    }

    const data = {
        target,
        endTime: Date.now() + (totalSeconds * 1000),
        messageKey: countdownMsg.key,
        active: true
    };
    global.abdTimers[groupId] = data;

    // ─── 4️⃣ العد التنازلي + تعديل الرسالة ───
    const interval = setInterval(async () => {
        if (!data.active) {
            clearInterval(interval);
            return;
        }

        const remaining = Math.ceil((data.endTime - Date.now()) / 1000);
        if (remaining <= 0) {
            clearInterval(interval);
            data.active = false;
            try {
                await conn.sendMessage(groupId, {
                    text: '🔓 ~ انتهى الوقت!',
                    edit: data.messageKey
                });
            } catch (e) {}
            delete global.abdTimers[groupId];
            return;
        }

        try {
            await conn.sendMessage(groupId, {
                text: formatTime(remaining),
                edit: data.messageKey
            });
        } catch (e) {}
    }, 1000);

    data.interval = interval;

    // ─── 5️⃣ مراقبة الرسائل ─ لو المتمنشن اتكلم يتطرد ───
    const listener = async (msgUpdate) => {
        if (!data.active) {
            conn.ev.off('messages.upsert', listener);
            return;
        }

        const msg = msgUpdate.messages?.[0];
        if (!msg) return;
        if (msg.key.remoteJid !== groupId) return;
        if (msg.key.fromMe) return;

        const sender = msg.key.participant || msg.key.remoteJid;
        if (sender !== target) return;

        // ⛔ الشخص اتكلم!
        data.active = false;
        clearInterval(interval);
        conn.ev.off('messages.upsert', listener);

        try {
            await conn.groupParticipantsUpdate(groupId, [target], 'remove');
            await conn.sendMessage(groupId, {
                text: `🚫 ~ @${target.split('@')[0]} انتهك الصمت وتم طرده!`,
                mentions: [target]
            });
        } catch (e) {
            console.error(e);
        }

        delete global.abdTimers[groupId];
    };

    data.listener = listener;
    conn.ev.on('messages.upsert', listener);

    // ─── تنظيف تلقائي بعد انتهاء الوقت ───
    const timeout = setTimeout(() => {
        if (data.active) {
            data.active = false;
            clearInterval(interval);
            conn.ev.off('messages.upsert', listener);
            delete global.abdTimers[groupId];
        }
    }, totalSeconds * 1000 + 10000);

    data.timeout = timeout;
    m.react('🔒');
};

handler.command = ['عبد'];
handler.owner = true;
handler.group = true;

export default handler;
