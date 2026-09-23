/* ========== Advanced Group Events (AutoDetect) - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const test = m => m;

test.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return;

  const fkontak = { 
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' }, 
    message: { 
      contactMessage: { 
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:𝑺𝒶𝓁𝑒𝓋𝑒𝓇\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }, 
    participant: '0@s.whatsapp.net'
  };

  const usuario = `@${m.sender.split('@')[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || await getXAsset();

  const getInviteLink = async () => {
    try {
      const param = m.messageStubParameters?.[0] || '';
      const linkMatch = param.match(/(https?:\/\/)?chat\.whatsapp\.com\/[0-9A-Za-z_-]{15,50}/i);
      if (linkMatch) {
        let link = linkMatch[0];
        if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
        return { ok: true, link };
      }
      const codeMatch = param.match(/[0-9A-Za-z]{20,24}/);
      if (codeMatch) return { ok: true, link: `https://chat.whatsapp.com/${codeMatch[0]}` };
      try {
        const inviteCode = await conn.groupInviteCode(m.chat);
        if (inviteCode) return { ok: true, link: `https://chat.whatsapp.com/${inviteCode}` };
      } catch (e) {}
      return { ok: false, error: 'لم أستطع جلب الرابط. تأكد أني أدمن.' };
    } catch (err) { return { ok: false, error: 'خطأ غير متوقع.' }; }
  };

  switch (m.messageStubType) {
    case 21: // تغيير الاسم
      await conn.sendMessage(m.chat, { 
        text: `《🌿》${usuario} غيّر اسم المجموعة ✨\n\n> الاسم الجديد:\n> *${m.messageStubParameters?.[0] || ''}*`, 
        mentions: [m.sender] 
      }, { quoted: fkontak });
      break;

    case 22: // تغيير الصورة
      await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: `《🌿》تم تغيير صورة المجموعة 🪷\n\n> بواسطة:\n> ${usuario}`, 
        mentions: [m.sender] 
      }, { quoted: fkontak });
      break;

    case 23: { // تغيير الرابط
      const result = await getInviteLink();
      if (result.ok) {
        await conn.sendMessage(m.chat, { 
          text: `《🌿》تم تغيير رابط الجروب 🔗\n\n> الرابط الجديد:\n> ${result.link}\n\n> بواسطة: ${usuario}`, 
          mentions: [m.sender] 
        }, { quoted: fkontak });
      } else {
        await conn.sendMessage(m.chat, { 
          text: `《🌿》تم تغيير رابط الجروب 🔗\n\n> لكن: ${result.error}\n\n> بواسطة: ${usuario}`, 
          mentions: [m.sender] 
        }, { quoted: fkontak });
      }
      break;
    }

    case 25: // تغيير إعدادات الجروب (مين يعدل المعلومات)
      await conn.sendMessage(m.chat, { 
        text: `《🌿》تم تغيير إعدادات الجروب 🪶\n\n> الآن فقط *${m.messageStubParameters?.[0] == 'on' ? 'الأدمنز' : 'الكل'}* يمكنهم تعديل معلومات الجروب.\n\n> بواسطة:\n> ${usuario}`, 
        mentions: [m.sender] 
      }, { quoted: fkontak });
      break;

    case 26: // فتح/قفل الجروب
      await conn.sendMessage(m.chat, { 
        text: `《🌿》الجروب تم ${m.messageStubParameters?.[0] == 'on' ? '*إغلاقه*' : '*فتحه*'} بواسطة ${usuario}\n\n> الآن ${m.messageStubParameters?.[0] == 'on' ? '*الأدمن فقط*' : '*الكل*'} يمكنه إرسال رسائل.`, 
        mentions: [m.sender] 
      }, { quoted: fkontak });
      break;

    case 29: // ترقية
      await conn.sendMessage(m.chat, { 
        text: `《🌿》@${m.messageStubParameters?.[0]?.split('@')[0]} تمت ترقيته 👏\n\n> بواسطة:\n> ${usuario}`, 
        mentions: [`${m.sender}`, `${m.messageStubParameters?.[0]}`] 
      }, { quoted: fkontak });
      break;

    case 30: // خفض من الأدمنية
      await conn.sendMessage(m.chat, { 
        text: `《🌿》@${m.messageStubParameters?.[0]?.split('@')[0]} تم خفضه من الإدارة 🐦\n\n> بواسطة:\n> ${usuario}`, 
        mentions: [`${m.sender}`, `${m.messageStubParameters?.[0]}`] 
      }, { quoted: fkontak });
      break;

    case 24: // تغيير الوصف
      await conn.sendMessage(m.chat, { 
        text: `《🌿》تم تغيير وصف الجروب بواسطة:\n> ${usuario}\n\n> الوصف الجديد:\n> ${m.messageStubParameters?.[0] || ''}`, 
        mentions: [m.sender] 
      }, { quoted: fkontak });
      break;

    case 28: // طرد عضو
      await conn.sendMessage(m.chat, { 
        text: `💃 تم طرد العضو بنجاح ✅\n\n> العضو:\n> @${m.messageStubParameters?.[0]?.split('@')[0] || '???'}\n\n> بواسطة:\n> ${usuario}`, 
        mentions: [`${m.sender}`, `${m.messageStubParameters?.[0]}`] 
      }, { quoted: fkontak });
      break;

    default:
      if (m.messageStubType == 2) return;
      console.log({ messageStubType: m.messageStubType, messageStubParameters: m.messageStubParameters });
  }
};

test.category = "group";
export default test;