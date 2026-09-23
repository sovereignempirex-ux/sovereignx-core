let handler = async (m, { conn, bot }) => {
  let watermark = '𝑺𝒂𝒍𝒆𝒗𝒆𝒓';
  
  let quoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓' }
  };
  const num = bot.config.owners[0].jid.split("@")[0];
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;waid=${num}:+${num}
END:VCARD`;

  let img = 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg';
  
  await conn.sendMessage(m.chat, {
    contacts: { displayName: watermark, contacts: [{ vcard }] },
    contextInfo: {
      forwardingScore: 2023,
      externalAdReply: {
        title: '𝑇𝛨𝛯 𝛩𝑊𝛮𝛯𝑅',
        body: watermark,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K',
        thumbnailUrl: img,
        mediaType: 1,
        showAdAttribution: false,
        renderLargerThumbnail: true
      }
    }
  }, { quoted })
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;
