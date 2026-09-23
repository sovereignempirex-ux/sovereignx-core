import { createSticker, getCalmResponse } from "../../system/utils.js";

const test = async (m, { conn, args }) => {
  if (!m.quoted) return m.reply(await getCalmResponse('notFound') + "\n\nرد على ملصق واكتب .حقوق اسم | مؤلف");
  
  let [pack, author] = args.join(" ").split(" | ");
  
  if (!args.length) {
    return m.reply("📝 *الاستخدام:*\n`.حقوق اسم الباك | اسم المؤلف`\n\n*مثال:*\n`.حقوق venom | 2010`");
  }
  
  if (!pack) pack = "𝑺𝒶𝓁𝑒𝓋𝑒𝓇";
  if (author === undefined) author = null;
  
  const q = await m.quoted;
  const waitMsg = await m.reply(await getCalmResponse('thinking'));
  
  try {
    const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

    await conn.sendMessage(
      m.chat,
      { sticker: buffer, contextInfo: context(m.sender, await getXAsset()) },
      { quoted: global.reply_status }
    );
    
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
  } catch (e) {
    await waitMsg.edit(await getCalmResponse('error'));
  }
};

test.usage = ["حقوق نص | نص"];
test.command = ["حقوق"];
test.category = "sticker";
export default test;

const getXAsset = async () => {
  try {
    const procModule = await import('../../system/utils.js');
    const { getXAsset: getX } = procModule;
    return await getX();
  } catch (e) {
    return "https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg";
  }
};

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363412381946365@newsletter',
        newsletterName: '𝑺𝒶𝓁𝑒𝓋𝑒𝓇',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🎪",
        body: "بوت هادي وجميل • 𝑺𝒂𝒍𝒆𝒗𝒆𝒓",
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});