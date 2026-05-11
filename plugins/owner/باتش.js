import fs from 'fs'
import path from 'path'

function levenshtein(a, b) {
  if (!a.length) return b.length
  if (!b.length) return a.length

  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

function closestMatch(input, list) {
  let closest = null
  let min = Infinity

  for (const item of list) {
    const dist = levenshtein(
      input.toLowerCase(),
      item.toLowerCase()
    )

    if (dist < min && dist <= 3) {
      min = dist
      closest = item
    }
  }

  return closest
}

const handler = async (m, { conn, text }) => {

  const pluginsPath = './plugins'
  const files = fs.readdirSync(pluginsPath)
    .filter(v => v.endsWith('.js'))

  const names = files.map(v => v.replace('.js', ''))

  // لو ما كتبش اسم
  if (!text) {

    let list = names.map((v, i) =>
      `│ ${i + 1}. ${v}`
    ).join('\n')

    return conn.sendMessage(m.chat, {
      text:
`╭━━〔 📂 ملفات البوت 〕━━⬣
│
│ 🔢 العدد : ${names.length}
│
${list}
│
╰━━━━━━━━━━━━⬣

✦ اكتب :
.باتش اسم_الملف
او
.باتش الرقم`
    }, { quoted: m })
  }

  let selected = ''

  // لو رقم
  if (/^\d+$/.test(text)) {

    const index = parseInt(text) - 1

    if (index < 0 || index >= names.length) {
      return m.reply(`❌ الرقم لازم يكون بين 1 و ${names.length}`)
    }

    selected = names[index]

  } else {

    if (names.includes(text)) {
      selected = text
    } else {

      const near = closestMatch(text, names)

      return m.reply(
`❌ الملف غير موجود

${near ? `🫦 ربما تقصد : ${near}` : ''}

📂 اكتب .باتش لعرض القائمة`
      )
    }
  }

  try {

    const filePath = path.join(pluginsPath, `${selected}.js`)
    const code = fs.readFileSync(filePath, 'utf8')

    // يرسل الملف
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      mimetype: 'application/javascript',
      fileName: `${selected}.js`
    }, { quoted: m })

    // تقسيم الكود
    const parts = code.match(/[\s\S]{1,3500}/g) || []

    for (let i = 0; i < parts.length; i++) {

      await conn.sendMessage(m.chat, {
        text:
`╭━━〔 🫦 ${selected}.js 〕━━⬣
│ جزء ${i + 1}/${parts.length}
╰━━━━━━━━━━━━⬣

\`\`\`javascript
${parts[i]}
\`\`\``
      }, { quoted: m })

    }

  } catch (e) {

    console.log(e)

    m.reply(`❌ حصل خطأ\n\n${e}`)
  }
}

handler.command = ['باتش']
handler.owner = true

export default handler
