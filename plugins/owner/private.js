/* ========== Private Lock/Unlock - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import fs from 'fs';
import path from 'path';
import { getCalmResponse, getXAsset } from "../../system/utils.js";
import { OWNER_NUMBERS, isOwner } from "../../system/config.js";

const SETTINGS_FILE = path.join(process.cwd(), 'system', 'config', 'private_lock.json');

let privateLocked = false;
const allowedNumbers = [...OWNER_NUMBERS];

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      privateLocked = data.locked || false;
      if (data.allowedNumbers) allowedNumbers.push(...data.allowedNumbers);
    }
  } catch (e) { console.error('[PRIVATE] Error loading settings:', e); }
}

function saveSettings() {
  try {
    fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ locked: privateLocked, allowedNumbers }, null, 2));
  } catch (e) { console.error('[PRIVATE] Error saving settings:', e); }
}

function extractNumber(jid) {
  if (!jid) return '';
  let num = jid.split('@')[0];
  if (num.includes(':')) num = num.split(':')[0];
  return num.replace(/\D/g, '');
}

loadSettings();

const test = async (m, { conn, command }) => {
  const senderNumber = extractNumber(m.sender);
  if (!allowedNumbers.includes(senderNumber) && !isOwner(senderNumber)) {
    return await conn.sendMessage(m.chat, { text: '🚫 هذا الأمر للمطورين فقط 🌿' }, { quoted: m });
  }

  if (['الخاص-قفل', 'قفل-الخاص', 'lockpm'].includes(command)) {
    if (privateLocked) return await conn.sendMessage(m.chat, { text: '⚠️ الخاص مقفول بالفعل 🌿' }, { quoted: m });
    privateLocked = true;
    saveSettings();
    await conn.sendMessage(m.chat, { 
      text: '🔒 تم قفل الخاص\nأي شخص غير مصرح له سيحظر تلقائياً لو حاول يكلمني 🌿',
      contextInfo: { externalAdReply: { title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🔒", body: "Private Lock", thumbnailUrl: await getXAsset(), mediaType: 1, renderLargerThumbnail: true } }
    }, { quoted: m });
  }

  if (['الخاص-فتح', 'فتح-الخاص', 'unlockpm'].includes(command)) {
    if (!privateLocked) return await conn.sendMessage(m.chat, { text: '⚠️ الخاص مفتوح بالفعل 🌿' }, { quoted: m });
    privateLocked = false;
    saveSettings();
    await conn.sendMessage(m.chat, { 
      text: '🔓 تم فتح الخاص بنجاح\nيمكن للجميع المراسلة الآن ✨',
      contextInfo: { externalAdReply: { title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🔓", body: "Private Unlock", thumbnailUrl: await getXAsset(), mediaType: 1, renderLargerThumbnail: true } }
    }, { quoted: m });
  }
};

test.before = async function (m, { conn }) {
  if (!m.chat.endsWith('@s.whatsapp.net')) return;
  if (!privateLocked) return;

  const senderNumber = extractNumber(m.sender);
  if (!allowedNumbers.includes(senderNumber) && !isOwner(senderNumber)) {
    try {
      await conn.sendMessage(m.chat, { text: '🔒 الخاص مقفل، سيتم حظرك تلقائياً 🌿' });
      await conn.updateBlockStatus(m.chat, 'block');
    } catch (e) { console.log('🅇 فشل في الحظر:', e); }
    return true;
  }
};

test.usage = ["الخاص-قفل", "الخاص-فتح", "قفل-الخاص", "فتح-الخاص"];
test.command = ["الخاص-قفل", "قفل-الخاص", "lockpm", "الخاص-فتح", "فتح-الخاص", "unlockpm"];
test.category = "owner";
export default test;