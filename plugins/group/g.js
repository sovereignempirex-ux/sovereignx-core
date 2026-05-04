import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';

// ─── قوائم الروابط ───
const IMAGES = [
    'https://i.postimg.cc/DzHzSQKH/01939d8542b48fae307f24c1307b77bc.jpg',
    'https://i.postimg.cc/pdpTVG3Y/04b81773fb5f08b61f5fdf63edd729c1.jpg',
    'https://i.postimg.cc/3RGxmy8J/070f3882be6af76fdf0e92b2d780a656.jpg',
    'https://i.postimg.cc/5t6097D5/086a994a17a3eb3a39233d85e965dc97.jpg',
    'https://i.postimg.cc/V6tknSfc/13e4dc37c8920adccea94e4ec58132b9.jpg',
    'https://i.postimg.cc/g0nJcS1D/2561f61782b4b4bc24cb9d4b994d7bac.jpg',
    'https://i.postimg.cc/0QSyD6k8/2868fb7f2f9219b06aa8146784c95d8b.jpg',
    'https://i.postimg.cc/Qt7d1BXP/31f784b0f0e9b9844e089f5fa0187716.jpg',
    'https://i.postimg.cc/DzHzSQKP/38b0b1f3578376de870654d66077879e.jpg',
    'https://i.postimg.cc/76zZ0CH4/4ac6778db233d1194c54f18f822f9b51.jpg',
    'https://i.postimg.cc/k5z52Ndj/520f261d12def467fe5b4113f749f875.jpg',
    'https://i.postimg.cc/wBZB15dh/54bb88dec6f98ccd6347b1adbfca2624.jpg',
    'https://i.postimg.cc/k5z52Ndy/5b10cb4cd633ff8d972e2e6214177dd9.jpg',
    'https://i.postimg.cc/Pq9qCbjk/5d6aed2b477b5fc556da56e0b5d9edc9.jpg',
    'https://i.postimg.cc/W4C4dmPm/5dccfda138fdbd3ce4a0a0abdf1b2618.jpg',
    'https://i.postimg.cc/vmkm47dj/6f6b647dede6423e661dd66ec96b7e61.jpg',
    'https://i.postimg.cc/rp3pDGLB/73e3e5aa18bc6e6fc027c83f6cfeecf0.jpg',
    'https://i.postimg.cc/DzHzSQKb/7d278b792931174dbf37cab18d85a07e.jpg',
    'https://i.postimg.cc/FK8KYbQc/843dcb73542f74f16994db9650209951.jpg',
    'https://i.postimg.cc/B6FnH8q7/9026554bd7f49e16b746e3ea200a549a.jpg',
    'https://i.postimg.cc/fbpbV7h6/a58ad1524a1cee76b6cd72bef2a3bb85.jpg',
    'https://i.postimg.cc/q7S7Ncd1/a7968000b934139a2948bfdbaee19e79.jpg',
    'https://i.postimg.cc/mkG2wbkZ/b2231fbb2dd36b503840357728c4b711.jpg',
    'https://i.postimg.cc/XJ5YdZVD/b2896a47d4c8c1670e9b3568c6cb414e.jpg',
    'https://i.postimg.cc/Ss9xCXSk/b7a521038717a2067572c551d70ca7a6.jpg',
    'https://i.postimg.cc/R0y0W1zH/ba4ccc22c556be2c4913aefdc2c14d25.jpg',
    'https://i.postimg.cc/VNpNJ9cq/c7857066d7611caf76ba079752846513.jpg',
    'https://i.postimg.cc/8Cj5kKxb/c9857d5bddfdbcf38ee337b247354822.jpg',
    'https://i.postimg.cc/s2vXf6b4/cbd878cb6f563f8b1e8953e9b898a10e.jpg',
    'https://i.postimg.cc/1z2z80Zw/d2a2d3007e87486cfb9342c1b1c6f07e.jpg',
    'https://i.postimg.cc/yNtNDhzQ/d44e606ea14c63dfa029ab91d53fd935.jpg',
    'https://i.postimg.cc/PJkr4tJx/e13b0eca83c26efde6a8a11ac7dafdd4.jpg',
    'https://i.postimg.cc/s2vXf6bm/e161014f6e4211eabb1505e9d319902f.jpg',
    'https://i.postimg.cc/CKXKRCVN/eded0df4f71b6e3f712f97345778552d.jpg',
    'https://i.postimg.cc/1tF3wgmf/ee5873fa64d737f8b300e39bf75ce469.jpg',
    'https://i.postimg.cc/Pq9qCbkF/f0839a193c3dfaada59e25bc92fe10e1.jpg',
    'https://i.postimg.cc/mD9gCcLh/f7359223be55d85641f2cb7469ded1a2.jpg',
    'https://i.postimg.cc/qqdMLkqJ/f8460a06945077ca0342819efc4b0897.jpg'
];

const AUDIOS = [
    'https://files.catbox.moe/2t3dxz.m4a',
    'https://files.catbox.moe/ofq35x.m4a',
    'https://files.catbox.moe/79l190.m4a',
    'https://files.catbox.moe/fy77hg.mp3',
    'https://files.catbox.moe/cxtuxn.mp3',
    'https://files.catbox.moe/vhpcmw.mp3',
    'https://files.catbox.moe/vzi6xc.mp3',
    'https://files.catbox.moe/g2g30o.mp3',
    'https://files.catbox.moe/dk4vcn.mp3',
    'https://files.catbox.moe/icflub.mp3',
    'https://files.catbox.moe/iqgv5u.m4a',
    'https://files.catbox.moe/oq59gm.m4a',
    'https://files.catbox.moe/794vrl.m4a',
    'https://files.catbox.moe/q6usig.m4a',
    'https://files.catbox.moe/avupxm.mp3',
    'https://files.catbox.moe/lcn6yw.mp3',
    'https://files.catbox.moe/v4tjlu.m4a',
    'https://files.catbox.moe/w3fzy7.m4a'
];

// ─── اختيار عشوائي ───
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

let handler = async (m, { conn }) => {
    const imageUrl = pickRandom(IMAGES);
    const audioUrl = pickRandom(AUDIOS);

    const tmpDir = '/data/data/com.termux/files/home/SALEVER/BOT/tmp';
    const imagePath = resolve(tmpDir, `q_${Date.now()}.jpg`);
    const audioPath = resolve(tmpDir, `q_${Date.now()}_audio.mp3`);

    try {
        // ─── تحميل الصورة ───
        const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });
        writeFileSync(imagePath, Buffer.from(imgRes.data));

        // ─── تحميل الصوت ───
        const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 15000 });
        writeFileSync(audioPath, Buffer.from(audioRes.data));

        // ─── إرسال الصورة مع الصوت كـ caption (أو document) ───
        // الطريقة 1: صورة + صوت voice note في رسالة واحدة (contextInfo)
        await conn.sendMessage(m.chat, {
            image: { url: imagePath },
            caption: `𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿`,
            contextInfo: {
                externalAdReply: {
                    title: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
                    body: 'Wake up, slaves!',
                    mediaType: 2,  // audio
                    mediaUrl: audioUrl,
                    thumbnailUrl: imageUrl,
                    sourceUrl: audioUrl
                }
            }
        });

        // ─── إرسال الصوت كـ voice note منفصل (أو ممكن ندمجه) ───
        await conn.sendMessage(m.chat, {
            audio: { url: audioPath },
            mimetype: 'audio/mpeg',
            ptt: true  // voice note
        });

        // ─── تنظيف الملفات ───
        try {
            unlinkSync(imagePath);
            unlinkSync(audioPath);
        } catch (e) {}

    } catch (error) {
        console.error('Q error:', error);
        m.reply('❌ ~ فشل في جلب الصورة أو الصوت');
    }
};

handler.command = ['ق'];
handler.desc = 'صورة + صوت عشوائي';

export default handler;
