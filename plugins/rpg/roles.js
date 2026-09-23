/* ========== RPG Roles System - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import { getCalmResponse } from "../../system/utils.js";

const roles = {
  'مواطن 👨🏻‍💼': 0,
  'فقير 😞': 2,
  'موظف 👨🏻‍🔧': 4,
  'رجل أعمال 🧑🏻‍✈️': 5,
  'طباخ 👨🏻‍🍳': 10,
  'عميل سري 🌙': 15,
  'عسكري 💂🏻': 20,
  'كاتب 📚': 30,
  'جاسوس 🕵🏻': 35,
  'مصارع 🤼‍♂️': 40,
  'قاضي 👩‍⚖️': 45,
  'لاعب كرة قدم ⚽': 50,
  'رسام 🧑🏻‍🎨': 55,
  'مدير بنك 🏦': 60,
  'مدير مدرسة 🧶': 65,
  'ضابط شرطة 👮‍♂️': 70,
  'محرر ✒️': 75,
  'ضابط جيش 🎖️': 80,
  'ممثل 👨‍🎤': 85,
  'نائب الرئيس 🤵🏻‍♂️': 90,
  'الرئيس 🤵🏻‍♂️': 100,
};

const test = m => m;

test.before = async function (m, { conn }) {
  if (!global.db || !global.db.data || !global.db.data.users) return true;
  let user = global.db.data.users[m.sender];
  if (!user) return true;
  let level = user.level || 0;
  let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0];
  user.role = role;
  return true;
};

test.category = "rpg";
export default test;