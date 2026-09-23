=== 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 BOT - PROJECT COMPLETE ===

Project: C:\Users\New PC\Downloads\sovereignx-core-main

──────────────────────────────────────────────────────────────────────
BOT INFORMATION
──────────────────────────────────────────────────────────────────────
• Name: 𝑺𝒶𝓁𝑒𝓋𝑒𝓇
• Channel: https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K
• Channel ID: 120363412381946365@newsletter
• Image: https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg
• Version: 8.0.9
• Framework: MeowSab (baileys) - rebranded 𝑺𝒂𝒍𝒆𝒗𝒆𝒓

──────────────────────────────────────────────────────────────────────
CORE SYSTEM (Internal & Unified)
──────────────────────────────────────────────────────────────────────
system/
├── config.js           # Bot config + terminal banner + calm responses + X asset
├── image-processor.js  # Internal sharp wrapper (X animation, stickers, logos)
├── utils.js            # Unified tools (stickers, uploads, X asset, calm responses)
├── control.js          # Group events + access control (calm style, 🅇)
├── UltraDB.js          # Database
└── database.json       # Data storage

──────────────────────────────────────────────────────────────────────
PLUGINS - ORIGINAL (Preserved & Updated)
──────────────────────────────────────────────────────────────────────
plugins/
├── menu.js             # .الاوامر - organized calm menu
├── sticker/
│   ├── h.js            # .حقوق - add pack/author
│   ├── s.js            # .ملصق - create sticker
│   └── kiss.js         # .kiss - waifu.pics kiss sticker
├── logo/
│   └── textpro.js      # .logo - 23 themes + moving X animation
├── download/
│   └── ytmp3.js        # .ytmp3 - YouTube MP3 downloader
├── tools/
│   ├── githubtrend.js  # .githubtrend - GitHub trending
│   ├── lid.js          # .lid - get number/LID
│   ├── ibb.js          # .ibb - ImgBB/Pixeldrain uploader
│   ├── gmailprofile.js # .gmailprofile - Gmail OSINT
│   └── ffinfo.js       # .freefire - Free Fire account info
├── game/
│   ├── yahyah.js       # .بحبح - "say bah bah" game
│   └── deal.js         # .deal - Football squad builder game
├── rpg/
│   └── roles.js        # RPG roles based on level
├── sub/
│   ├── jadibot.js      # .code/.qr/.تنصيب - sub-bot manager
│   ├── setname.js      # .setname - set sub-bot name
│   ├── bots.js         # .البوتات - list active sub-bots
│   └── subper.js       # .sublist - list custom sub-bots
├── owner/
│   ├── cmd.js          # .cmd - shell commands
│   ├── eval.js         # > / => - JS evaluator
│   └── private.js      # .الخاص-قفل/فتح - PM lock
├── group/
│   └── autodetect.js   # Advanced group events with invite link detection
└── ... (other original plugins unchanged)

──────────────────────────────────────────────────────────────────────
KEY FEATURES
──────────────────────────────────────────────────────────────────────
✅ Terminal banner with large bot logo on startup
✅ Bot name: 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 with new channel info
✅ Calm, beautiful Arabic response style (🌿 ✨ 💚 🅇)
✅ Moving X character (🅇) replaces ALL 🅇 marks
  - 8-frame animated WebP, rotation -10°/+10°
  - Pink (#ff3b81) & Cyan (#35e0ff) glow
  - Used in errors, alerts, group events, stickers, menus
✅ Internal image processing (sharp) - NO external dependencies
✅ Sticker creation fully internal
✅ 23 logo themes with moving X animation
✅ Same command structure preserved
✅ All plugins connected to unified internal system
✅ Clean, organized code with consistent style
✅ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 branding throughout

──────────────────────────────────────────────────────────────────────
NEW COMMANDS ADDED (from merged bot)
──────────────────────────────────────────────────────────────────────
Tools:
  .ibb / .upload           - Upload image to ImgBB/Pixeldrain
  .gmailprofile <email>    - Gmail OSINT lookup
  .freefire <id> / .ffinfo - Free Fire account info
  .lid / .معرف             - Get number/LID from mention/reply
  .githubtrend             - GitHub trending repos

Games:
  .deal                    - Football squad builder (2 players, AI evaluation)
  .بحبح / .yahyah          - "Say bah bah in 10s or get kicked" (owner only)

Sub-Bot Management:
  .code / .qr              - Create sub-bot (pairing/QR)
  .تنصيب / .reconnect      - Reconnect offline sub-bots
  .إلغاء                   - Stop sub-bot
  .setname <name>          - Set custom sub-bot name
  .البوتات / .بوتات        - List active sub-bots
  .sublist / .subper       - List custom sub-bots with names

Owner:
  .cmd <shell>             - Execute shell commands
  > <js> / => <js>         - Evaluate JavaScript code
  .الخاص-قفل / .الخاص-فتح  - Lock/unlock private messages

Group:
  (Auto) Advanced group events with invite link detection

Stickers:
  .kiss @user              - Kiss sticker from waifu.pics

──────────────────────────────────────────────────────────────────────
ARCHITECTURE HIGHLIGHTS
──────────────────────────────────────────────────────────────────────
• All external libraries merged internally (sharp, uploads, etc.)
• Single source of truth: system/utils.js + system/image-processor.js
• Calm response system: getCalmResponse(type) with fallbacks
• Moving X asset: getXAsset() returns animated WebP buffer
• No duplicate commands - each feature appears once
• Consistent error handling with calm Arabic messages
• 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 branding: channel, name, image, emoji (🅇)

──────────────────────────────────────────────────────────────────────
TO RUN
──────────────────────────────────────────────────────────────────────
npm start
# or
node index.js