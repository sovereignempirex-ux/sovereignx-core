/* ========== Bot Configuration (Internal) ========== */
import fs from "fs";
import path from "path";

const CONFIG_DIR = path.join(process.cwd(), "system", "config");
if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });

/* ========== Owners / Developers — Single Source of Truth ==========
   كل أرقام المالكين تُقرأ من هنا فقط. غيّرها من هذا المكان وستنعكس
   على: index.js، private.js، cmd.js، yahyah.js، video-downloader،
   script.js، والقوائم والأمثلة. */
export const BOT_NUMBER = "201283073813";

export const OWNERS = [
  { name: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇",    jid: "201283073813@s.whatsapp.net", lid: "13521110712571@lid",   bot: true  },
  { name: "بوني العزيز", jid: "97431298191@s.whatsapp.net",  lid: "130391365169264@lid", bot: false }
];

export const OWNER_JIDS    = OWNERS.map(o => o.jid);
export const OWNER_LIDS    = OWNERS.filter(o => o.lid).map(o => o.lid);
export const OWNER_NUMBERS = OWNERS.map(o => o.jid.split("@")[0]);
export const DEV_NUMBERS   = OWNERS.filter(o => !o.bot).map(o => o.jid.split("@")[0]);
export const DEV_NUMBER    = DEV_NUMBERS[0] || BOT_NUMBER;

/** تحقّق حيّ من المالك — يقبل JID أو LID أو JID بجهاز أو رقم صريح */
export const isOwner = (who) => {
  if (!who) return false;
  const s = String(who);
  const num = s.split(":")[0].split("@")[0].replace(/\D/g, "");
  return OWNERS.some(o =>
    o.jid === s || (o.lid && o.lid === s) || (!!num && o.jid.split("@")[0] === num)
  );
};

const defaultConfig = {
  info: { 
    nameBot: "𝑺𝒂𝒍𝒆𝒗𝒆𝒓", 
    nameChannel: "𝑺𝒂𝒍𝒆𝒗𝒆𝒓", 
    idChannel: "120363412381946365@newsletter",
    urls: {
      repo: "https://github.com/sovereignempirex-ux/sovereignx-core",
      api: "https://emam-api.web.id",
      channel: "https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K"
    },
    copyright: { 
      pack: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓', 
      author: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓'
    },
    images: [
      "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg",
      "https://i.postimg.cc/g0962vhb/I.jpg",
      "https://i.postimg.cc/vmN8mykt/UI.jpg"
    ]
  },
  owners: OWNERS,
  phoneNumber: BOT_NUMBER,
  status: {
    version: "8.0.9",
    started: new Date().toISOString(),
    uptime: "00:00:00"
  },
  commands: new Map()
};

let botConfig = { ...defaultConfig };

/* ========== Brand (single source — لا تكتب الأحرف يدوياً) ========== */
export const BRAND = defaultConfig.info.nameBot;

/* ========== Terminal Banner ========== */
const TERMINAL_BANNER = `
\x1b[90m╔════════════════════════════════════════════════════════════════════════════╗
║                                                                              \x1b[0m
║    ███████╗ █████╗ ██╗     ███████╗██╗   ██╗███████╗██████╗                 \x1b[0m
║    ██╔════╝██╔══██╗██║     ██╔════╝██║   ██║██╔════╝██╔══██╗                \x1b[0m
║    ███████╗███████║██║     █████╗  ██║   ██║█████╗  ██████╔╝                \x1b[0m
║    ╚════██║██╔══██║██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██╔══██╗                \x1b[0m
║    ███████║██║  ██║███████╗███████╗ ╚████╔╝ ███████╗██║  ██║                \x1b[0m
║    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝                \x1b[0m
║                                                                              \x1b[0m
║                    🅇  \x1b[90m𝑺𝒂𝒍𝒆𝒗𝒆𝒓\x1b[0m 🅇                                          \x1b[0m
║                                                                              \x1b[0m
║    ┌─────────────────────────────────────────────────────────────────┐     \x1b[0m
║    │  Channel: https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K │     \x1b[0m
║    │  ID: 120363412381946365@newsletter                              │     \x1b[0m
║    │  Version: 8.0.9                                                 │     \x1b[0m
║    │  Status: ● Online                                               │     \x1b[0m
║    └─────────────────────────────────────────────────────────────────┘     \x1b[0m
║                                                                              \x1b[0m
║    🅇 Built with ♡ by svcp  •  𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Framework  🅇                    \x1b[0m
║                                                                              \x1b[0m
╚════════════════════════════════════════════════════════════════════════════╝
\x1b[0m
`;

/* ========== Response Templates (Calm & Beautiful) ========== */
const responseTemplates = {
  greeting: [
    "أهلاً بك 🌿",
    "مرحباً ✨",
    "أهلاً 🍃",
    "هلا فيك 💫"
  ],
  thinking: [
    "لحظة من فضلك... 🤍",
    "جاري التحضير... ✨",
    "ثواني معدودة... 🌿"
  ],
  success: [
    "تم بنجاح ✨",
    "جاهز 🌿",
    "بالتوفيق 💫"
  ],
  error: [
    "حدث خطأ بسيط 🌿\nجرّب مرة تانية لو سمحت",
    "مشكلة صغيرة 🍃\nالبوت هيعمل تاني بعد شوية",
    "غلطة في السيرفر ✨\nممكن تعيد المحاولة؟"
  ],
  notFound: [
    "الأمر ده مش موجود 🌿\nاكتب .الاوامر تشوف المتاح",
    "مفيش أمر بالاسم ده ✨\nالقائمة فيها كل حاجة"
  ],
  permission: [
    "ال أمر ده للمطورين بس 🌿",
    "محتاج صلاحيات أعلى ✨"
  ],
  cooldown: [
    "استنى شوية 🌿\nالبوت بياخد راحته",
    "ثواني وترجع تكمل ✨"
  ]
};

/* ========== Get Random Response ========== */
const getResponse = (type) => {
  const templates = responseTemplates[type] || responseTemplates.greeting;
  return templates[Math.floor(Math.random() * templates.length)];
};

/* ========== Initialize Configuration ========== */
export const initBotConfig = (client) => {
  // Load any saved config or use defaults
  const configPath = path.join(CONFIG_DIR, "bot-config.json");
  if (fs.existsSync(configPath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      botConfig = { ...defaultConfig, ...saved };
    } catch (e) {
      console.error("⚠️ Error loading config, using defaults:", e.message);
      botConfig = { ...defaultConfig };
    }
  }
  
  // Print beautiful terminal banner
  printStartupBanner(client);
  
  // Register all commands with the system
  registerDefaultCommands();
  
  return botConfig;
};

/* ========== Print Startup Banner ========== */
const printStartupBanner = (client) => {
  // Clear console
  console.clear();
  
  // Print banner
  console.log(TERMINAL_BANNER);
  
  // Print connection info
  setTimeout(() => {
    console.log('\n🅇  متصل وجاهز للاستخدام  🅇\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝  اكتب .الاوامر أو .القائمة لعرض الأوامر');
    console.log('💬  الردود هتكون هادية وجميلة دايمًا');
    console.log('🅇  أيقونة البوت: حرف X متحرك\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }, 500);
};

/* ========== Default Commands Registration ========== */
const registerDefaultCommands = () => {
  botConfig.commands.set('x', {
    name: 'حركة حرف X',
    description: 'Shows the moving X animation',
    category: 'logos',
    usage: ['.x'],
    handler: async (m, { conn }) => {
      const xAsset = await createMovingXAsset();
      await conn.sendMessage(m.chat, { image: xAsset }, { quoted: global.reply_status });
    }
  });
  
  botConfig.commands.set('logo', {
    name: 'شعار X',
    description: 'Creates a custom X logo',
    category: 'logos',
    usage: ['.logo النص'],
    handler: async (m, { conn, text }) => {
      if (!text) return m.reply("مثال: .logo 𝑺𝒂𝒍𝒆𝒗𝒆𝒓");
      const logo = await createXLogo(text);
      await conn.sendMessage(m.chat, { image: logo }, { quoted: global.reply_status });
    }
  });
};

/* ========== Get Bot Info ========== */
export const getBotInfo = () => {
  return {
    name: botConfig.info.nameBot,
    version: botConfig.status.version,
    uptime: botConfig.status.uptime,
    connected: !!client?.sock?.connected
  };
};

/* ========== Export Internal Functions ========== */
export const createMovingXAsset = async () => {
  const procModule = await import('./system/image-processor.js');
  const { createMovingX } = procModule;
  return await createMovingX('𝑺𝒂𝒍𝒆𝒗𝒆𝒓');
};

export const createXLogo = async (text) => {
  const procModule = await import('./system/image-processor.js');
  const { createXLogo: createLogo } = procModule;
  return await createLogo(text);
};

export const getCalmResponse = (type) => getResponse(type);

export default botConfig;