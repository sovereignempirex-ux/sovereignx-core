import sharp from "sharp";
import fs from "fs";
import path from "path";

const tmpDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

/* ========== Create Moving X Animation ========== */
const createMovingX = async (label = "𝑺𝒂𝒍𝒆𝒗𝒆𝒓", size = 720) => {
  const frames = Array.from({ length: 8 }, (_, index) => {
    const angle = index % 2 === 0 ? -10 : 10;
    const glowColor = index % 2 === 0 ? "#ff3b81" : "#35e0ff";
    const bgColor = "#080b18";
    
    return `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <circle cx="${size / 2}" cy="${size / 2 + 10}" r="${size / 2.8}" fill="none" stroke="#202b4d" stroke-width="2"/>
        <g transform="rotate(${angle} ${size / 2} ${size / 2 - 10})">
          <path d="M${size * 0.26} ${size * 0.23} L${size * 0.44} ${size * 0.23} L${size * 0.66} ${size * 0.77} L${size * 0.53} ${size * 0.77} Z" fill="${glowColor}"/>
          <path d="M${size * 0.66} ${size * 0.23} L${size * 0.53} ${size * 0.23} L${size * 0.26} ${size * 0.77} L${size * 0.44} ${size * 0.77} Z" fill="#f4f7ff"/>
        </g>
        <text x="${size / 2}" y="${size * 0.82}" text-anchor="middle" fill="#f4f7ff" font-family="Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="5">${label}</text>
        <text x="${size / 2}" y="${size * 0.87}" text-anchor="middle" fill="#8491b5" font-family="Arial, sans-serif" font-size="16" letter-spacing="3">𝑺𝒂𝒍𝒆𝒗𝒆𝒓</text>
      </svg>
    `;
  });

  const rendered = await Promise.all(frames.map((frame) => 
    sharp(Buffer.from(frame))
      .png()
      .toBuffer()
  ));

  const combined = sharp(Buffer.concat(rendered), {
    pageHeight: size,
    pages: rendered.length
  })
    .webp({
      effort: 4,
      loop: 0,
      delay: 120
    })
    .toBuffer();

  return combined;
};

/* ========== Create X Logo (Static) ========== */
const createXLogo = async (text = "X") => {
  const size = 200;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0d1117"/>
      <path d="M${size * 0.1} ${size * 0.9} L${size * 0.9} ${size * 0.1}" stroke="#ff3b81" stroke-width="${size * 0.04}" fill="none"/>
      <path d="M${size * 0.9} ${size * 0.9} L${size * 0.1} ${size * 0.1}" stroke="#35e0ff" stroke-width="${size * 0.04}" fill="none"/>
      <text x="${size / 2}" y="${size * 0.55}" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="${size * 0.25}" font-weight="bold">${text}</text>
    </svg>
  `;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer();
};

/* ========== Handler for Logo Commands ========== */
let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`مثال: .${command} vente 🌿`);

  try {
    const image = await createMovingX(text.trim());
    await conn.sendMessage(m.chat, {
      image,
      mimetype: "image/webp",
      caption: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 | ${text.trim()} ✨`,
    }, { quoted: global.reply_status });
  } catch (error) {
    try {
      const logo = await createXLogo(text.trim());
      await conn.sendMessage(m.chat, {
        image: logo,
        mimetype: "image/png",
        caption: `𝑺𝒶𝓁𝑒𝓋𝑒𝓇 | ${text.trim()} ✨`,
      }, { quoted: global.reply_status });
    } catch (fallbackError) {
      m.reply(`تعذر إنشاء الشعار 🌿\n${fallbackError.message}`);
    }
  }
};

/* ========== Available Logo Themes ========== */
const logos = [
  "عميق",
  "رعب",
  "بينك",
  "حلوى",
  "كريسماس",
  "فاخر",
  "سماء",
  "حديد",
  "صمغ",
  "قماش",
  "ترانسفورمر",
  "سام",
  "قديم",
  "رعد",
  "قوسقزح",
  "نيون",
  "ثلج",
  "لوجو_ناروتو",
  "لوجو_بوكيمون",
  "لوجو_اكس",
  "منقوش",
];

handler.command = logos;
handler.category = "logos";
handler.usage = logos;

export default handler;