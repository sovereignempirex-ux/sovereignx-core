import fs from "fs";
import path from "path";

/* ========== Calm Response Helper ========== */
const getCalmResponse = async (type) => {
  try {
    const { getCalmResponse: getResp } = await import('./config.js');
    return getResp(type);
  } catch (e) {
    const fallbacks = {
      error: "حدث خطأ بسيط 🌿\nجرّب مرة تانية لو سمحت",
      permission: "الأمر ده للمطورين بس 🌿",
      cooldown: "استنى شوية 🌿\nالبوت بياخد راحته",
      notFound: "الأمر ده مش موجود 🌿\nاكتب .الاوامر تشوف المتاح",
      group: "الأمر ده بيشتغل بس ف الجروبات 🌿",
      admin: "محتاج تكون ادمن ✨",
      botAdmin: "حطني ادمن عشان أقدر أساعدك 🌿",
      private: "الأمر ده في الخاص فقط 🍃"
    };
    return fallbacks[type] || "حصل خطأ بسيط 🌿";
  }
};

/* ========== Get X Asset ========== */
const getXAsset = async () => {
  try {
    const procModule = await import('./system/utils.js');
    const { getXAsset: getX } = procModule;
    return await getX();
  } catch (e) {
    return "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg";
  }
};

/* ========== Group Events ========== */
const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;

        const users = participants.length 
            ? participants.map(p => '@' + p.split('@')[0]).join(' و ') 
            : 'حد';
        const authorTag = author ? '@' + author.split('@')[0] : 'حد';

        const messages = {
            add: `أهلاً ${users} 🌿\nانورتم الجروب ✨`,
            remove: `${users} خرج من الجروب 🍃`,
            promote: `مبارك ${users} 🌿\nبقى ادمن ✨`,
            demote: `${users} بقي عضو عادي 🍃`
        };

        const txt = messages[eventType];
        if (!txt) return null;
        
        if (global.db.groups[event.chat]?.noWelcome === true) return 9999;

        const img = await getXAsset();

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info.nameBot || "𝑺𝒶𝓁𝑒𝓋𝑒𝓇",
            body: "بوت هادي وجميل • 𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
            mentions: author ? [author, ...participants] : participants,
            newsletter: {
                name: '𝑺𝒶𝓁𝑒𝓋𝑒𝓇',
                jid: '120363412381946365@newsletter'
            },
            big: ["remove", "add"].includes(eventType)
        });

    } catch (e) {
        console.error(e);
    }
    return null;
};

/* ========== Access Control ========== */
const access = async (msg, checkType, time) => {
    const conn = await msg.client();
    
    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };
    
    const messages = {
        cooldown: async () => `⏳ ${await getCalmResponse('cooldown')}`,
        owner: async () => `🔐 ${await getCalmResponse('permission')}`,
        group: async () => `👥 ${await getCalmResponse('group')}`,
        admin: async () => `👮 ${await getCalmResponse('admin')}`,
        private: async () => `💬 ${await getCalmResponse('private')}`,
        botAdmin: async () => `🤖 ${await getCalmResponse('botAdmin')}`,
        noSub: async () => `🌿 الأمر ده في البوت الأساسي فقط\nقناة البوت: https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K`,
        disabled: async () => `🔧 الأمر تحت الصيانة دلوقتي\nجرّب بعد شوية ✨`,
        error: async () => `🅇 ${await getCalmResponse('error')}`
    };
    
    const messageFn = messages[checkType];
    if (conn && messageFn) {
        const messageText = await messageFn();
        await conn.msgUrl(msg.chat, messageText, {
            img: await getXAsset(),
            title: "🅇 تنبيه 🅇",
            body: "𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
            newsletter: {
                name: '𝑺𝒶𝓁𝑒𝓋𝑒𝓇',
                jid: '120363412381946365@newsletter'
            },
            big: false
        }, quoted);
        return false;  
    }
    return null;  
};

export { access, group };