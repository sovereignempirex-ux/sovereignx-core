import Jimp from 'jimp';

const handler = async (m, { conn }) => {
    const q = m.quoted || m;
    const mime = q.mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply('🖼️ ~ رد على صورة لتغيير صورة البوت');
    }

    try {
        const media = await q.download();
        const image = await Jimp.read(media);
        const min = Math.min(image.getWidth(), image.getHeight());
        const cropped = image.crop(0, 0, min, min);
        const buffer = await cropped.scaleToFit(640, 640).getBufferAsync(Jimp.MIME_JPEG);
        
        await conn.updateProfilePicture(conn.user.id, buffer);
        m.reply('✅ ~ تم تغيير صورة بروفايل البوت بنجاح');
    } catch (error) {
        console.error(error);
        m.reply('❌ ~ فشل تغيير الصورة، تأكد من الصلاحيات');
    }
};

handler.help = ["ضع"];
handler.tags = ["owner"];
handler.command = ["ضع", "botpp"];
handler.owner = true;

export default handler;

