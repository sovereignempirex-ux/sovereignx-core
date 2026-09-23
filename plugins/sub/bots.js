/* ========== List Active Sub-Bots - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import ws from 'ws';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  let uniqueUsers = new Map();

  if (!global.conns || !Array.isArray(global.conns)) global.conns = [];

  for (const connSub of global.conns) {
    if (connSub.user && connSub.ws?.socket?.readyState !== ws.CLOSED) {
      const jid = connSub.user?.id;
      const numero = jid?.split('@')[0]?.split(':')[0];

      let nombre = connSub.user.name;
      if (!nombre && typeof conn.getName === 'function') {
        try {
          nombre = await conn.getName(jid);
        } catch {
          nombre = `بوت ${numero}`;
        }
      }

      uniqueUsers.set(jid, nombre || `بوت ${numero}`);
    }
  }

  const uptime = process.uptime() * 1000;
  const formatUptime = clockString(uptime);
  const totalUsers = uniqueUsers.size;

  let txt = `🤖 *البوتات الفرعية النشطة*\n\n`;
  txt += `⏱️ *الوقت:* ${formatUptime}\n`;
  txt += `🤖 *متصلين:* ${totalUsers}\n`;

  if (totalUsers > 0) {
    txt += `\n📋 *القائمة:*\n\n`;
    let i = 1;
    for (const [jid, nombre] of uniqueUsers) {
      const numero = jid.split('@')[0];
      txt += `${i++}. *${nombre}*\n> 📱 wa.me/${numero}\n\n`;
    }
  } else {
    txt += `\n> لا توجد بوتات فرعية متصلة حالياً 🌿`;
  }

  await conn.sendMessage(m.chat, { 
    text: txt.trim(),
    contextInfo: { 
      externalAdReply: {
        title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🤖",
        body: "Sub-Bots Manager",
        thumbnailUrl: await getXAsset(),
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
  
  await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
};

test.usage = ["البوتات", "بوتات", "sublist"];
test.command = ["البوتات", "بوتات", "sublist", "sub-bots"];
test.category = "sub";
export default test;