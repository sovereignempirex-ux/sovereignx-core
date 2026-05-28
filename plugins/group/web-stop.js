import { execSync } from 'child_process';
import fs from 'fs';

let handler = async (m, { conn }) => {
  let watermark = '𝑴𝒆𝒅𝒐';
  let pidFile = '/tmp/sovereignx-server.pid';

  try {
    // قتل العمليات
    execSync('pkill -f "node server.js" 2>/dev/null; pkill -f "ngrok http 3000" 2>/dev/null', { timeout: 5000 });
    
    if (fs.existsSync(pidFile)) {
      let pid = fs.readFileSync(pidFile, 'utf8').trim();
      try { execSync(`kill ${pid} 2>/dev/null`); } catch(e) {}
      fs.unlinkSync(pidFile);
    }

    return conn.sendMessage(m.chat, {
      text: `🛑 *تـم إيـقـاف الـصـفـحـة*\n\nالسيرفر و ngrok تم إيقافهم.`,
      contextInfo: {
        externalAdReply: {
          title: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
          body: watermark,
          thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *حـصـل خـطـأ فـي الإيـقـاف*\nجرب يدوياً:\n\`\`\`pkill -f 'node server.js' && pkill -f 'ngrok'\`\`\``,
      contextInfo: {
        externalAdReply: {
          title: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
          body: watermark,
          thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }
};

handler.command = /^(ايقاف_صفحه|ايقاف_صفحة|stop|killpage)$/i;
handler.tags = ['tools'];
handler.help = ['.ايقاف_صفحه'];

export default handler;
