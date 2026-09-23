/* ========== Yahyah Game (بحبح) - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import { WAMessageStubType } from '@whiskeysockets/baileys';
import { getCalmResponse } from "../../system/utils.js";
import { OWNER_JIDS } from "../../system/config.js";

const allowedNumbers = [...OWNER_JIDS];

const test = async (m, { conn }) => {
  const emoji = '🅇';
  const signature = '\n🌿 𝑺𝒶𝓁𝑒𝓋𝑒𝓇';

  if (!allowedNumbers.includes(m.sender)) {
    return conn.sendMessage(m.chat, { 
      text: `${emoji} هذا الأمر للمطورين فقط 🌿${signature}` 
    }, { quoted: m });
  }

  if (!m.quoted) {
    return conn.sendMessage(m.chat, { 
      text: `${emoji} يرجى الرد على رسالة الشخص المستهدف 🌿\n\nمثال:\nرد على رسالته واكتب: *.بحبح*${signature}` 
    }, { quoted: m });
  }

  const target = m.quoted.sender;
  const targetJid = target.split('@')[0];

  if (!target) {
    return conn.sendMessage(m.chat, { text: `${emoji} لا يمكن تحديد المستخدم 🌿` }, { quoted: m });
  }

  if (!m.isGroup) {
    return conn.sendMessage(m.chat, { text: `${emoji} هذا الأمر يعمل في الجروبات فقط 🌿` }, { quoted: m });
  }

  const warningMsg = await conn.sendMessage(m.chat, {
    text: `@${targetJid} قل: **بح بح** خلال **10 ثواني** وإلا هتطرد! 🌿\n\n${emoji} الوقت بدأ...`,
    mentions: [target]
  }, { quoted: m.quoted });

  let responded = false;
  const timeout = 10000;

  const listener = async (update) => {
    const msg = update.messages?.[0];
    if (!msg || !msg.message) return;
    if (msg.key.fromMe) return;
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (!['بح بح', 'بحبح', 'ب ح ب ح'].includes(messageText.trim())) return;

    const msgSender = msg.key.participant || msg.key.remoteJid;
    if (msgSender !== target) return;

    responded = true;
    conn.sendMessage(m.chat, {
      text: `${emoji} ✅ برافو يا @${targetJid}! نطقت **بح بح** ونجوت من الطرد! 😸${signature}`,
      mentions: [target]
    }, { quoted: warningMsg });

    conn.ev.removeListener('messages.upsert', listener);
  };

  conn.ev.on('messages.upsert', listener);

  setTimeout(async () => {
    if (responded) return;

    conn.ev.removeListener('messages.upsert', listener);

    try {
      await conn.sendMessage(m.chat, {
        text: `${emoji} ⏰ انتهى الوقت! @${targetJid} ما قالش **بح بح**... وداعًا! 🌿${signature}`,
        mentions: [target]
      });

      await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    } catch (e) {
      conn.sendMessage(m.chat, { text: `${emoji} فشل الطرد: ${e.message} 🌿` }, { quoted: m });
    }
  }, timeout);
};

test.usage = ["بحبح (بالرد على رسالة)"];
test.command = ["بحبح", "yahyah"];
test.category = "game";
test.group = true;
test.owner = true;
export default test;