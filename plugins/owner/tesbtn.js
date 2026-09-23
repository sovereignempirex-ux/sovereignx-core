/* ========== Tes NativeFlow Buttons - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import sharp from 'sharp';
import { getXAsset } from "../../system/utils.js";

const FOOTER = "𝑺𝒂𝒍𝒆𝒗𝒆𝒓";

const LOCATION_IMAGE_URL =
  'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg';

const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K';
const SUPPORT_URL = CHANNEL_URL;

// ============================================================
// BUILD MAIN SELECT
// ============================================================

function buildMainSelect(prefix) {
  return JSON.stringify({
    title: '\u0000',
    sections: [
      {
        title: FOOTER,
        highlight_label: 'MENU UTAMA',
        rows: [
          { title: 'All Menu', id: `${prefix}menu` },
          { title: 'Ping / Status', id: `${prefix}ping` },
          { title: 'Total Fitur', id: `${prefix}totalfitur` },
          { title: 'Owner', id: `${prefix}owner` }
        ]
      },
      {
        highlight_label: 'TOOLS',
        rows: [
          { title: 'Sticker', id: `${prefix}stiker` },
          { title: 'To Image', id: `${prefix}toimg` },
          { title: 'To MP3', id: `${prefix}tomp3` },
          { title: 'RVO', id: `${prefix}rvo` },
          { title: 'Brat', id: `${prefix}brat` },
          { title: 'Run JSON', id: `${prefix}runjson` }
        ]
      },
      {
        highlight_label: 'GROUP',
        rows: [
          { title: 'Hidetag', id: `${prefix}hidetag` },
          { title: 'Link Grup', id: `${prefix}linkgrup` },
          { title: 'List Admin', id: `${prefix}listadmin` },
          { title: 'Group Info', id: `${prefix}groupinfo` }
        ]
      },
      {
        highlight_label: 'OWNER',
        rows: [
          { title: 'Reload', id: `${prefix}reload` },
          { title: 'Backup', id: `${prefix}backup` },
          { title: 'Get Plugin', id: `${prefix}getplugin` },
          { title: 'IJSON', id: `${prefix}ijson` },
          { title: 'Public', id: `${prefix}public` }
        ]
      }
    ],
    icon: 'DEFAULT'
  })
}

// ============================================================
// BUILD INFO SELECT
// ============================================================

function buildInfoSelect(prefix) {
  return JSON.stringify({
    title: '\u0000',
    sections: [
      {
        title: FOOTER,
        highlight_label: 'INFORMASI',
        rows: [
          { title: 'Menu', id: `${prefix}menu` },
          { title: 'Owner', id: `${prefix}owner` },
          { title: 'Ping', id: `${prefix}ping` },
          { title: 'Level', id: `${prefix}level` },
          { title: 'Me', id: `${prefix}me` }
        ]
      }
    ],
    icon: 'REVIEW'
  })
}

// ============================================================
// BUILD CTA URL
// ============================================================

function buildCtaUrl() {
  return JSON.stringify({
    display_text: '\u0000',
    url: CHANNEL_URL,
    merchant_url: CHANNEL_URL,
    icon: 'PROMOTION'
  })
}

// ============================================================
// BUILD MESSAGE PARAMS
// ============================================================

function buildMessageParams() {
  return JSON.stringify({
    limited_time_offer: {
      text: `${FOOTER} Support`,
      url: SUPPORT_URL,
      copy_code: `Created by svcp`,
      expiration_time: Date.now() + 60 * 60 * 1000
    }
  })
}

// ============================================================
// BUILD NATIVE BUTTONS
// ============================================================

function buildNativeButtons(prefix) {
  return [
    { name: '' },
    {
      name: 'single_select',
      buttonParamsJson: buildMainSelect(prefix)
    },
    {
      name: 'single_select',
      buttonParamsJson: buildInfoSelect(prefix)
    },
    {
      name: 'cta_url',
      buttonParamsJson: buildCtaUrl()
    }
  ]
}

// ============================================================
// BUILD FAKE CATALOG QUOTE
// ============================================================

function buildFakeCatalogQuote(thumbnailBytes) {
  const productId = '915302051'

  const product = {
    productId,
    title: FOOTER,
    description: `svcp • Menu Bot`,
    retailerId: productId,
    url: CHANNEL_URL,
    productImageCount: 1
  }

  const productMessage = {
    product,
    businessOwnerJid: '0@s.whatsapp.net'
  }

  if (thumbnailBytes?.length) {
    const thumb = Buffer.isBuffer(thumbnailBytes)
      ? thumbnailBytes
      : Buffer.from(thumbnailBytes)

    productMessage.product.productImage = {
      mimetype: 'image/jpeg',
      jpegThumbnail: thumb
    }
  }

  return {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      id: `SALEVER-CATALOG-${Date.now()}`
    },
    message: {
      productMessage
    }
  }
}

// ============================================================
// BUILD LOCATION HEADER (Sharp 300x300 JPEG)
// ============================================================

async function buildLocationHeader() {
  try {
    const response = await fetch(LOCATION_IMAGE_URL, {
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    if (!imageBuffer.length) {
      throw new Error('Buffer kosong')
    }

    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toBuffer()

    if (!thumbnailBuffer.length) {
      throw new Error('Thumbnail hasil Sharp kosong')
    }

    const thumbnailBase64 = thumbnailBuffer.toString('base64')

    const locationMessage = {
      degreesLatitude: -6.2088,
      degreesLongitude: 106.8456,
      name: FOOTER,
      address: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Location',
      jpegThumbnail: thumbnailBuffer
    }

    return {
      header: {
        hasMediaAttachment: true,
        locationMessage
      },
      thumb: thumbnailBuffer,
      thumbnailBase64
    }
  } catch (err) {
    console.log('[tesbtn] Location header error:', err?.message || err)
    return { header: null, thumb: null, thumbnailBase64: '' }
  }
}

// ============================================================
// BUILD CONTEXT INFO WITH ORDER MESSAGE THUMBNAIL
// ============================================================

function buildThumbnailContextInfo(event, thumbnailBase64) {
  if (!thumbnailBase64) {
    return {
      forwardingScore: 99,
      isForwarded: true
    }
  }

  const eventKey = event?.key || {}

  return {
    forwardingScore: 99,
    isForwarded: true,
    mentionedJid: [],
    groupMentions: [],
    statusAttributions: [],
    stanzaId: eventKey.id || '',
    participant: eventKey.participant || event?.participant || '0@s.whatsapp.net',
    quotedMessage: {
      orderMessage: {
        thumbnail: thumbnailBase64,
        itemCount: 1,
        message: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Location Header'
      }
    },
    remoteJid: eventKey.remoteJid || '0@s.whatsapp.net'
  }
}

// ============================================================
// COMMAND EXPORT
// ============================================================

const test = async (m, { conn, usedPrefix, isOwner }) => {
  if (!isOwner) {
    return m.reply('🅇 Cuma owner.')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🧪', key: m.key } }).catch(() => {})

    // ========================================================
    // PESAN 1: NATIVE FLOW PLAIN
    // ========================================================

    const msg1 = {
      body: { text: '\u0000' },
      footer: { text: FOOTER },
      nativeFlowMessage: {
        buttons: buildNativeButtons(usedPrefix),
        messageParamsJson: buildMessageParams(),
        messageVersion: 1
      },
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true
      }
    }

    await conn.sendMessage(m.chat, { interactiveMessage: msg1 }, {
      additionalAttributes: { type: 'text' },
      quote: m,
      forward: { score: 99 }
    })

    // ========================================================
    // PESAN 2: CATALOG QUOTE (dengan thumbnail X)
    // ========================================================

    const xAsset = await getXAsset().catch(() => null)
    
    const msg2 = {
      body: { text: '\u0000' },
      footer: { text: FOOTER },
      nativeFlowMessage: {
        buttons: buildNativeButtons(usedPrefix),
        messageParamsJson: buildMessageParams(),
        messageVersion: 1
      },
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true
      }
    }

    await conn.sendMessage(m.chat, { interactiveMessage: msg2 }, {
      additionalAttributes: { type: 'text' },
      quote: buildFakeCatalogQuote(xAsset),
      forward: { score: 99 }
    })

    // ========================================================
    // PESAN 3: LOCATION HEADER + CATALOG QUOTE
    // ========================================================

    const { header: locationHeader, thumb: locationThumb, thumbnailBase64 } = await buildLocationHeader()

    const msg3 = {
      body: { text: '\u0000' },
      footer: { text: FOOTER },
      nativeFlowMessage: {
        buttons: buildNativeButtons(usedPrefix),
        messageParamsJson: buildMessageParams(),
        messageVersion: 1
      },
      contextInfo: buildThumbnailContextInfo(m, thumbnailBase64)
    }

    if (locationHeader) {
      msg3.header = locationHeader
    }

    await conn.sendMessage(m.chat, { interactiveMessage: msg3 }, {
      additionalAttributes: { type: 'text' },
      quote: buildFakeCatalogQuote(locationThumb),
      forward: { score: 99 }
    })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})

  } catch (err) {
    console.error('[tesbtn]', err)
    await m.reply(`🅇 ${String(err?.message || err).slice(0, 220)}`)
  }
}

test.usage = ["tesbtn", "testbtn", "btnnoxm"];
test.command = ["tesbtn", "testbtn", "btnnoxm", "tesbtnflow"];
test.category = "owner";
export default test;