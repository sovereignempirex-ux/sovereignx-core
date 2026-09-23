/* ========== Free Fire Info - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import axios from 'axios';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const test = async (m, { text, usedPrefix, command }) => {
  if (!text || !/^\d+$/.test(text)) {
    return m.reply(`📝 *الاستخدام:*\n.${command} <معرف فري فاير>\n\n*مثال:*\n.${command} 1010493740`);
  }

  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const res = await axios.get(`https://obito-mr-apis.vercel.app/api/info/freefire?id=${text}`);
    const data = res.data;

    if (!data.success || !data.account) {
      return m.reply('🅇 لم يتم العثور على معلومات الحساب 🌿');
    }

    const info = data.account.Informations_Compte;

    let reply = `
🎮 *معلومات حساب فري فاير*
═══════════════════════
👤 *الاسم:* ${info.Nom}
🆔 *المعرف:* ${info.ID}
⭐ *المستوى:* ${info.Niveau}
📍 *المنطقة:* ${info.Région}
❤️ *الإعجابات:* ${info.J_aimes}
🎖️ *نقاط الشرف:* ${info.Points_Honneur}
🏆 *حالة المشاهير:* ${info.Statut_Célébrité}
🧢 *اللقب:* ${info.Titre}
📂 *آخر إصدار:* ${info.Dernière_Version}
💳 *بطاقة بووياه:* ${info.Passe_Booyah}
🎗️ *شارات البطاقة:* ${info.Badges_BP}
⚔️ *رتبة باتل رويال:* ${info.Rang_BR}
🎯 *نقاط كلاش سكواد:* ${info.Points_CS}
📈 *أعلى نقاط كلاش:* ${info.Points_CS_Max}
📅 *تاريخ الإنشاء:* ${info.Date_Création}
🖼️ *ايدي الصورة:* ${info.ID_Avatar}
🎨 *ايدي البانر:* ${info.ID_Bannière}
🏅 *ايدي الشارة:* ${info.ID_Pin}
🎭 *المهارات:* ${info.Compétences_Équipées}
🔫 *ايدي السلاح:* ${info.ID_Arme}
🏃 *ايدي الحركة:* ${info.ID_Animation}
🔄 *ايدي التحويل:* ${info.ID_Transformation}
═══════════════════════
🐾 *الحيوان الأليف:*
🆔 *مثبت؟:* ${info.Animal_Équipé}
📛 *الاسم:* ${info.Nom_Animal}
🔰 *النوع:* ${info.Type_Animal}
⭐ *الخبرة:* ${info.Exp_Animal}
📊 *المستوى:* ${info.Niveau_Animal}
═══════════════════════
👥 *النقابة:*
🏷️ *الاسم:* ${info.Nom_Guilde}
🆔 *الايدي:* ${info.ID_Guilde}
📊 *المستوى:* ${info.Niveau_Guilde}
👥 *الأعضاء:* ${info.Membres_Guilde}
═══════════════════════
👑 *القائد:*
👤 *الاسم:* ${info.Nom_Chef}
🆔 *الايدي:* ${info.ID_Chef}
⭐ *المستوى:* ${info.Niveau_Chef}
📅 *تاريخ الإنشاء:* ${info.Date_Création_Chef}
🕒 *آخر دخول:* ${info.Dernière_Connexion_Chef}
🧢 *اللقب:* ${info.Titre_Chef}
🎗️ *الشارات:* ${info.Badges_Chef}
⚔️ *نقاط BR:* ${info.Points_BR_Chef}
🎯 *نقاط CS:* ${info.Points_CS_Chef}
═══════════════════════
✨ 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`.trim();

    await conn.sendMessage(m.chat, { text: reply, contextInfo: { 
      externalAdReply: {
        title: "Free Fire Info 🎮",
        body: "𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
        thumbnailUrl: await getXAsset(),
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }}, { quoted: m });
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });

  } catch (err) {
    console.error(err);
    m.reply(`${await getCalmResponse('error')}\n\n🔍 حاول لاحقاً`);
  }
};

test.usage = ["freefire <id>", "فريفاير <id>", "infoff <id>"];
test.command = ["freefire", "فريفاير", "infoff", "ffinfo"];
test.category = "tools";
export default test;