let handler = async (m, { conn, bot }) => {
  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';

  // ─── الـ Quoted Message (الواترمارك اللي فوق) ───
  let quoted = {
    key: { 
      fromMe: false, 
      participant: '0@s.whatsapp.net', 
      remoteJid: 'status@broadcast' 
    },
    message: { 
      conversation: watermark 
    }
  };

  // ─── استخراج رقم المالك ───
  const num = bot?.config?.owners?.[0]?.jid?.split("@")[0] 
           || global.owner?.[0]?.[0]?.replace(/[^0-9]/g, '') 
           || m.sender.replace(/[^0-9]/g, '');
           
  const ownerJid = num + '@s.whatsapp.net';

  // ─── VCard ───
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;type=VOICE;waid=${num}:+${num}
END:VCARD`;

  // ─── 1️⃣ إرسال الرسالة مع الواترمارك فوقها (quoted) + منشن صامت ───
  await conn.sendMessage(m.chat, {
    text: `𝑾𝒂𝒌𝒆 𝒖𝒑, 𝒔𝒍𝒂𝒗𝒆𝒔!`,
    mentions: [ownerJid]  // ← منشن صامت للمالك
  }, { quoted });

  // ─── 2️⃣ إرسال جهة الاتصال (VCard) ───
  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: watermark,
      contacts: [{ vcard }]
    }
  });
};

handler.command = ['تست'];
handler.desc = 'اختبار البوت مع واترمارك ومنشن صامت';

export default handler;
