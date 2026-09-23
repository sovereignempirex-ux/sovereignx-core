/* ========== System Utilities (Internal) ========== */
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from 'form-data';
import { fileTypeFromBuffer } from "file-type";

// Internal image processor module cache
let imageProcessorModule = null;

/* ========== Initialize Image Processor ========== */
export const initImageProcessor = async () => {
  if (!imageProcessorModule) {
    imageProcessorModule = await import('./image-processor.js');
  }
  return imageProcessorModule;
};

/* ========== Create Sticker (Internal) ======== */

const createSticker = async (buffer, options = {}) => {
  const proc = initImageProcessor();
  const { pack, author, emoji } = options;
  
  // Use internal sharp-based sticker creation
  const processed = await proc.processImage(buffer, {
    type: 'resize',
    width: 512,
    height: 512,
    quality: 90
  });
  
  // Create sticker with embedded metadata
  const output = sharp(processed)
    .png()
    .embed({
      pack: pack || '𝑺𝒂𝒍𝒆𝒗𝒆𝒓',
      author: author || '𝑺𝒂𝒍𝒆𝒗𝒆𝒓',
      emoji: emoji || '🅇'
    })
    .toBuffer();
  
  return output;
};

/* ========== GIF TO MP4 ========= */

async function gifToMp4(url) {
  const id = Date.now();
  const gifPath = path.join(tmp, `${id}.gif`);
  const mp4Path = path.join(tmp, `${id}.mp4`);
  
  const writer = fs.createWriteStream(gifPath);
  const res = await axios({ url, responseType: 'stream' });
  res.data.pipe(writer);
  await new Promise(r => writer.on('finish', r));
  
  await execAsync(`ffmpeg -i "${gifPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p "${mp4Path}"`);
  
  const buffer = fs.readFileSync(mp4Path);
  fs.unlinkSync(gifPath);
  fs.unlinkSync(mp4Path);
  
  return buffer;
}

/* ========== X Asset Helper ========= */

const getXAsset = async () => {
  const procModule = await initImageProcessor();
  const { createMovingXAsset } = procModule;
  return await createMovingXAsset();
};

/* ========== Calm Response Helper ========== */
const getCalmResponse = async (type) => {
  try {
    const { getCalmResponse: getResp } = await import('./config.js');
    return getResp(type);
  } catch (e) {
    const fallbacks = {
      error: "حدث خطأ بسيط 🌿\nجرّب مرة تانية لو سمحت",
      permission: "الأمر ده للمطورين بس 🌿",
      cooldown: "استنى شوية 🌿\nالبوت بياخد راحته",
      notFound: "الأمر ده مش موجود 🌿\nاكتب .الاوامر تشوف المتاح",
      thinking: "لحظة من فضلك... ✨"
    };
    return fallbacks[type] || "حصل خطأ بسيط 🌿";
  }
};

/* ========== CatBox =========== */

async function uploadToCatbox(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });

  const { data } = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
  if (!data?.includes('catbox')) throw new Error('upload failed');
  return data.trim();
}

/* ========== AI =========== */

async function AiChat(options = {}) {
  const url = `https://text.pollinations.ai/${options.text}?model=${options.model || "openai"}`;
  return (await fetch(url)).text();
}

/* ========== Qu.ax Upload =========== */

const extractFromHtml = (html, baseUrl) => {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  const selectors = [
    'meta[property="og:image"]', 'meta[property="og:video"]', 'meta[property="og:audio"]',
    'meta[name="twitter:image"]', 'meta[name="twitter:player"]', 'meta[name="twitter:video"]',
    'link[rel="image_src"]', 'link[rel="video_src"]', 'video source', 'audio source', 'img'
  ];
  
  for (const selector of selectors) {
    let url = $(selector).attr('content') || $(selector).attr('src') || $(selector).attr('href');
    if (url && !url.includes('base64') && !url.startsWith('data:')) {
      if (!url.startsWith('http')) {
        try { url = new URL(url, baseUrl).href; } catch(e) { continue; }
      }
      if (url.match(/\.(jpg|jpeg|png|gif|webp|mp4|mkv|webm|mov|mp3|wav|ogg|m4a|flac)(\?|$)/i)) return url;
    }
  }
  return null;
};

const uploadToQuax = async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('files[]', buffer, { filename: `tmp.${ext}`, contentType: mime });
  const { data } = await axios.post('https://qu.ax/upload.php', form, { headers: form.getHeaders() });
  
  let mediaUrl = typeof data === 'string' ? extractFromHtml(data, 'https://qu.ax') : data.files?.[0]?.url;
  if (!mediaUrl) throw new Error('Upload failed');
  if (mediaUrl.includes('/x/')) return mediaUrl;
  
  const { data: pageHtml } = await axios.get(mediaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return extractFromHtml(pageHtml, mediaUrl) || mediaUrl;
};

/* ========== Termai.cc Upload =========== */

async function uploadTmpfiles(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('file', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await axios.post("https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk", form, {
        headers: form.getHeaders(),
        timeout: 30000
    });

    if (!res.data?.status || !res.data?.path) throw new Error("Upload failed: " + JSON.stringify(res.data));
    return res.data.path;
}

/* ========== Exports ========== */
export { 
  uploadToCatbox, 
  uploadToQuax, 
  uploadTmpfiles, 
  createSticker, 
  AiChat, 
  gifToMp4,
  getXAsset,
  getCalmResponse
};