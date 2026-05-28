import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
  let watermark = '𝑴𝒆𝒅𝒐';
  let projectDir = `${process.env.HOME}/sovereignx-core`;
  let serverFile = `${projectDir}/server.js`;
  let ngrokLog = '/tmp/ngrok-sovereignx.log';
  let pidFile = '/tmp/sovereignx-server.pid';

  // ─── التحقق من وجود المشروع ───
  if (!fs.existsSync(serverFile)) {
    return conn.sendMessage(m.chat, {
      text: `❌ ┃ ملف السيرفر مش موجود!\nالمسار: ${serverFile}`,
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

  let loadingMsg = await conn.sendMessage(m.chat, {
    text: `⏳ *جـاري تـشـغـيـل الـصـفـحـة...*\n\n🖥️ السيرفر: ${projectDir}\n🌐 ngrok: جاري التحميل...`,
    contextInfo: {
      externalAdReply: {
        title: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
        body: '𝑴𝒆𝒅𝒐 ~ 𝑻𝒉𝒆 𝑲𝒊𝒏𝒈 👑',
        thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029VbDCNPF1yT2DEJ557V0H',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  try {
    // ═══════════════════════════════════════
    //  1) قتل العمليات القديمة
    // ═══════════════════════════════════════
    try {
      if (fs.existsSync(pidFile)) {
        let oldPid = fs.readFileSync(pidFile, 'utf8').trim();
        execSync(`kill ${oldPid} 2>/dev/null; kill $(lsof -t -i:3000) 2>/dev/null; pkill -f "ngrok http 3000" 2>/dev/null`, { timeout: 5000 });
      }
    } catch (e) {}

    // ═══════════════════════════════════════
    //  2) تشغيل السيرفر
    // ═══════════════════════════════════════
    let serverProcess = spawn('node', [serverFile], {
      cwd: projectDir,
      detached: true,
      stdio: 'ignore'
    });
    serverProcess.unref();

    fs.writeFileSync(pidFile, serverProcess.pid.toString());

    await new Promise(r => setTimeout(r, 3000));

    // ═══════════════════════════════════════
    //  3) تشغيل ngrok
    // ═══════════════════════════════════════
    let ngrokProcess = spawn('ngrok', ['http', '3000', '--log=stdout'], {
      detached: true,
      stdio: ['ignore', fs.openSync(ngrokLog, 'w'), fs.openSync(ngrokLog, 'a')]
    });
    ngrokProcess.unref();

    await new Promise(r => setTimeout(r, 6000));

    // ═══════════════════════════════════════
    //  4) استخراج الرابط
    // ═══════════════════════════════════════
    let publicUrl = '';
    let logContent = '';

    try {
      logContent = fs.readFileSync(ngrokLog, 'utf8');
      let match = logContent.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);
      if (match) publicUrl = match[0];
    } catch (e) {}

    // محاولة API
    if (!publicUrl) {
      try {
        let apiRes = await fetch('http://localhost:4040/api/tunnels');
        let apiJson = await apiRes.json();
        publicUrl = apiJson.tunnels?.[0]?.public_url || '';
      } catch (e) {}
    }

    // ═══════════════════════════════════════
    //  5) إرسال النتيجة
    // ═══════════════════════════════════════
    if (publicUrl) {
      // حفظ الرابط
      fs.writeFileSync(`${projectDir}/.last-url`, publicUrl);

      let caption = `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                    `║   ✅ *تـم تـشـغـيـل الـصـفـحـة*   ║\n` +
                    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                    `┏━❋━◈━❋━┓\n` +
                    `┃ 🌐 *الرابط:*\n┃ ${publicUrl}\n` +
                    `┃ 🖥️ *المنفذ:* 3000\n` +
                    `┃ 📁 *المسار:* ~/sovereignx-core\n` +
                    `┗━❋━◈━❋━┛\n\n` +
                    `*🎮 الألعاب المتاحة:*\n` +
                    `• ⭕ ❌ XO (تيك تاك تو)\n` +
                    `• ♟️ شطرنج\n\n` +
                    `*📝 ملاحظة:*\n` +
                    `الرابط صالح طالما السيرفر شغال.\n` +
                    `للإيقاف: .ايقاف_صفحه\n\n` +
                    `┏━❋━◈━❋━┓\n` +
                    `┃  𝑴𝒆𝒅𝒐  ┃\n` +
                    `┗━❋━◈━❋━┛`;

      await conn.sendMessage(m.chat, { delete: loadingMsg.key });

      await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: `120363409440454416@newsletter`,
            newsletterName: `𝑴𝒆𝒅𝒐`,
            serverMessageId: 0
          },
          externalAdReply: {
            title: `🌐 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿 ~ 𝑨𝒓𝒆𝒏𝒂`,
            body: `𝑪𝒍𝒊𝒄𝒌 𝒕𝒐 𝑶𝒑𝒆𝒏`,
            thumbnailUrl: `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`,
            sourceUrl: publicUrl,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    } else {
      throw new Error('Failed to get ngrok URL');
    }

  } catch (e) {
    console.error('Page start error:', e);
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
    return conn.sendMessage(m.chat, {
      text: `❌ ┃ فـشـل تـشـغـيـل الـصـفـحـة.\n\n*السبب:* ${e.message}\n\n*جرب يدوياً:*\n\`\`\`cd ~/sovereignx-core && node server.js &\nngrok http 3000\`\`\``,
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

handler.command = /^(صفحه|صفحة|page|arena|start)$/i;
handler.tags = ['tools'];
handler.help = ['.صفحه'];

export default handler;
