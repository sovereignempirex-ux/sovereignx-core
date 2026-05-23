import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  let books = {
    'بخاري': { id: 'bukhari', max: 6638 },
    'البخاري': { id: 'bukhari', max: 6638 },
    'مسلم': { id: 'muslim', max: 3033 },
    'صحيح مسلم': { id: 'muslim', max: 3033 },
    'ابوداود': { id: 'abudaud', max: 4600 },
    'ابو داود': { id: 'abudaud', max: 4600 },
    'السنن': { id: 'abudaud', max: 4600 },
    'ترمذي': { id: 'tirmidzi', max: 3891 },
    'الترمذي': { id: 'tirmidzi', max: 3891 },
    'نسائي': { id: 'nasai', max: 4624 },
    'النسائي': { id: 'nasai', max: 4624 },
    'سنن النسائي': { id: 'nasai', max: 4624 },
    'ابن ماجه': { id: 'ibnumajah', max: 4341 },
    'ابن ماجة': { id: 'ibnumajah', max: 4341 },
    'مالك': { id: 'malik', max: 1594 },
    'موطأ مالك': { id: 'malik', max: 1594 },
    'احمد': { id: 'ahmad', max: 3000 },
    'مسند احمد': { id: 'ahmad', max: 3000 }
  };

  let selected = books['بخاري'];
  let search = text ? text.trim() : '';

  if (search) {
    let found = Object.keys(books).find(k => search.includes(k));
    if (found) selected = books[found];
  }

  let num = Math.floor(Math.random() * selected.max) + 1;
  let url = `https://api.hadith.gading.dev/books/${selected.id}/${num}-${num}`;

  let res = await fetch(url);
  let json = await res.json();

  if (!json.data || !json.data.contents || !json.data.contents.length) {
    return conn.sendMessage(m.chat, {
      text: `❌ ┃ مـالـقـيـتـش الـحـديـث حـاول تـاني.`,
      contextInfo: context(m.sender, `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`)
    }, { quoted: m });
  }

  let hadith = json.data.contents[0];
  let bookName = json.data.name;
  let caption = `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                `║   📜 *حـديـث نـبـوي*   ║\n` +
                `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                `┏━❋━◈━❋━┓\n` +
                `┃ 📚 *الكتاب:* ${bookName}\n` +
                `┃ 🔢 *رقم الحديث:* ${hadith.number}\n` +
                `┗━❋━◈━❋━┛\n\n` +
                `${hadith.arab}\n\n` +
                `┏━❋━◈━❋━┓\n` +
                `┃  𝑴𝒆𝒅𝒐  ┃\n` +
                `┗━❋━◈━❋━┛`;

  await conn.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: `120363409792989178@newsletter`,
        newsletterName: `𝑴𝒆𝒅𝒐`,
        serverMessageId: 0
      },
      externalAdReply: {
        title: `📜 𝑯𝑨𝑫𝑰𝑻𝑯 ~ 𝑵𝒂𝒃𝒂𝒘𝒊`,
        body: `𝑺𝒖𝒏𝒏𝒂𝒉 ~ ☆ 𝑮𝒖𝒊𝒅𝒂𝒏𝒄𝒆 ~ ☆ 𝑳𝒊𝒈𝒉𝒕`,
        thumbnailUrl: `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`,
        sourceUrl: `https://sunnah.com`,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.command = /^(حديث|hadith|حديث_نبوي)$/i;
handler.tags = [`islam`];
handler.help = [`.حديث`, `.حديث مسلم`, `.حديث البخاري`];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: `120363409440454416@newsletter`,
        newsletterName: `𝑴𝒆𝒅𝒐`,
        serverMessageId: 0
    },
    externalAdReply: {
        title: `📜 𝑯𝑨𝑫𝑰𝑻𝑯 ~ 𝑵𝒂𝒃𝒂𝒘𝒊`,
        body: `𝑺𝒖𝒏𝒏𝒂𝒉 ~ ☆ 𝑮𝒖𝒊𝒅𝒂𝒏𝒄𝒆 ~ ☆ 𝑳𝒊𝒈𝒉𝒕 (⁠｡⁠✧⁠ω⁠✧⁠｡⁠)`,
        thumbnailUrl: img,
        sourceUrl: `https://sunnah.com`,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
