let handler = async (m, { conn, args, isOwner }) => {
  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';

  let quoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: watermark }
  };

  // ─── قاعدة البيانات المؤقتة ───
  if (!global.contentFilter) global.contentFilter = new Set();
  if (!global.violations) global.violations = new Map();

  let chatId = m.chat;
  let isActive = global.contentFilter.has(chatId);

  // ═══════════════════════════════════════
  //  أوامر التحكم (تفعيل / قفل) — للمطور فقط
  // ═══════════════════════════════════════
  if (args[0]) {
    let cmd = args[0].toLowerCase();

    if (cmd === 'تفعيل') {
      if (!isOwner) return conn.sendMessage(m.chat, { text: '❌ للمطور فقط!' }, { quoted });
      global.contentFilter.add(chatId);
      return conn.sendMessage(m.chat, {
        text: '✅ *تم تفعيل فلتر المحتوى*\nسيتم طرد من يكتب كلمات محظورة أو يرسل محتوى إباحي.',
        contextInfo: {
          forwardingScore: 2023,
          externalAdReply: {
            title: '𝑇𝛨𝛯 𝛩𝑊𝛯𝑅',
            body: watermark,
            sourceUrl: 'https://whatsapp.com/channel/0029Vb82Y93GehEEid2Xap23',
            thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted });
    }

    if (cmd === 'قفل') {
      if (!isOwner) return conn.sendMessage(m.chat, { text: '❌ للمطور فقط!' }, { quoted });
      global.contentFilter.delete(chatId);
      return conn.sendMessage(m.chat, {
        text: '🔒 *تم إيقاف فلتر المحتوى*',
        contextInfo: {
          forwardingScore: 2023,
          externalAdReply: {
            title: '𝑇𝛨𝛯 𝛩𝑊𝛯𝑅',
            body: watermark,
            sourceUrl: 'https://whatsapp.com/channel/0029Vb82Y93GehEEid2Xap23',
            thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted });
    }
  }

  // ─── إذا لم يُرسل أمر ولم يكن مفعلاً ───
  if (!isActive) {
    return conn.sendMessage(m.chat, {
      text: '⚠️ *الفلتر معطل.*\nالمطور يفعّله بـ: `.محتوي تفعيل`',
      contextInfo: {
        forwardingScore: 2023,
        externalAdReply: {
          title: '𝑇𝛨𝛯 𝛩𝑊𝛯𝑅',
          body: watermark,
          sourceUrl: 'https://whatsapp.com/channel/0029Vb82Y93GehEEid2Xap23',
          thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted });
  }
};

// ═══════════════════════════════════════════════════════════
//  فلتر تلقائي على كل الرسائل (all = true)
// ═══════════════════════════════════════════════════════════
handler.all = async function (m, { conn, isOwner }) {
  if (!m.isGroup) return;
  if (!global.contentFilter?.has(m.chat)) return;
  if (isOwner) return;

  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';
  let senderTag = m.sender.split('@')[0];

  // ─── تهيئة التتبع ───
  if (!global.violations) global.violations = new Map();

  let violation = false;
  let reason = '';

  // ═════════════════════════════════════════════════
  //  1) فحص النصوص
  // ═════════════════════════════════════════════════
  if (m.text) {
    let text = m.text.toLowerCase().replace(/[\s_\-.,؛،!؟?]/g, '');

    const badWords = [
      "خرا","خرة","زب","طيز","طيزك","طيزها","كس","كسك","كسها","كوس","كوسها",
      "قحبة","قحبه","شرموطة","شرموطه","منيوك","منيوكة","منيوكه","كسختك","كسامك",
      "كساختك","كسابوك","كساخوك","ديوث","دياثة","دياثه","فلقعة","بزاز","نيك",
      "انيك","ينيك","تتناك","يتناك","متناك","متناكة","متناكه","منيك","منيكة",
      "احه","ياحه","ياحا","احاها","احاة","احاه","اير","ايري","ايرك","ايرها",
      "عير","عيري","عيرك","عيرها","طوط","طوطي","طوطك","طيط","بظر","بظري",
      "مبادل","مبادلة","مبادله","سكس","سيكس","سحاق","سحاقي","سحاقية","سحاقيه",
      "جماع","جماعي","جماعية","جماعيه","نيج","انيج","ينيج","تنيج","منيج","منيجة",
      "عاهرة","عاهره","عاهرات","دعارة","دعاره","مومس","مومسة","مومسه","بغية",
      "بغيه","بغايا","زانية","زانيه","زان","زانيات","زنا","زنى","لواط","لوطي",
      "لواطي","عادةسرية","عادهسريه","استمناء","احتلام","احلام","احتلامات","احلامات",
      "ميلف","ميلفة","ميلفه","الفحولة","الفحوله","فحل","فحولة","فحوله","شرمطة",
      "شرمطه","تشرمط","يتشرمط","انشرمط","انشرمطة","تفشخ","يتفشخ","انفشخ","فشخ",
      "فشخة","فشخه","نيكة","نيكه","نيكات","مص","يمص","تمص","مصة","مصه","مصاص",
      "مصاصة","مصاصه","لحس","يلحس","تلحس","لحسة","لحسه","لحاس","لحاسة","لحاسه",
      "بوس","يبوس","تبوس","بوسة","بوسه","بواس","بواسة","بواسه","قبل","يقبل",
      "تقبل","قبلة","قبله","قبول","قبالات","حضن","يحضن","تحضن","حضنة","حضنه",
      "حضان","حضانة","حضانه","ضم","يضم","تضم","ضمة","ضمه","ضام","ضامة","ضامه",
      "فرك","يفرك","تفرك","فركة","فركه","فراك","فراكة","فراكه","دعك","يدعك",
      "تدعك","دعكة","دعكه","داعك","داعكة","داعكه","شد","يشد","تشد","شدة","شده",
      "شاد","شادة","شاده","خبط","يخبط","تخبط","خبطة","خبطه","خابط","خابطة",
      "خابطه","دق","يدق","تدق","دقة","دقه","داق","داقة","داقه","كسر","يكسر",
      "تكسر","كسرة","كاسر","كاسرة","كاسره","فتح","يفتح","تفتح","فتحة","فتحه",
      "فاتح","فاتحة","فاتحه","غلق","يغلق","تغلق","غلقة","غلقه","غالق","غالقة",
      "غالقه","دخل","يدخل","تدخل","دخلة","دخله","داخل","داخلة","داخله","خرج",
      "يخرج","تخرج","خروج","خارج","خارجة","خارجه","نزل","ينزل","تنزل","نزلة",
      "نزله","نازل","نازلة","نازله","طلع","يطلع","تطلع","طلعة","طلعه","طالع",
      "طالعة","طالعه"
    ];

    const regex = new RegExp(`(?:${badWords.join('|')})`, 'i');
    if (regex.test(text)) {
      let clean = text.replace(/[احا]/g, '');
      if (text !== 'احا' && text !== 'احه' && clean.length > 0) {
        violation = true;
        reason = 'كلمة محظورة';
      }
    }
  }

  // ═════════════════════════════════════════════════
  //  2) فحص الـ Media: صور + فيديو + ملصقات + ملفات صورية + viewOnce
  // ═════════════════════════════════════════════════
  const isImage = m.mtype === 'imageMessage' || 
                  m.mtype === 'viewOnceMessageV2' || 
                  m.mtype === 'viewOnceMessage' ||
                  (m.mtype === 'documentMessage' && m.msg?.mimetype?.startsWith('image/'));

  const isVideo = m.mtype === 'videoMessage' || m.mtype === 'ptvMessage';

  const isSticker = m.mtype === 'stickerMessage';

  if (!violation && (isImage || isVideo || isSticker)) {
    try {
      const tf = require('@tensorflow/tfjs-node');
      const nsfw = require('nsfwjs');
      const sharp = require('sharp');
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');

      // تحميل النموذج مرة واحدة فقط
      if (!global.nsfwModel) {
        global.nsfwModel = await nsfw.load();
      }

      let buffer = await m.download();
      if (!buffer && conn.downloadMediaMessage) buffer = await conn.downloadMediaMessage(m);
      if (!buffer) throw new Error('No buffer');

      let frameBuffer;

      // ─── فيديو: استخراج frame ───
      if (isVideo) {
        const tmp = path.join('/tmp', `sfw_${Date.now()}`);
        const vidPath = `${tmp}.mp4`;
        const framePath = `${tmp}.jpg`;

        fs.writeFileSync(vidPath, buffer);
        execSync(`ffmpeg -i ${vidPath} -ss 00:00:01 -vframes 1 ${framePath} -y 2>/dev/null`);

        if (fs.existsSync(framePath)) {
          frameBuffer = await sharp(framePath).jpeg().toBuffer();
          fs.unlinkSync(vidPath);
          fs.unlinkSync(framePath);
        } else {
          fs.unlinkSync(vidPath);
          throw new Error('ffmpeg failed');
        }
      } 
      // ─── ملصق: تحويل WebP لـ JPEG ───
      else if (isSticker) {
        frameBuffer = await sharp(buffer, { animated: false }) // first frame only
          .jpeg()
          .toBuffer();
      } 
      // ─── صورة عادية ───
      else {
        frameBuffer = await sharp(buffer).jpeg().toBuffer();
      }

      if (!frameBuffer) throw new Error('No frame buffer');

      const image = await tf.node.decodeImage(frameBuffer, 3);
      const predictions = await global.nsfwModel.classify(image);
      image.dispose();

      // Porn > 70% | Hentai > 70% | Sexy > 85%
      const bad = predictions.find(p => 
        (['Porn', 'Hentai'].includes(p.className) && p.probability > 0.70) ||
        (p.className === 'Sexy' && p.probability > 0.85)
      );

      if (bad) {
        violation = true;
        reason = `${isSticker ? 'ملصق' : isVideo ? 'فيديو' : 'صورة'} إباحي (${bad.className} ${(bad.probability*100).toFixed(0)}%)`;
      }
    } catch (e) {
      console.log('NSFW skip:', e.message);
    }
  }

  // ═════════════════════════════════════════════════
  //  التنفيذ: حذف → تحذير/طرد
  // ═════════════════════════════════════════════════
  if (violation) {
    // 1) حذف الرسالة فوراً (قبل أي إشعار)
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (delErr) {
      console.log('فشل الحذف:', delErr.message);
    }

    let count = (global.violations.get(m.sender) || 0) + 1;
    global.violations.set(m.sender, count);

    // التحذير الأول (للنصوص فقط — الـ NSFW صريح فالطرد مباشر)
    if (count === 1 && !reason.includes('إباحي')) {
      return conn.sendMessage(m.chat, {
        text: `⚠️ *@${senderTag}*\nالمخالفة ${count}/3: ${reason}\nالرسالة التالية = طرد فوري.`,
        mentions: [m.sender]
      });
    }

    // الطرد
    try {
      await conn.sendMessage(m.chat, {
        text: `🚫 *@${senderTag}* أرسل محتوى محظور: *${reason}*\n⛔ تم طردك من المجموعة.`,
        mentions: [m.sender]
      });

      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    } catch (err) {
      console.error('فشل الطرد:', err);
      await conn.sendMessage(m.chat, {
        text: `❌ فشل طرد @${senderTag} — تأكد أن البوت أدمن.`,
        mentions: [m.sender]
      });
    }

    // إعادة ضبط العداد بعد 10 دقائق
    setTimeout(() => {
      global.violations.delete(m.sender);
    }, 10 * 60 * 1000);
  }
};

// fallback للأطر اللي تستخدم before
handler.before = handler.all;

handler.command = /^(محتوي)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
