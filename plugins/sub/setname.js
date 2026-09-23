/* ========== Set Sub-Bot Name - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import fs from 'fs';
import path from 'path';
import { getCalmResponse } from "../../system/utils.js";

const test = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📝 *الاستخدام:*\n.${usedPrefix + command} <الاسم الجديد>\n\n*مثال:*\n.${usedPrefix + command} بوت-أحمد`);

  const senderNumber = m.sender.replace(/[^0-9]/g, '');
  const botPath = path.join('./Sessions', 'SubBot', senderNumber);
  const configPath = path.join(botPath, 'config.json');

  if (!fs.existsSync(botPath)) {
    return m.reply('✧ هذا الأمر للبوتات الفرعية فقط 🌿');
  }

  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      return m.reply('⚠️ خطأ في قراءة الإعدادات 🌿');
    }
  }

  config.name = text.trim();

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    m.reply(`☁️ تم تغيير اسم البوت الفرعي إلى: *${text.trim()}* ✨`);
  } catch (err) {
    console.error(err);
    m.reply('🅇 حدث خطأ أثناء الحفظ 🌿');
  }
};

test.usage = ["setname <name>"];
test.command = ["setname", "set-name", "اسم-البوت"];
test.category = "sub";
export default test;