let handler = async (m, { conn, text }) => {
  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';
  let channelUrl = 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H';

  // ─── تحديد المقتول ───
  let victim = m.quoted ? m.quoted.sender : 
               m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : 
               text ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : null;

  if (!victim) {
    return conn.sendMessage(m.chat, {
      text: `⚔️╎ *منشن الشخص أو رد على رسالته يا وحش* 🩸\n\n*مثال:* \`.قتل @user\``,
      contextInfo: {
        forwardingScore: 999,
        externalAdReply: {
          title: '⚔️ 𝐓𝐇𝐄 𝐃𝐀𝐑𝐊 𝐊𝐈𝐍𝐆𝐃𝐎𝐌 ⚔️',
          body: watermark,
          thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
          sourceUrl: channelUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }

  // ─── تجنب القتل الذاتي ───
  if (victim === m.sender) {
    return conn.sendMessage(m.chat, {
      text: `🤡╎ *عايز تقتل نفسك؟* \nروح شوف دكتور نفسي بدل اللعب هنا.`,
      contextInfo: {
        forwardingScore: 999,
        externalAdReply: {
          title: '🏥 𝐌𝐄𝐍𝐓𝐀𝐋 𝐇𝐎𝐒𝐏𝐈𝐓𝐀𝐋',
          body: watermark,
          thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
          sourceUrl: channelUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }

  // ─── الحاكم عشوائي من المجموعة ───
  let groupMetadata = await conn.groupMetadata(m.chat);
  let members = groupMetadata.participants.map(p => p.id);
  let judge = members[Math.floor(Math.random() * members.length)];

  // مايكونش الحاكم هو القاتل أو المقتول
  let attempts = 0;
  while ((judge === m.sender || judge === victim) && attempts < 10) {
    judge = members[Math.floor(Math.random() * members.length)];
    attempts++;
  }

  let killerTag = m.sender.split('@')[0];
  let victimTag = victim.split('@')[0];
  let judgeTag = judge.split('@')[0];

  // ─── سيناريوهات عشوائية فخمة ───
  let scenarios = [
    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ ⚔️ *الحكم بالإعدام* ☠️ ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* طعن الضحية بـ 77 طعنة في ظهره 💀\n` +
    `> *الحاكم* حكم بالبراءة لأن الضحية كان بيتكلم في التليفون 📱`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🔥 *جريمة العصر* 🔥 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* دسّله سم في الشاي ☕\n` +
    `> *الحاكم* قال: "الشاي كان بارد يستاهل" 🧊`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 💣 *تفجير مفاجئ* 💣 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* فجر الضحية بـ بومبة في الحمام 🚽\n` +
    `> *الحاكم* حكم بالتعويض: "الحمام كان مقرف" 🧼`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🪓 *ذبح مروع* 🪓 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* ضرب الضحية بالفأس 3 مرات 🪓\n` +
    `> *الحاكم* قال: "3 ضربات = 3 أيام حبس بس" ⏳`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🐍 *لدغة الأفعى* 🐍 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* أرسل أفعى في سرير الضحية 🛏️\n` +
    `> *الحاكم* حكم بـ "الأفعى براءة، هي اللي قتلت" 🐍`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🏹 *سهم قاتل* 🏹 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* رمى سهم في عين الضحية 🎯\n` +
    `> *الحاكم* قال: "هدف ممتاز، 10/10" ⭐`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🚗 *حادث مريب* 🚗 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* دهس الضحية بـ تروسيكل 3 مرات 🛵\n` +
    `> *الحاكم* حكم بـ "التروسيكل كان مسروق يعني مش ذنبك" 🏃`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ ⚡ *صعق كهربائي* ⚡ ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* وصل الضحية في كابل شاحن آيفون 🔌\n` +
    `> *الحاكم* قال: "الشاحن أصلي ولا تقليد؟ ده اللي يحدد الحكم" 📱`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🪨 *رجم حتى الموت* 🪨 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* رجم الضحية بـ 100 حجر 🪨\n` +
    `> *الحاكم* قال: "100 حجر = 100 جنيه غرامة بس" 💰`,

    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
    `║ 🎭 *قتل مسرحي* 🎭 ║\n` +
    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
    `┏━❋━◈━❋━┓\n` +
    `┃ 🗡️ *القاتل:* @${killerTag}\n` +
    `┃ 🩸 *الضحية:* @${victimTag}\n` +
    `┃ ⚖️ *الحاكم:* @${judgeTag}\n` +
    `┗━❋━◈━❋━┛\n\n` +
    `> *القاتل* مثل دور الشرطي وقبض على الضحية 👮\n` +
    `> *الحاكم* قال: "تمثيلك كان ممتاز، براءة فورية" 🎬`
  ];

  let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  // ─── إرسال الرسالة الفخمة ───
  await conn.sendMessage(m.chat, {
    text: scenario,
    mentions: [m.sender, victim, judge],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409440454416@newsletter',
        newsletterName: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
        serverMessageId: -1
      },
      externalAdReply: {
        title: '⚔️ 𝐓𝐇𝐄 𝐃𝐀𝐑𝐊 𝐊𝐈𝐍𝐆𝐃𝐎𝐌 ⚔️',
        body: '𝑻𝒉𝒆 𝒌𝒊𝒏𝒈 𝒊𝒔 𝒂𝒍𝒘𝒂𝒚𝒔 𝒘𝒂𝒕𝒄𝒉𝒊𝒏𝒈 𝒚𝒐𝒖...',
        thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
        sourceUrl: channelUrl,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    },
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: '🔗╎ زيارة القناة',
          url: channelUrl
        }
      }
    ]
  }, { quoted: m });
};

handler.command = /^(قتل|kill)$/i;
handler.group = true;
handler.tags = ['fun'];
handler.help = ['.قتل @user'];

export default handler;
