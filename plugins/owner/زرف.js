import fs from 'fs';

const handler = async (m, { conn, participants }) => {
  try {
    const data = JSON.parse(fs.readFileSync('./زرف.json'));

    if (!data.group?.status) {
      return m.reply('تم تعطيل الزرف من الملف.');
    }

    // تغيير اسم الجروب
    if (data.group.newSubject) {
      await conn.groupUpdateSubject(m.chat, data.group.newSubject);
    }

    // تغيير وصف الجروب
    if (data.group.newDescription) {
      await conn.groupUpdateDescription(m.chat, data.group.newDescription);
    }

    // منشن جماعي
    let users = participants.map(v => v.id);

    if (data.messages?.status) {
      await conn.sendMessage(m.chat, {
        text: data.messages.mention || 'تم الزرف ☠️',
        mentions: users
      });
    }

    // طرد جماعي
    for (let user of users) {
      // يتجنب طرد البوت والمالك
      if (
        user !== conn.user.jid &&
        user !== m.sender
      ) {
        try {
          await conn.groupParticipantsUpdate(
            m.chat,
            [user],
            'remove'
          );
        } catch {}
      }
    }

    // الرسالة الأخيرة
    if (data.messages?.final) {
      await conn.sendMessage(m.chat, {
        text: data.messages.final
      });
    }

  } catch (e) {
    console.log(e);
    m.reply('حدث خطأ.');
  }
};

handler.command = ['زرف'];
handler.owner = true;
handler.group = true;

export default handler;
