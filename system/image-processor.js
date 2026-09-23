/* ========== Unified Image Processor ========== */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

/**
 * Create a moving X animation (like the 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 logo)
 * @param {string} text - Text to display inside the X
 * @param {number} size - Canvas size (default 720)
 * @returns {Promise<Buffer>} - Animated WebP buffer
 */
export const createMovingX = async (text = '𝑺𝒂𝒍𝒆𝒗𝒆𝒓', size = 720) => {
  const frames = Array.from({ length: 8 }, (_, index) => {
    const angle = index % 2 === 0 ? -10 : 10;
    const glowColor = index % 2 === 0 ? '#ff3b81' : '#35e0ff';
    const bgColor = '#080b18';
    
    return `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <circle cx="${size / 2}" cy="${size / 2 + 10}" r="${size / 2.8}" fill="none" stroke="#202b4d" stroke-width="2"/>
        <g transform="rotate(${angle} ${size / 2} ${size / 2 - 10})">
          <path d="M${size * 0.26} ${size * 0.23} L${size * 0.44} ${size * 0.23} L${size * 0.66} ${size * 0.77} L${size * 0.53} ${size * 0.77} Z" fill="${glowColor}"/>
          <path d="M${size * 0.66} ${size * 0.23} L${size * 0.53} ${size * 0.23} L${size * 0.26} ${size * 0.77} L${size * 0.44} ${size * 0.77} Z" fill="#f4f7ff"/>
        </g>
        <text x="${size / 2}" y="${size * 0.82}" text-anchor="middle" fill="#f4f7ff" font-family="Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="5">${text}</text>
        <text x="${size / 2}" y="${size * 0.87}" text-anchor="middle" fill="#8491b5" font-family="Arial, sans-serif" font-size="16" letter-spacing="3">MOVING X</text>
      </svg>
    `;
  });

  // Render all frames as PNG buffers
  const rendered = await Promise.all(frames.map((frame) => 
    sharp(Buffer.from(frame))
      .png()
      .toBuffer()
  ));

  // Combine into animated WebP with looping
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

/**
 * Process an image with various operations
 * @param {Buffer} buffer - Input image buffer
 * @param {Object} options - Processing options
 * @param {string} options.type - Operation type (resize, blur, sharpen, etc.)
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {number} options.quality - Output quality (1-100)
 * @returns {Promise<Buffer>} - Processed image buffer
 */
export const processImage = async (buffer, options = {}) => {
  const { type = 'resize', width, height, quality = 80 } = options;
  
  let processing = sharp(buffer);

  switch (type) {
    case 'resize':
      processing = processing.resize(width, height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      });
      break;
    case 'blur':
      processing = processing.blur(Math.max(0, width || 10));
      break;
    case 'sharpen':
      processing = processing.sharpen();
      break;
    case 'circle':
      processing = processing
        .extract({ width: Math.min(width || 500, height || 500) })
        .resize(width || 500, height || 500, { fit: sharp.fit.cover })
        .composite([
          {
            input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="250" fill="white"/></svg>`),
            blend: 'dest-in'
          }
        ]);
      break;
    default:
      processing = processing.resize(width, height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      });
  }

  return processing.toBuffer();
};

/**
 * Create a sticker from buffer using internal processing
 * @param {Buffer} buffer - Input image/sticker buffer
 * @param {Object} options - Sticker options
 * @param {string} options.pack - Sticker pack name
 * @param {string} options.author - Sticker author
 * @param {string} options.emoji - Sticker emoji (optional)
 * @returns {Promise<Buffer>} - Sticker buffer
 */
export const createSticker = async (buffer, options = {}) => {
  const { pack = '𝑺𝒂𝒍𝒆𝒗𝒆𝒓', author = '𝑺𝒂𝒍𝒆𝒗𝒆𝒓', emoji = '🅇' } = options;
  
  // Use sharp to process and create the sticker internally
  const processed = await processImage(buffer, {
    type: 'resize',
    width: 512,
    height: 512,
    quality: 90
  });

  // Create the sticker using sharp's embed options
  const output = sharp(processed)
    .png()
    .embed({
      pack: pack,
      author: author,
      emoji: emoji
    })
    .toBuffer();

  return output;
};

/**
 * Export the moving X as a static asset for use in messages
 * @returns {Promise<Buffer>} - Moving X animation buffer
 */
export const getMovingXAsset = async () => {
  return await createMovingX('𝑺𝒂𝒍𝒆𝒗𝒆𝒓');
};

/**
 * Generate a solid X logo for buttons/icons
 * @param {string} text - Text to display
 * @returns {Promise<Buffer>} - X logo buffer
 */
export const createXLogo = async (text = 'X') => {
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