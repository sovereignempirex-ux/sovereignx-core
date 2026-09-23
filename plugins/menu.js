/* ========== 𝑺𝒂𝒍𝒆𝒗𝑒𝓇 Main Menu — nativeFlow ==========
 * .الاوامر        → بطاقة بصورة + قائمة منسدلة بالأقسام + أزرار
 * .الاوامر <رقم>  → أوامر ذلك القسم + زر رجوع
 * الرد برقم مذكور في رسالة القائمة يعمل أيضاً (للتوافق القديم)
 */
import { BRAND } from '../system/config.js';
import { sendCard, selectbtn, qbtn, urlbtn, PREFIX, CHANNEL_URL } from '../system/ui.js';

const MENU_TIMEOUT = 120000;

const CATEGORIES = [
    [1, 'التحميل', 'downloads', '📂'],
    [2, 'المجموعات', 'group', '🐞'],
    [3, 'الملصقات', 'sticker', '🌄'],
    [4, 'المطورين', 'owner', '🫦'],
    [5, 'أمثلة', 'example', '✳️'],
    [6, 'الأدوات', 'tools', '🚀'],
    [7, 'البحث', 'search', '🌐'],
    [8, 'الإدارة', 'admin', '👨🏻‍⚖️'],
    [9, 'الألعاب', 'games', '🎮'],
    [10, 'الجيف', 'gif', '✴️'],
    [11, 'البنك', 'bank', '💰'],
    [12, 'الذكاء الاصطناعي', 'ai', '🤖'],
    [13, 'البوتات الفرعية', 'sub', '♥️'],
    [14, 'معلومات البوت', 'info', '🗃️'],
    [15, 'الألقاب', 'nicknames', '🫯'],
    [16, 'الشعار', 'logos', '🎡'],
    [17, 'تغيير الأصوات', 'voices', '📢'],
    [18, 'أخرى', 'other', '🌹']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

if (!global.menus) global.menus = {};

const clean = () => {
    const now = Date.now();
    Object.keys(global.menus).forEach(k => {
        if (now - global.menus[k].time > MENU_TIMEOUT) delete global.menus[k];
    });
};

const getImg = (bot) => {
    const { images } = bot.config.info;
    return Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : images;
};

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363412381946365@newsletter',
        newsletterName: BRAND,
        serverMessageId: 0
    },
    externalAdReply: {
        title: `${BRAND} 🎪`,
        body: "بوت هادي وجميل • 𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const uptime = () => {
    const s = Math.floor(process.uptime());
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/* تجميع الأوامر حسب القسم */
const loadCats = async (bot) => {
    const cmds = await bot.getAllCommands();
    const cats = {};
    cmds.forEach(c => {
        if (!c.usage?.length) return;
        const cat = c.category || 'other';
        if (!cats[cat]) cats[cat] = [];
        cats[cat].push(c);
    });
    return { cmds, cats };
};

/* ========== عرض أوامر قسم ========== */
const showCategory = async (m, { conn, bot }, n) => {
    const cat = getCat(parseInt(n));
    if (!cat) {
        await conn.sendMessage(m.chat, { text: `*🅇 اختار رقم صحيح من 1 لـ ${CATEGORIES.length}*` }, { quoted: m });
        return null;
    }

    const { cats } = await loadCats(bot);
    const cmds = cats[cat[2]];
    if (!cmds?.length) {
        await conn.sendMessage(m.chat, { text: '*🅇 القسم فاضي 🍃*' }, { quoted: m });
        return null;
    }

    const list = cmds.map(c => `┃${cat[3]} /${c.usage.join(`\n┃${cat[3]} /`)}`).join('\n');

    const body = `╭─┈┈─⟞${cat[3]}⟝─┈┈─╮
┃ *⌯︙ ${cat[1]} ${cat[3]}*
╰─┈┈─⟞${cat[3]}⟝─┈┈─╯

${list}

╭─┈┈─⟞${cat[3]}⟝─┈┈─╮
┃ *⌯︙${BRAND} 🌿*
╰─┈┈─⟞${cat[3]}⟝─┈┈─╯`;

    return await sendCard({
        conn,
        jid: m.chat,
        text: body,
        frameIt: false,
        buttons: [
            qbtn('↩︎ القائمة', `${PREFIX}الاوامر`),
            urlbtn('◈ القناة', CHANNEL_URL)
        ],
        mentions: m.sender ? [m.sender] : [],
        quoted: global.reply_status || m
    });
};

/* ========== القائمة الرئيسية ========== */
const menu = async (m, { conn, bot, args }) => {
    clean();

    /* .الاوامر <رقم> */
    const sel = args && args.length ? parseInt(args[0]) : NaN;
    if (!Number.isNaN(sel) && sel > 0) {
        await showCategory(m, { conn, bot }, sel);
        return;
    }

    const { cmds, cats } = await loadCats(bot);

    const sections = [{
        title: `${BRAND} ~ الأقسام`,
        highlight_label: `${CATEGORIES.length} قسم`,
        rows: CATEGORIES.map(c => ({
            title: `${c[3]} ${c[1]}`,
            description: `${(cats[c[2]] || []).length} أمر — اضغط للعرض`,
            id: `${PREFIX}الاوامر ${c[0]}`
        }))
    }];

    const caption = `╭─┈┈─⟞🅇⟝─┈┈─╮
┃ *${BRAND} 🌿*
╰─┈┈─⟞🅇⟝─┈┈─╯

◍ أهلاً @${m.sender.split('@')[0]} ✨
◍ الأقسام: *${CATEGORIES.length}*
◍ الأوامر: *${cmds.filter(c => c.usage?.length).length}*
◍ التشغيل: *${uptime()}*

> اختار قسم من القائمة 👇`;

    const msg = await sendCard({
        conn,
        jid: m.chat,
        text: caption,
        frameIt: false,
        image: getImg(bot),
        buttons: [
            selectbtn(`📂 الأقسام (${CATEGORIES.length})`, sections),
            qbtn('◍ مطور', `${PREFIX}owner`),
            urlbtn('◈ القناة', CHANNEL_URL)
        ],
        mentions: m.sender ? [m.sender] : [],
        quoted: global.reply_status || m
    });

    if (msg && msg.key) {
        global.menus[msg.key.id] = { cats, chatId: m.chat, time: Date.now() };
    }
};

/* ========== الرد برقم (توافق مع السلوك القديم) ========== */
menu.before = async (m, { conn, bot }) => {
    clean();

    const menuData = global.menus[m.quoted?.id];
    if (!menuData) return false;

    const cat = getCat(parseInt(m.text));
    if (!cat) {
        await conn.sendMessage(m.chat, { text: 'اختار رقم من القائمة بس 🌿' }, { quoted: global.reply_status });
        return true;
    }

    try {
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: m.quoted.id, fromMe: true } });
    } catch { /* نتجاهل */ }
    delete global.menus[m.quoted.id];

    await showCategory(m, { conn, bot }, cat[0]);
    return true;
};

menu.command = ['الاوامر', 'القائمة', 'menu', 'اوامر'];
export default menu;
