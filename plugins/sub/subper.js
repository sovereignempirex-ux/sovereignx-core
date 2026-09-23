/* ========== List Custom Sub-Bots - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import fs from 'fs';
import path from 'path';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  const jadiPath = path.join('Sessions', 'SubBot');
  let listaSubs = [];

  if (fs.existsSync(jadiPath)) {
    const carpetas = fs.readdirSync(jadiPath).filter(f => fs.statSync(path.join(jadiPath, f)).isDirectory());

    for (const carpeta of carpetas) {
      const configPath = path.join(jadiPath, carpeta, 'config.json');
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          const nombre = config.name || 'بدون اسم مخصص';
          const numero = carpeta;
          listaSubs.push({ numero, nombre });
        } catch (e) {
          console.log(`✘ خطأ في قراءة config للبوت: ${carpeta}`);
        }
      }
    }
  }

  if (!listaSubs.length) {
    return m.reply(`🤖 *البوتات الفرعية المخصصة*\n\n> لا توجد بوتات مخصصة نشطة\n> استخدم *.code* أو *.qr* لإنشاء واحد 🌿`);
  }

  let msg = `🤖 *البوتات الفرعية المخصصة النشطة*\n\n`;
  listaSubs.forEach((s, i) => {
    msg += `${i + 1}. *${s.nombre}*\n> 📱 wa.me/${s.numero}\n\n`;
  });
  msg += `📊 *الإجمالي:* ${listaSubs.length}\n\n✨ 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`;

  await conn.sendMessage(m.chat, { 
    text: msg.trim(),
    contextInfo: { 
      externalAdReply: {
        title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🤖",
        body: "Custom Sub-Bots",
        thumbnailUrl: await getXAsset(),
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
  
  await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
};

test.usage = ["sublist", "subper"];
test.command = ["sublist", "subper", "بوتات-مخصصة"];
test.category = "sub";
export default test;