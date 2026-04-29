import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '201283073813', // Bot number
  prefix: [".", "/", "!","*"],
  fromMe: false, 
  owners: [
  // Owner 1
    { name: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿", lid: "13521110712571@lid", jid: "97431298191@s.whatsapp.net" },
  // Owner 2
    { name: "مطور حبيبي", lid: "130391365169264@lid", jid: "201283073813@s.whatsapp.net" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿", 
  nameChannel: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿", 
  idChannel: "120363409792989178@newsletter",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029Vb82Y93GehEEid2Xap23"
  },
  copyright: { 
    pack: '『 𝑸𝑼𝑨𝑵𝑻𝑼𝑴 𝑺𝑬𝑻 』', 
    author: '『 𝑲𝑰𝑵𝑮 𝑶𝑭 𝑿 』'
  },
  images: [
    "https://i.postimg.cc/vmN8mykt/UI.jpg",
    "https://i.postimg.cc/g0962vhb/I.jpg",
    "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
if (client.commandSystem) { 
sub(client)
  }
}, 2000);


/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
});


/* 
=========== Memory Monitor ========== 

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 800) {
        console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
        process.exit(1) 
    }
}, 300_000) 

*/
