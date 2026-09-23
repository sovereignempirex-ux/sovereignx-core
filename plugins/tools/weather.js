/* ========== Weather - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import axios from 'axios';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const test = async (m, { conn, args, usedPrefix }) => {
  if (!args.length) {
    return m.reply(`${await getCalmResponse('notFound')}\n\n📝 *الاستخدام:*\n.${usedPrefix}الطقس <مدينة>\n\n*مثال:*\n.${usedPrefix}الطقس Agadir\n.${usedPrefix}الطقس Marrakech`);
  }

  let city = args.join(' ').trim();
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    await conn.sendMessage(m.chat, { react: { text: '🌤️', key: m.key } }).catch(() => {});

    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!data || !data.current_condition) throw new Error('مدينة غير موجودة');

    let curr = data.current_condition[0];
    let area = data.nearest_area[0];
    let today = data.weather[0];

    let name = area.areaName[0].value;
    let country = area.country[0].value;
    let descAr = curr.lang_ar?.[0]?.value || curr.weatherDesc[0].value;
    let temp = curr.temp_C;
    let feels = curr.FeelsLikeC;
    let min = today.mintempC;
    let max = today.maxtempC;
    let hum = curr.humidity;
    let wind = curr.windspeedKmph;
    let cloud = curr.cloudcover;

    let emoji = temp >= 30 ? '🔥' : temp >= 20 ? '☀️' : temp >= 10 ? '🌤️' : '🥶';
    let joke = '';
    if (temp >= 40) joke = 'إذا خرجت غتولي شاورما! 🥙🔥';
    else if (temp >= 30) joke = 'الجو شاعل، دير كاسكيت وقرعة ما! 🧢💧';
    else if (temp >= 20) joke = 'جو زوين ديال الخرجة والتصاور! 📸';
    else if (temp >= 10) joke = 'برد خفيف، لبس جاكيط خفيفة! 🧥';
    else joke = 'برد قاصح! لبس مانطا وخرج! 🥶';

    let txt = `
🌿 *${name} - ${country}*

📝 *الوصف:* ${descAr}
🌡️ *الحرارة:* ${temp}°C
🤔 *يحسب كأنّها:* ${feels}°C
🔻 *الصغرى:* ${min}°C
🔺 *الكبرى:* ${max}°C
💧 *الرطوبة:* ${hum}%
💨 *الرياح:* ${wind} كم/س
☁️ *الغيوم:* ${cloud}%

${emoji} *${joke}*

✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓`.trim();

    await conn.sendMessage(m.chat, { 
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: "🌤️ الطقس",
          body: `${name} - ${country}`,
          thumbnailUrl: await getXAsset(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {});

  } catch (err) {
    console.error('[weather]', err);
    await m.react('🅇').catch(() => {});
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ما لقيتش المدينة: ${city}\n💡 جرّب تكتبها بالإنجليزية\nمثال: .الطقس Agadir`);
  }
};

test.usage = ["الطقس <مدينة>"];
test.command = ["الطقس", "طقس", "weather", "clima"];
test.category = "tools";
export default test;