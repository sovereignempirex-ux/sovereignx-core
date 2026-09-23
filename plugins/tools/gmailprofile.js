/* ========== Gmail Profile Lookup - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCalmResponse } from "../../system/utils.js";

const gmailProfile = {
  check: async function(email) {
    try {
      const username = email.split('@')[0];
      const { data } = await axios.post('https://gmail-osint.activetk.jp/', new URLSearchParams({ q: username, domain: 'gmail.com' }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Postify/1.0.0' }
      });
      const $ = cheerio.load(data);
      const text = $('pre').text();
      return {
        photoProfile: this.extract(text, /Custom profile picture !\s*=>\s*(.*)/, 'لا توجد صورة'),
        email,
        lastEditProfile: this.extract(text, /Last profile edit : (.*)/),
        googleID: this.extract(text, /Gaia ID : (.*)/),
        userTypes: this.extract(text, /User types : (.*)/),
        googleChat: {
          entityType: this.extract(text, /Entity Type : (.*)/),
          customerID: this.extract(text, /Customer ID : (.*)/, 'لا يوجد', true),
        },
        googlePlus: { enterpriseUser: this.extract(text, /Entreprise User : (.*)/) },
        mapsData: { profilePage: this.extract(text, /Profile page : (.*)/) },
        ipAddress: text.includes('Your IP has been blocked by Google') ? 'محظور من Google' : 'آمن',
        calendar: text.includes('No public Google Calendar') ? 'لا يوجد' : 'متاح'
      };
    } catch (error) { console.error(error); throw error; }
  },
  extract: function(text, regex, defaultValue = 'لا يوجد بيانات', checkNotFound = false) {
    const result = (text.match(regex) || [null, defaultValue])[1].trim();
    return checkNotFound && result === 'Not found.' ? 'لا يوجد بيانات' : result;
  }
};

const test = async (m, { conn, text }) => {
  if (!text) return m.reply(`📝 *الاستخدام:*\n.gmailprofile email@gmail.com\n\n*مثال:*\n.gmailprofile example@gmail.com`);

  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const result = await gmailProfile.check(text);
    const profileInfo = `
📧 *معلومات حساب Gmail*

📧 *الإيميل:* ${result.email}
🖼️ *الصورة:* ${result.photoProfile}
📅 *آخر تعديل:* ${result.lastEditProfile}
🆔 *Google ID:* ${result.googleID}
👤 *نوع المستخدم:* ${result.userTypes}
💬 *Google Chat:* ${result.googleChat.entityType}
🆔 *Customer ID:* ${result.googleChat.customerID}
🏢 *Enterprise:* ${result.googlePlus.enterpriseUser}
🗺️ *Maps:* ${result.mapsData.profilePage}
🔒 *IP Status:* ${result.ipAddress}
📅 *Calendar:* ${result.calendar}

🌿 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`.trim();

    await conn.sendMessage(m.chat, { text: profileInfo }, { quoted: m });
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
  } catch (error) {
    m.reply(`${await getCalmResponse('error')}\n\n🔍 ${error.message}`);
  }
};

test.usage = ["gmailprofile <email>"];
test.command = ["gmailprofile", "gmail", "emailinfo"];
test.category = "tools";
export default test;