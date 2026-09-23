/* ========== Get LID/Number - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import { getCalmResponse } from "../../system/utils.js";

function decodeJid(jid) {
    try {
        const user = jid.split(':')[0];
        if (user.includes('@')) return user;
        return user + '@s.whatsapp.net';
    } catch {
        return jid?.split('@')[0] + '@s.whatsapp.net';
    }
}

const test = async (m, { conn, args }) => {
    try {
        const groupJid = m.chat;
        const sender = decodeJid(m.sender);
        let targetJid;

        const contextInfo = m.message?.extendedTextMessage?.contextInfo || {};
        const mentionedJid = contextInfo.mentionedJid;
        const quotedParticipant = contextInfo.participant;

        if (Array.isArray(mentionedJid) && mentionedJid.length > 0) {
            targetJid = mentionedJid[0];
        } else if (args?.[0]) {
            const cleaned = args[0].replace(/\D/g, '');
            if (!cleaned) throw new Error('لم يتم تحديد رقم صحيح 🌿');
            targetJid = `${cleaned}@s.whatsapp.net`;
        } else if (quotedParticipant) {
            targetJid = decodeJid(quotedParticipant);
        } else {
            targetJid = sender;
        }

        const number = targetJid.split('@')[0];
        const isLid = targetJid.includes('lid');

        let message = `📱 *معلومات الحساب*\n\n`;
        message += `🔢 *الرقم:* ${number}\n`;
        message += `🆔 *النوع:* ${isLid ? 'LID (معرّف جديد)' : 'JID (معرّف تقليدي)'}\n`;
        message += `📋 *الكامل:* \`${targetJid}\`\n\n`;
        message += `✨ 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`;

        await conn.sendMessage(groupJid, { text: message }, { quoted: m });

    } catch (error) {
        console.error('✗ خطأ في أمر lid:', error);
        await conn.sendMessage(m.chat, {
            text: `${await getCalmResponse('error')}\n\n🔍 ${error.message || error.toString()}`
        }, { quoted: m });
    }
};

test.usage = ["lid", "lid @user", "lid 201xxxxxxxxx"];
test.command = ["lid", "معرف", "number"];
test.category = "tools";
export default test;