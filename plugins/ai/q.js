import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `🕌 ~ أكتب رقم السورة أو اسمها ~ 📿\n\n*مثال:*\n.قران 1\n.قران الفاتحة\n.قران البقرة`,
    contextInfo: context(m.sender, `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`)
  }, { quoted: m });

  let loadingMsg = await conn.sendMessage(m.chat, {
    text: `⏳ *جـاري الـبـحـث فـي الـمـصـحـف...*`,
    contextInfo: context(m.sender, `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`)
  }, { quoted: m });

  try {
    let surahNumber = null;
    let input = text.trim();

    if (/^\d+$/.test(input)) {
      let num = parseInt(input);
      if (num >= 1 && num <= 114) surahNumber = num;
    }

    if (!surahNumber) {
      let listRes = await fetch(`https://api.alquran.cloud/v1/surah`);
      let listJson = await listRes.json();
      let search = input.toLowerCase().replace(/[\s-_]/g, ``);
      
      for (let s of listJson.data) {
        let arName = s.name.replace(/[\s-_]/g, ``).toLowerCase();
        let enName = s.englishName.toLowerCase().replace(/[\s-_]/g, ``);
        let enTrans = s.englishNameTranslation.toLowerCase().replace(/[\s-_]/g, ``);
        
        if (arName.includes(search) || enName.includes(search) || enTrans.includes(search)) {
          surahNumber = s.number;
          break;
        }
      }
    }

    if (!surahNumber) {
      await conn.sendMessage(m.chat, { delete: loadingMsg.key });
      return conn.sendMessage(m.chat, {
        text: `❌ ┃ مـالـقـيـتـش سـورة بـهـذا الاسم أو الرقم.`,
        contextInfo: context(m.sender, `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`)
      }, { quoted: m });
    }

    let res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    let json = await res.json();
    let surah = json.data;

    let verses = surah.ayahs.map(a => `﴿${a.numberInSurah}﴾ ${a.text}`).join(`\n`);
    let header = `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                 `║   📖 *سـورة ${surah.name}*   ║\n` +
                 `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                 `┏━❋━◈━❋━┓\n` +
                 `┃ 📌 *الاسم الإنجليزي:* ${surah.englishName}\n` +
                 `┃ 🌍 *المعنى:* ${surah.englishNameTranslation}\n` +
                 `┃ 📍 *نوع الوحي:* ${surah.revelationType === `Meccan` ? `مكية` : `مدنية`}\n` +
                 `┃ 🔢 *عدد الآيات:* ${surah.numberOfAyahs}\n` +
                 `┗━❋━◈━❋━┛\n\n`;

    let footer = `\n\n┏━❋━◈━❋━┓\n┃  𝑴𝒆𝒅𝒐  ┃\n┗━❋━◈━❋━┛`;
    let fullText = header + verses + footer;

    if (fullText.length > 4000) {
      let trimmed = verses.split(`\n`).slice(0, 20).join(`\n`);
      fullText = header + trimmed + `\n\n... *السورة طويلة — استخدم رابط المصحف للقراءة الكاملة*` + footer;
    }

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    await conn.sendMessage(m.chat, {
      text: fullText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: `120363409792989178@newsletter`,
          newsletterName: `𝑴𝒆𝒅𝒐`,
          serverMessageId: 0
        },
        externalAdReply: {
          title: `📖 𝑸𝑼𝑹𝑨𝑵 ~ 𝑲𝒂𝒓𝒆𝒆𝒎`,
          body: `𝑺𝒖𝒓𝒂𝒉 ${surah.englishName} ~ ☆ ${surah.numberOfAyahs} 𝑨𝒚𝒂𝒕𝒔`,
          thumbnailUrl: `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`,
          sourceUrl: `https://quran.com/${surahNumber}`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
    return conn.sendMessage(m.chat, {
      text: `❌ ┃ حـصـل خـطـأ فـي جـلـب الـسـورة.`,
      contextInfo: context(m.sender, `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`)
    }, { quoted: m });
  }
};

handler.command = /^(قران|قرآن|quran|surah|سورة)$/i;
handler.tags = [`islam`];
handler.help = [`.قران <رقم أو اسم السورة>`];

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
        title: `📖 𝑸𝑼𝑹𝑨𝑵 ~ 𝑲𝒂𝒓𝒆𝒆𝒎`,
        body: `𝑮𝒖𝒊𝒅𝒂𝒏𝒄𝒆 ~ ☆ 𝑳𝒊𝒈𝒉𝒕 ~ ☆ 𝑭𝒂𝒊𝒕𝒉 (⁠｡⁠✧⁠ω⁠✧⁠｡⁠)`,
        thumbnailUrl: img,
        sourceUrl: `https://quran.com`,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
