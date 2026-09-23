# 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 BOT - COMPLETE PROJECT SUMMARY

## Project Structure
- **sovereignx-core-main**: Main bot project
- **ws-main**: MeowSub framework dependency

## Core System (📁 system/)
- `config.js` - Bot configuration + terminal banner + calm responses
- `image-processor.js` - Internal sharp wrapper (X animation, stickers, logos)
- `utils.js` - Unified tools (stickers, uploads, X asset, calm responses)
- `control.js` - Group events + access control (calm style, 🅇 emoji)

## Plugins (📁 plugins/)
### Stickers
- `h.js` - `.حقوس` - Add pack/author to sticker
- `s.js` - `.ملصق` - Create sticker from media
- `kiss.js` - `.kiss` - Kiss sticker from waifu.pics

### Logos
- `textpro.js` - `.logo` + 23 themes → Moving X animation

### Tools
- `ibb.js` - `.ibb` / `.upload` - ImgBB/Pixeldrain uploader
- `gmailprofile.js` - `.gmailprofile` - Gmail OSINT lookup
- `ffinfo.js` - `.freefire` / `.ffinfo` - Free Fire account info
- `lid.js` - `.lid` / `.معرف` - Get number/LID from mention/reply
- `githubtrend.js` - `.githubtrend` - GitHub trending repos

### Games
- `deal.js` - `.deal` - Football squad builder (2 players + AI evaluation)
- `yahyah.js` - `.بحبح` / `.yahyah` - "Say bahbah in 10s or get kicked" (owner only, groups)

### Sub-Bot Management
- `jadibot.js` - `.code` / `.qr` / `.تنصيب` / `.reconnect` / `.إلغاء` - Full sub-bot manager
- `setname.js` - `.setname` - Set custom sub-bot name
- `bots.js` - `.البوتات` / `.بوتات` - List active sub-bots
- `subper.js` - `.sublist` / `.subper` - List custom sub-bots with names

### Owner
- `cmd.js` - `.cmd` / `.sh` / `.shell` - Shell commands (owner only)
- `eval.js` - `>` / `=>` - JavaScript evaluator (owner only)
- `private.js` - `.الخاص-قفل` / `.الخاص-فتح` - Lock/unlock private messages

### Groups
- `autodetect.js` - Advanced group events with invite link detection

### RPG
- `roles.js` - RPG roles based on user level

## Key Features
✅ Terminal banner with large bot logo on startup  
✅ Bot name: 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 with new channel info  
✅ Calm, beautiful Arabic response style (🌿 ✨ 💚 🅇)  
✅ Moving X character (🅇) replaces ALL 🅇 marks  
  - 8-frame animated WebP, rotation -10°/+10°  
  - Pink (#ff3b81) & Cyan (#35e0ff) glow  
  - Used in errors, alerts, group events, stickers, menus  
✅ Internal image processing (sharp) - NO external calls  
✅ Sticker creation fully internal  
✅ 23 logo themes with moving X animation  
✅ Same command structure preserved  
✅ All plugins connected to unified internal system  
✅ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 branding throughout  

## New Commands Added (from merged bot)
### Tools: .ibb, .gmailprofile, .freefire, .lid, .githubtrend
### Games: .deal, .بحبح / .yahyah
### Sub-Bots: .code, .qr, .تنصيب, .reconnect, .إلغاء, .setname, .البوتات, .sublist
### Owner: .cmd, > / =>, .الخاص-قفل/فتح
### Group: Auto-detect events + invite link detection

## To Run
```bash
npm start
# or
node index.js
```

## Modified Files
- `ws-main/dist/index.cjs`: Creator attribution changed to `svcp`
- `ws-main/dist/index.mjs`: Creator attribution changed to `svcp`

## Bot Information
- **Name**: 𝑺𝒶𝓁𝑒𝓋𝑒𝓇
- **Channel**: `https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K`
- **Channel ID**: `120363412381946365@newsletter`
- **Image**: `https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg`

All syntax checks pass. The bot is ready to run with `npm start` or `node index.js`. ✅