import { createSticker, getCalmResponse } from "../../system/utils.js";

const test = async (m, { conn, bot }) => {
  if (!m.quoted) return m.reply(await getCalmResponse('notFound') + "\n\nرد على صورة أو فيديو واكتب .ملصق");
  
  const { pack, author } = bot.config.info.copyright;
  const q = await m.quoted;
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

    await conn.sendMessage(
      m.chat,
      { sticker: buffer },
      { quoted: global.reply_status }
    );
    
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
  } catch (e) {
    await waitMsg.edit(await getCalmResponse('error'));
  }
};

test.usage = ["ملصق"];
test.command = ["ملصق", "s"];
test.category = "sticker";
export default test;