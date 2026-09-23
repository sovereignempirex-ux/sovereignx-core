/* ========== Kiss Sticker - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import fetch from "node-fetch";
import { Sticker } from "wa-sticker-formatter";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const PACK = `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 ✨
╭────────────╮
│  Made with 💚
╰────────────╯`;

const AUTHOR = `👑 𝑺𝒂𝒍𝒆𝒗𝒆𝒓
╭────────────╮
│  𝑺𝒂𝒍𝒆𝒗𝒆𝒓
╰────────────╯`;

const test = async (m, { conn }) => {
  try {
    const sender = m.sender;
    let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    
    const waitMsg = await m.reply(await getCalmResponse('thinking'));
    
    const res = await fetch("https://api.waifu.pics/sfw/kiss");
    const json = await res.json();
    const imageUrl = json.url;

    const senderNumber = sender.split("@")[0];
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:salever;bot;;;
FN:𝑺𝒶𝓁𝑒𝓋𝑒𝓇
item1.TEL;waid=${senderNumber}:${senderNumber}
item1.X-ABLabel:Ponsel
END:VCARD`;

    const fkontak = {
      key: { participant: "0@s.whatsapp.net", remoteJid: "status@broadcast", id: "Halo" },
      message: { contactMessage: { displayName: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇", vcard: vCard } },
      participant: "0@s.whatsapp.net"
    };

    const sticker = new Sticker(imageUrl, { type: 'full', pack: PACK, author: AUTHOR, quality: 70 });
    const buffer = await sticker.toBuffer();

    const groupPic = await conn.profilePictureUrl(m.chat, "image").catch(() => SALEVER_IMG);
    const forwardInfo = {
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363412381946365@newsletter',
          serverMessageId: 777,
          newsletterName: '𝑺𝒶𝓁𝑒𝓋𝑒𝓇'
        },
        externalAdReply: {
          title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 💚",
          body: "بوت هادي وجميل • 𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
          thumbnailUrl: groupPic,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    };

    await conn.sendMessage(m.chat, { sticker: buffer, ...forwardInfo }, { quoted: fkontak });
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    
  } catch (e) {
    console.error("ERROR kiss:", e);
    m.reply(await getCalmResponse('error'));
  }
};

test.usage = ["kiss @user", "kiss (بالرد)"];
test.command = ["kiss", "kissnew", "kissx"];
test.category = "sticker";
export default test;