import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';

// ─── قوائم الروابط ───
const IMAGES = [
    'https://i.postimg.cc/2jZyc4y9/01939d8542b48fae307f24c1307b77bc.jpg',
    'https://i.postimg.cc/pT9rtjZV/041a5ea1ede9652ef793870b378820e3.jpg',
    'https://i.postimg.cc/cCwJvN2b/04b81773fb5f08b61f5fdf63edd729c1.jpg',
    'https://i.postimg.cc/50Z09t7m/070f3882be6af76fdf0e92b2d780a656.jpg',
    'https://i.postimg.cc/KYpjVftg/086a994a17a3eb3a39233d85e965dc97.jpg',
    'https://i.postimg.cc/RCHhschn/0c97e8e17752c745b1ea017e658a6302.jpg',
    'https://i.postimg.cc/MG3H4515/1023cc957def21127071a072d5f7b533.jpg',
    'https://i.postimg.cc/HLvnKzbQ/113191f1ed2090c252cdb45870dd8dcc.jpg',
    'https://i.postimg.cc/rmvmypn5/13e4dc37c8920adccea94e4ec58132b9.jpg',
    'https://i.postimg.cc/HLvnKzb8/148ad70be59878867f5face92e452319.jpg',
    'https://i.postimg.cc/NMWMG0JY/1f76b98928987324c58cbf317315c144.jpg',
    'https://i.postimg.cc/jj329cy8/23dbd2b1043d25945ef6a80e52255c60.jpg',
    'https://i.postimg.cc/mD0DZrXP/240e24e946c8c7156437427cb14fa2cf.jpg',
    'https://i.postimg.cc/C5kKRVX8/243878721f9231451c3e50d7d9a1fc90.jpg',
    'https://i.postimg.cc/d0N3X6Gy/2561f61782b4b4bc24cb9d4b994d7bac.jpg',
    'https://i.postimg.cc/4yV3YTjR/2859c139410440c5e46086532ff12d15.jpg',
    'https://i.postimg.cc/CLp1Wzfg/2868fb7f2f9219b06aa8146784c95d8b.jpg',
    'https://i.postimg.cc/ZR1RYq7F/2e15ab9548676c4e77b01012c2e8b937.jpg',
    'https://i.postimg.cc/VsCvGjvG/30798b50d4ca9c4dec077f44720d3400.jpg',
    'https://i.postimg.cc/65x3DyG6/31d11af887e1def54512d6de434c901b.jpg',
    'https://i.postimg.cc/8Pg5qjfx/31f784b0f0e9b9844e089f5fa0187716.jpg',
    'https://i.postimg.cc/k4VGdScm/38b0b1f3578376de870654d66077879e.jpg',
    'https://i.postimg.cc/ZYdn7rn6/3e735026ae34d69aea848f8289b075b7.jpg',
    'https://i.postimg.cc/DfX0jq0m/45df77012b41e4758068159b2417996f.jpg',
    'https://i.postimg.cc/c47HZ0Qy/47ab3f2b2808ae7a15dd3152b3015e76.jpg',
    'https://i.postimg.cc/tCGTLYV0/4ac6778db233d1194c54f18f822f9b51.jpg',
    'https://i.postimg.cc/QtBCr7q4/4cfd5923f337aeabec3234b3b9af2c20.jpg',
    'https://i.postimg.cc/ZnpqWh2c/4e29d47c761196db1b056c1560c47168.jpg',
    'https://i.postimg.cc/W3DzPZnb/520f261d12def467fe5b4113f749f875.jpg',
    'https://i.postimg.cc/T2D17r1b/54bb88dec6f98ccd6347b1adbfca2624.jpg',
    'https://i.postimg.cc/jq72gz26/5b10cb4cd633ff8d972e2e6214177dd9.jpg',
    'https://i.postimg.cc/63D36Qj3/5d6aed2b477b5fc556da56e0b5d9edc9.jpg',
    'https://i.postimg.cc/gJwjPhDP/5dccfda138fdbd3ce4a0a0abdf1b2618.jpg',
    'https://i.postimg.cc/gcZjSvjj/66a912e76d4e71552568e882b5e4ac30.jpg',
    'https://i.postimg.cc/2jZyc4y4/6a74150ea04eb6daf0a72b813c3b1d54.jpg',
    'https://i.postimg.cc/RVxFjNJD/6af7a7601271dba91f0a65d372af2b48.jpg',
    'https://i.postimg.cc/gcZjSvjB/6f6b647dede6423e661dd66ec96b7e61.jpg',
    'https://i.postimg.cc/50Z09t7f/73e3e5aa18bc6e6fc027c83f6cfeecf0.jpg',
    'https://i.postimg.cc/BZKbYxbX/7d278b792931174dbf37cab18d85a07e.jpg',
    'https://i.postimg.cc/sXBxRWJT/843dcb73542f74f16994db9650209951.jpg',
    'https://i.postimg.cc/xCWCjdxH/844563a1afd194eddecf1c1487728dd8.jpg',
    'https://i.postimg.cc/ZnpqWh2s/867ca06060fa63a3bef12e3fb2914be5.jpg',
    'https://i.postimg.cc/QxZtRHKS/8b8a2d9cf64949cb313afdd8f90129b5.jpg',
    'https://i.postimg.cc/c4GHVrtX/9026554bd7f49e16b746e3ea200a549a.jpg',
    'https://i.postimg.cc/bNfJKs2v/992f7d9df263f4bd267aaf9a36b5b1a7.jpg',
    'https://i.postimg.cc/wTYvS7Rw/a58ad1524a1cee76b6cd72bef2a3bb85.jpg',
    'https://i.postimg.cc/C1Z5V8NF/a7968000b934139a2948bfdbaee19e79.jpg',
    'https://i.postimg.cc/tTLTRgSC/abe019d59a86a88b52a6257ea454269e.jpg',
    'https://i.postimg.cc/sDCXtvGk/ac40a06af4f1146c7ab4cd3148a5a241.jpg',
    'https://i.postimg.cc/sx72MRqK/b2231fbb2dd36b503840357728c4b711.jpg',
    'https://i.postimg.cc/RVxFjNJb/b2896a47d4c8c1670e9b3568c6cb414e.jpg',
    'https://i.postimg.cc/J4Cn9GBr/b7a521038717a2067572c551d70ca7a6.jpg',
    'https://i.postimg.cc/vm2Tjh5k/ba4ccc22c556be2c4913aefdc2c14d25.jpg',
    'https://i.postimg.cc/fL3yhdvG/c7857066d7611caf76ba079752846513.jpg',
    'https://i.postimg.cc/5yLtXMTg/c9857d5bddfdbcf38ee337b247354822.jpg',
    'https://i.postimg.cc/BbHvjGkr/cbd878cb6f563f8b1e8953e9b898a10e.jpg',
    'https://i.postimg.cc/fbqyFCYX/cc1d4557586ae5238e4ad1be04e966b6.jpg',
    'https://i.postimg.cc/SRCKnpH4/cf0719a170c34e764c2a6db658937db3.jpg',
    'https://i.postimg.cc/3rvNSgNp/d2a2d3007e87486cfb9342c1b1c6f07e.jpg',
    'https://i.postimg.cc/76ChyzVb/d44e606ea14c63dfa029ab91d53fd935.jpg',
    'https://i.postimg.cc/QtBCr7bt/d69851766c0e40d5db5cec26c00d81e1.jpg',
    'https://i.postimg.cc/KjBY1yCF/d91f58b508c79ce36fb79b903837310a.jpg',
    'https://i.postimg.cc/bJKJYvCd/dba1e0ccf85e054fde8f7fb3bae87b94.jpg',
    'https://i.postimg.cc/150tPsp1/e13b0eca83c26efde6a8a11ac7dafdd4.jpg',
    'https://i.postimg.cc/VNZvTgXR/e161014f6e4211eabb1505e9d319902f.jpg',
    'https://i.postimg.cc/J4Cn9GHq/e342ae8d0f4440cf40d5c409e3ab42b1.jpg',
    'https://i.postimg.cc/ydwd6NQg/ec6161a8e1b413a90d4fd68672bb21cb.jpg',
    'https://i.postimg.cc/8k6cKhcm/eded0df4f71b6e3f712f97345778552d.jpg',
    'https://i.postimg.cc/m2WD0tFg/ee5873fa64d737f8b300e39bf75ce469.jpg',
    'https://i.postimg.cc/CMq5Pj5v/f0839a193c3dfaada59e25bc92fe10e1.jpg',
    'https://i.postimg.cc/Jn9n7h6x/f7359223be55d85641f2cb7469ded1a2.jpg',
    'https://i.postimg.cc/3NmwkHVF/f8460a06945077ca0342819efc4b0897.jpg',
    'https://i.postimg.cc/3wfN612Z/fb2113d9c236b01950b585177fbd76ca.jpg'
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
    'https://files.catbox.moe/w3fzy7.m4a',
    'https://files.catbox.moe/7p0170.mp3',
    'https://files.catbox.moe/jr0b0v.aac'
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

handler.command = ['ب'];
handler.desc = 'صورة + صوت عشوائي';

export default handler;
