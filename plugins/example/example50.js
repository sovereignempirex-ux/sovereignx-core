let handler = async (m, { conn }) => {
  let watermark = '𝑺𝒂𝒍𝒆𝒗𝒆𝒓';

  // ─── التحقق من المجموعة ───
  if (!m.isGroup) return conn.sendMessage(m.chat, {
    text: `🅇 ┃ الأمر ده للمجموعات بس.`,
    contextInfo: {
      externalAdReply: {
        title: '𝑺𝑯𝑨𝑫𝑶𝑾 𝑮𝑨𝑹𝑫𝑬𝑵 🌑',
        body: watermark,
        thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  // ─── جلب أعضاء المجموعة ───
  let groupMetadata = await conn.groupMetadata(m.chat);
  let participants = groupMetadata.participants.map(p => p.id);

  // ─── النص الياباني + الترجمة ───
  let japanese = `兵士たちよ、立ち上がって国境を守れ。`;
  let arabic = `🛡️ *يا جُنود، قوموا ودافعوا عن الحدود.*`;

  let caption = `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                `║   ⚔️ *نـداء الـمـعـركـة*   ║\n` +
                `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                `🇯🇵 *اليابانية:*\n${japanese}\n\n` +
                `🇸🇦 *الترجمة:*\n${arabic}\n\n` +
                `┏━❋━◈━❋━┓\n` +
                `┃  ${watermark}  ┃\n` +
                `┗━❋━◈━❋━┛`;

  // ─── إرسال المنشن الصامت ───
  await conn.sendMessage(m.chat, {
    text: caption,
    mentions: participants,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: `120363412381946365@newsletter`,
        newsletterName: `𝑺𝒂𝒍𝒆𝒗𝒆𝒓`,
        serverMessageId: 0
      },
      externalAdReply: {
        title: `⚔️ 𝑺𝑯𝑨𝑫𝑶𝑾 𝑨𝑹𝑴𝒀`,
        body: `𝑹𝒊𝒔𝒆 𝒂𝒏𝒅 𝑫𝒆𝒇𝒆𝒏𝒅`,
        thumbnailUrl: `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`,
        sourceUrl: `https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K`,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.command = /^(صحي|soldiers|rise)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.tags = [`group`];
handler.help = [`.صحي`];

export default handler;
