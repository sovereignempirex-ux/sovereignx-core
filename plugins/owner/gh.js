let handler = async (m, { conn, args, isOwner }) => {
  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';

  let quoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: watermark }
  };

  // ─── تهيئة قواعد البيانات المؤقتة ───
  if (!global.contentFilter) global.contentFilter = new Set();
  if (!global.violations) global.violations = new Map();
  if (!global.nsfwModel) global.nsfwModel = null;

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
//  فلتر تلقائي — يشتغل قبل كل رسالة (before)
// ═══════════════════════════════════════════════════════════
handler.before = async function (m, { conn, isOwner }) {
  if (!m.isGroup) return;
  if (!global.contentFilter?.has(m.chat)) return;

  // ─── تحقق من صلاحية المطور (fallback) ───
  let ownerCheck = isOwner;
  if (!ownerCheck && global.owner) {
    let owners = Array.isArray(global.owner) ? global.owner : [[global.owner]];
    ownerCheck = owners.some(([id]) => id && m.sender.startsWith(id));
  }
  if (ownerCheck) return;

  let watermark = '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿';
  let senderTag = m.sender.split('@')[0];

  // ─── تهيئة التتبع ───
  if (!global.violations) global.violations = new Map();

  let violation = false;
  let reason = '';
  let foundWord = '';

  // ═════════════════════════════════════════════════
  //  1) فحص النصوص
  // ═════════════════════════════════════════════════
  if (m.text) {
    let text = m.text.toLowerCase().replace(/[\s_\-.,؛،!؟?]/g, '');

    // ─── قائمة الكلمات المحظورة (منظّمة ومُحسّنة) ───
    const badWords = new Set([
      // ═══ سب / شتم جنسي صريح ═══
      "خرا","خرة","زب","طيز","طيزك","طيزها","كس","كسك","كسها","كوس","كوسها",
      "قحبة","قحبه","قحب","قحاب","شرموطة","شرموطه","شرموط","شرموطات","شراميط",
      "منيوك","منيوكة","منيوكه","منيك","منيكة","متناك","متناكة","متناكه","متناكين",
      "كسختك","كسامك","كساختك","كسابوك","كساخوك","كسمك","كسامك","كسختك","كساختك",
      "كسابوك","كساخوك","كس امك","كس اختك","كس ابوك","كس اخوك",
      "ديوث","دياثة","دياثه","ديوثة","ديوثين","ديوثات","مبادل","مبادلة","مبادله","مبادلين",
      "فلقعة","بزاز","نيك","انيك","ينيك","تتناك","يتناك","يتناكو","تتناكي",
      "تنيك","يتنيك","تنيكو","يتنيكو","انيكك","انيككي","انيكها","ينيكها","ينيكك",
      "احه","ياحه","ياحا","احاها","احاة","احاه","اير","ايري","ايرك","ايرها",
      "عير","عيري","عيرك","عيرها","طوط","طوطي","طوطك","طيط","بظر","بظري",
      "عرص","خول","علق","بطيخ","بضان","بظ","فرج",

      // ═══ إباحية / سكس ═══
      "سكس","سيكس","سحاق","سحاقي","سحاقية","سحاقيه","سحاقة","سحاقيات",
      "جماع","جماعي","جماعية","جماعيه",
      "نيج","انيج","ينيج","تنيج","منيج","منيجة",
      "عاهرة","عاهره","عاهرات","عاهر","دعارة","دعاره","دعار","دعارات",
      "مومس","مومسة","مومسه","مومسات","بغية","بغيه","بغي","بغايا",
      "زانية","زانيه","زان","زانيات","زاني","زانيات","زانين","زنا","زنى",
      "لواط","لوطي","لواطي","لوط","لواطين","لواطية",
      "عادةسرية","عادهسريه","استمناء","احتلام","احلام","احتلامات","احلامات",
      "ميلف","ميلفة","ميلفه","الفحولة","الفحوله","فحل","فحولة","فحوله",
      "شرمطة","شرمطه","تشرمط","يتشرمط","انشرمط","انشرمطة",
      "تفشخ","يتفشخ","انفشخ","فشخ","فشخة","فشخه",
      "نيكة","نيكه","نيكات","نيكة","نيكه",
      "مص","يمص","تمص","مصة","مصه","مصاص","مصاصة","مصاصه",
      "لحس","يلحس","تلحس","لحسة","لحسه","لحاس","لحاسة","لحاسه",
      "بوس","يبوس","تبوس","بوسة","بوسه","بواس","بواسة","بواسه",
      "قبل","يقبل","تقبل","قبلة","قبله","قبول","قبالات",
      "حضن","يحضن","تحضن","حضنة","حضنه","حضان","حضانة","حضانه",
      "ضم","يضم","تضم","ضمة","ضمه","ضام","ضامة","ضامه",
      "فرك","يفرك","تفرك","فركة","فركه","فراك","فراكة","فراكه",
      "دعك","يدعك","تدعك","دعكة","دعكه","داعك","داعكة","داعكه",
      "شد","يشد","تشد","شدة","شده","شاد","شادة","شاده",
      "خبط","يخبط","تخبط","خبطة","خبطه","خابط","خابطة","خابطه",
      "دق","يدق","تدق","دقة","دقه","داق","داقة","داقه",
      "كسر","يكسر","تكسر","كسرة","كاسر","كاسرة","كاسره",
      "فتح","يفتح","تفتح","فتحة","فتحه","فاتح","فاتحة","فاتحه",
      "غلق","يغلق","تغلق","غلقة","غلقه","غالق","غالقة","غالقه",
      "دخل","يدخل","تدخل","دخلة","دخله","داخل","داخلة","داخله",
      "خرج","يخرج","تخرج","خروج","خارج","خارجة","خارجه",
      "نزل","ينزل","تنزل","نزلة","نزله","نازل","نازلة","نازله",
      "طلع","يطلع","تطلع","طلعة","طلعه","طالع","طالعة","طالعه",

      // ═══ كلمات إنجليزية إباحية ═══
      "porn","sex","xxx","xnxx","xvideos","redtube","hentai","rule34",
      "nude","naked","boobs","dick","pussy","ass","fuck","bitch","slut","whore",
      "cum","anal","blowjob","handjob","titjob","creampie","gangbang","milf",
      "bdsm","orgy","masturbate","masturbation","dildo","vibrator","condom",
      "virgin","rape","rapist","molest","pedo","pedophile","childporn","cp",
      "loli","shota","bestiality","beastiality","zoophilia","necrophilia","incest",
      "futanari","yaoi","yuri","ecchi","ahegao","tentacle","futa","trap","femboy",
      "sissy","cuckold","cuck","swinger","prostitute","escort","brothel","pimp",
      "pornhub","youporn","tube8","xhamster","spankbang","chaturbate","onlyfans",
      "fansly","manyvids","clips4sale",

      // ═══ إهانات / سب عام (شائع في الواتساب) ═══
      "كلب","كلبة","كلبه","حيوان","جحش","حمار","حمارة","حماره","تيس","قرد","قردة","قرده",
      "جربوع","فأر","فاره","فارة","وسخ","وسخة","وسخه","قذر","قذرة","قذره","نجس","نجسة","نجسه",
      "عفن","عفنة","عفنه","زبالة","زباله","حثالة","حثاله","نذل","نذلة","نذله",
      "خسيس","خسيسة","خسيسه","حقير","حقيرة","حقيره","واطي","واطية","واطيه",
      "سافل","سافلة","سافله","دنيء","دنيئة","دنياه","لئيم","لئيمة","لئيمه",
      "غدار","غدارة","غداره","خاين","خاينة","خاينه","منافق","منافقة","منافقه",
      "كاذب","كاذبة","كاذبه","فاسق","فاسقة","فاسقه","فاجر","فاجرة","فاجره",
      "عاصي","عاصية","عاصيه","متمرد","متمردة","متمرده","مشاغب","مشاغبة","مشاغبه",
      "مجرم","مجرمة","مجرمه","لص","لصة","لصه","حرامي","حرامية","حراميه","نصاب",
      "نصابة","نصابه","نصابين","محتال","محتالة","محتاله","مخادع","مخادعة","مخادعه",
      "غشاش","غشاشة","غشاشه","مغتصب","مغتصبة","مغتصبه","متحرش","متحرشة","متحرشه",
      "قاتل","قاتلة","قاتله","سفاح","سفاحة","سفاحه","ارهابي","ارهابية","ارهابيه",
      "تكفيري","تكفيرية","تكفيريه","متطرف","متطرفة","متطرفه","عنصري","عنصرية",
      "عنصريه","فاشي","فاشية","فاشيه","نازي","نازية","نازيه","صهيوني","صهيونية",
      "صهيونيه","ماسوني","ماسونية","ماسونيه","شيوعي","شيوعية","شيوعيه","رأسمالي",
      "رأسمالية","راسماليه","استعماري","استعمارية","استعماريه","عميل","عميلة",
      "عميله","خائن","خائنة","خاينه","جاسوس","جاسوسة","جاسوسه","مندس","مندسة",
      "مندسه","مأجور","مأجورة","مأجوره","مرتزق","مرتزقة","مرتزقه","داعر","داعرة",
      "داعره","فاسد","فاسدة","فاسده","مفسد","مفسدة","مفسده","مفلس","مفلسة","مفلسه",
      "فاشل","فاشلة","فاشله","كسلان","كسلانة","كسلانه","بله","بلهاء","غبي","غبية",
      "غبيه","احمق","احمقة","احمقه","معتوه","معتوهة","معتوهه","مجنون","مجنونة",
      "مجنونه","مسطول","مسطولة","مسطوله","مغفل","مغفلة","مغفله","اهبل","اهبلة",
      "اهبله","تافه","تافهة","تافهه","سخيف","سخيفة","سخيفه","بائس","بائسة","بائسه",
      "شقي","شقية","شقيه","مكروه","مكروهة","مكروهه","مبغوض","مبغوضة","مبغوضه",
      "مذموم","مذمومة","مذمومه","ملعون","ملعونة","ملعونه","مطرود","مطرودة","مطروده",
      "منبوذ","منبوذة","منبوذه","مقهور","مقهورة","مقهوره","مظلوم","مظلومة","مظلومه",
      "جبان","جبانة","جبانه","فزاع","فزاعة","فزاعه",

      // ═══ سكسي / إباحي (عربي/إنجليزي مختلط) ═══
      "سكسي","سيكسي","سكسية","سيكسية","إباحي","إباحية","اباحي","اباحية"
    ]);

    // ─── فحص سريع بـ Set + loop (أأمن وأسرع من regex ضخم) ───
    for (const word of badWords) {
      if (text.includes(word)) {
        // استثناء "احا" لوحدها تماماً
        if (word === 'احا' || word === 'احه') {
          if (text === 'احا' || text === 'احه') continue;
        }
        foundWord = word;
        violation = true;
        reason = 'كلمة محظورة';
        break;
      }
    }
  }

  // ═════════════════════════════════════════════════
  //  2) تحديد نوع الميديا (صور + فيديو + ملصقات + viewOnce + ملفات صورية)
  // ═════════════════════════════════════════════════
  function getMediaType(msg) {
    if (!msg?.message) return null;
    const types = [
      ['imageMessage', 'image'],
      ['videoMessage', 'video'],
      ['stickerMessage', 'sticker'],
      ['ptvMessage', 'video'],
      ['documentMessage', msg.message.documentMessage?.mimetype?.startsWith('image/') ? 'image' : null],
      ['viewOnceMessageV2', getMediaType({ message: msg.message.viewOnceMessageV2?.message })],
      ['viewOnceMessage', getMediaType({ message: msg.message.viewOnceMessage?.message })],
    ];
    for (const [key, type] of types) {
      if (msg.message[key] && type) return type;
    }
    return null;
  }

  const mediaType = getMediaType(m);

  // ═════════════════════════════════════════════════
  //  3) فحص NSFW للصور + الملصقات + الفيديوهات
  // ═════════════════════════════════════════════════
  if (!violation && (mediaType === 'image' || mediaType === 'sticker' || mediaType === 'video')) {
    try {
      const tf = require('@tensorflow/tfjs-node');
      const nsfw = require('nsfwjs');
      const sharp = require('sharp');
      const fs = require('fs');
      const path = require('path');
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);

      // تحميل النموذج مرة واحدة فقط
      if (!global.nsfwModel) {
        global.nsfwModel = await nsfw.load();
      }

      let buffer = await m.download();
      if (!buffer && conn.downloadMediaMessage) buffer = await conn.downloadMediaMessage(m);
      if (!buffer) throw new Error('No buffer');

      let frameBuffer;

      // ─── فيديو: استخراج frame بـ ffmpeg ───
      if (mediaType === 'video') {
        const tmp = path.join('/tmp', `sfw_${Date.now()}`);
        const vidPath = `${tmp}.mp4`;
        const framePath = `${tmp}.jpg`;

        fs.writeFileSync(vidPath, buffer);
        await execPromise(`ffmpeg -i ${vidPath} -ss 00:00:01 -vframes 1 ${framePath} -y`, { timeout: 15000 });

        if (fs.existsSync(framePath)) {
          frameBuffer = await sharp(framePath).jpeg().toBuffer();
        }
        // تنظيف
        try { fs.unlinkSync(vidPath); } catch {}
        try { fs.existsSync(framePath) && fs.unlinkSync(framePath); } catch {}
        if (!frameBuffer) throw new Error('ffmpeg failed');
      }
      // ─── ملصق: تحويل WebP لـ JPEG (أول frame بس) ───
      else if (mediaType === 'sticker') {
        frameBuffer = await sharp(buffer, { animated: false }).jpeg().toBuffer();
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
        reason = `${mediaType === 'sticker' ? 'ملصق' : mediaType === 'video' ? 'فيديو' : 'صورة'} إباحي (${bad.className} ${(bad.probability * 100).toFixed(0)}%)`;
      }
    } catch (e) {
      console.log('NSFW skip:', e.message);
    }
  }

  // ═════════════════════════════════════════════════
  //  التنفيذ: حذف فوري → تحذير/طرد
  // ═════════════════════════════════════════════════
  if (violation) {
    // ─── 1) حذف الرسالة فوراً ───
    try {
      if (m.delete) await m.delete();
      else await conn.sendMessage(m.chat, { delete: m.key });
    } catch (delErr) {
      console.log('فشل الحذف:', delErr.message);
    }

    // ─── 2) نظام المخالفات (3 مخالفات = طرد) ───
    let now = Date.now();
    let record = global.violations.get(m.sender) || { count: 0, last: 0 };
    if (now - record.last > 10 * 60 * 1000) record.count = 0; // إعادة ضبط بعد 10 دقائق
    record.count++;
    record.last = now;
    global.violations.set(m.sender, record);

    // ─── 3) التحذير الأول (للنصوص فقط — NSFW صريح = طرد مباشر) ───
    if (record.count === 1 && !reason.includes('إباحي')) {
      return conn.sendMessage(m.chat, {
        text: `⚠️ *@${senderTag}*\nالمخالفة ${record.count}/3: *${reason}* ${foundWord ? `(${foundWord})` : ''}\nالرسالة التالية = طرد فوري.`,
        mentions: [m.sender]
      });
    }

    // ─── 4) الطرد ───
    try {
      // التحقق من أن البوت أدمن فعلياً
      let groupMeta = await conn.groupMetadata(m.chat);
      let botId = conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
      let botParticipant = groupMeta.participants.find(p => p.id === botId);
      let isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

      if (!isBotAdmin) {
        return conn.sendMessage(m.chat, {
          text: `❌ *البوت ليس أدمناً* — لا يمكن طرد @${senderTag}.\n*${reason}*`,
          mentions: [m.sender]
        });
      }

      await conn.sendMessage(m.chat, {
        text: `🚫 *@${senderTag}* أرسل محتوى محظور: *${reason}* ${foundWord ? `(${foundWord})` : ''}\n⛔ تم طردك من المجموعة.`,
        mentions: [m.sender]
      });

      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    } catch (err) {
      console.error('فشل الطرد:', err);
      await conn.sendMessage(m.chat, {
        text: `❌ فشل طرد @${senderTag} — تأكد من صلاحيات البوت.`,
        mentions: [m.sender]
      });
    }
  }
};

// fallback: بعض الإطارات تستخدم all
handler.all = handler.before;
handler.all = true;

handler.command = /^(محتوي)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
