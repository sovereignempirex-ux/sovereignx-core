<div align="center">

<img src="https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg" alt="𝑺𝒂𝒍𝒆𝒗𝒆𝒓" width="440" />

<br />
<br />

# 🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓

**Silver-themed. Modular. Extensible.**

A WhatsApp bot with its own identity, its own runtime,<br />
and a plugin system built for AI, games, media, and tools.

<br />

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-C0C0C0?style=flat-square&logo=node.js&logoColor=white&labelColor=0D1117)](https://nodejs.org)
[![MeowSab](https://img.shields.io/badge/Runtime-MeowSab-C0C0C0?style=flat-square&labelColor=0D1117)](#embedded-core)
[![Sharp](https://img.shields.io/badge/Media-Sharp-C0C0C0?style=flat-square&labelColor=0D1117)](#embedded-core)
[![License](https://img.shields.io/badge/License-MIT-C0C0C0?style=flat-square&labelColor=0D1117)](LICENSE)
[![Channel](https://img.shields.io/badge/WhatsApp-Channel-C0C0C0?style=flat-square&logo=whatsapp&logoColor=white&labelColor=0D1117)](https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K)

<br />

[Features](#features) · [Architecture](#architecture) · [Commands](#command-center) · [Install](#installation) · [Configure](#configuration) · [Develop](#development) · [Roadmap](#roadmap) · [Support](#support)

</div>

---

## About

**Salever** is a modular WhatsApp bot built on Node.js. It runs on **MeowSab**, a framework embedded in the repository, and processes media with an embedded build of **Sharp**. Commands are plugins grouped by category, so extending the bot means adding a file, not rewriting the core.

Every reply carries the Salever identity: silver `#C0C0C0`, an animated 🅇, and calm response templates.

| | |
|:--|:--|
| **Runtime** | Node.js 18+ |
| **Framework** | MeowSab — `ws-main/` |
| **Media** | Sharp — `sharp-tmx-main/`, `system/image-processor.js` |
| **AI** | Gemini 2.5 Flash · multiple personalities |
| **Commands** | `plugins/` |
| **Configuration** | `system/config.js` |
| **Start** | `npm start` |

---

## Why Salever

Salever treats a WhatsApp bot as a product, not a folder of scripts.

- **Identity first.** One visual language across replies and terminal: silver palette, animated 🅇, and a startup banner.
- **Own the core.** MeowSab and Sharp live inside the repository, tuned for Salever, rather than sitting behind a thin wrapper.
- **Built to be edited.** What you'll want to change lives in `plugins/` and `system/`.

---

## Features

| System | Capabilities | Location |
|:--|:--|:--|
| **Core** | Bot runtime · plugin-based command system · permission control · central configuration | `index.js` · `system/` |
| **Interaction** | Group management · nativeFlow buttons, catalogs, locations · command menus | `plugins/admins/` · `plugins/group/` · `plugins/owner/` · `plugins/menu.js` |
| **AI** | Gemini 2.5 Flash conversations · multiple AI personalities | `plugins/ai/` |
| **Media** | Stickers · animated logo · 23 logo themes · image processing · video notes | `system/image-processor.js` · `plugins/logo/` · `plugins/tools/` |
| **Games** | Chess · Tic-Tac-Toe · Piano — interactive HTML experiences | `plugins/game/` |
| **Utilities** | Weather · YouTube download · nasheed · tools | `plugins/` |
| **Identity** | Silver theme · animated 🅇 · calm response templates · terminal banner | `system/config.js` · `system/utils.js` |

---

## Architecture

```text
WhatsApp
   │
   ▼
index.js ················· entry point
   │
   ▼
Runtime ·················· MeowSab (ws-main/)
   │
   ├── system/ ··········· config · utils · image-processor · control
   │      └── sharp-tmx-main/ ··· embedded Sharp
   │
   └── plugins/ ·········· commands, grouped by category
          ├── game · ai · islamic · tools
          ├── admins · group · bank · info · auto
          └── logo · voices · owner · menus
```

### Project structure

```text
sovereignx-core/
├── index.js                 # Entry point
├── package.json
├── system/
│   ├── config.js            # Settings · banner · response templates
│   ├── utils.js             # Shared helpers (stickers, X assets, calm responses)
│   ├── image-processor.js   # Internal image processing (Sharp)
│   └── control.js           # Group events · permission control
├── plugins/
│   ├── game/                # Chess · XO · Piano · Download
│   ├── ai/                  # Gemini chat · AI personalities
│   ├── islamic/             # Nasheed
│   ├── tools/               # Weather · video notes · image tools
│   ├── admins/  group/      # Group management
│   ├── bank/  info/  auto/  # Economy · info · automatic commands
│   ├── logo/  voices/  owner/
│   └── menu.js  menu2.js    # Command menus
├── ws-main/                 # MeowSab framework
└── sharp-tmx-main/          # Embedded Sharp
```

| Path | Purpose |
|:--|:--|
| `index.js` | Main entry point |
| `system/` | Core utilities and runtime services |
| `plugins/` | Bot commands |
| `ws-main/` | Internal framework (MeowSab) |
| `sharp-tmx-main/` | Embedded image processing (Sharp) |

### Embedded core

```text
Salever
│
├── Bot Runtime ········ index.js · system/
├── MeowSab ············ ws-main/
├── Media Processing ··· sharp-tmx-main/ · system/image-processor.js
├── Command Plugins ···· plugins/
└── AI · Games · Tools · plugins/ai · plugins/game · plugins/tools
```

The goal is to keep the essential parts of the system inside the project instead of presenting Salever as a wrapper around outside libraries. MeowSab and Sharp are embedded and customized for Salever. Other dependencies declared in `package.json` are still installed by `npm install`.

---

## Command Center

Commands are shown with the `.` prefix. Arabic aliases work alongside the English names.

### 🎮 Games

| Command | Alias | Description |
|:--|:--|:--|
| `.chess` | `.شطرنج` | Interactive chess — legal-move rules, check and checkmate, promotion, undo |
| `.xo` | `.اكس او` | Tic-Tac-Toe against the computer or another player, with a score counter |
| `.piano` | `.بيانو` | Interactive piano on Web Audio — 8 white keys, 5 black keys |

> Games are delivered as an HTML file. Open it in a browser and play.

### 🤖 AI

| Command | Alias | Description |
|:--|:--|:--|
| `.ai` | `.ذكاء` | Conversation powered by Gemini 2.5 Flash |

Additional AI personalities live in `plugins/ai/`.

### 🛠 Tools

| Command | Alias | Description |
|:--|:--|:--|
| `.weather` | `.الطقس` | Weather for any city — no API key required |
| `.download` | `.تنزيل` | Download video or audio from YouTube |

### 🎵 Media

| Command | Alias | Description |
|:--|:--|:--|
| `.nashid` | `.نشيد` | Random or searched nasheed, downloadable as MP3 |
| `.videonote` | `.vn` | Send a video as a circular video note |

Also included: sticker → image and image → video conversion.

### 👑 Owner · 👥 Groups · 🪙 Economy · 🎨 Logos

| Area | Capabilities | Location |
|:--|:--|:--|
| 👑 **Owner** | Restart · stop · join · leave · privacy · nativeFlow buttons · `.tesbtn` (button test, owner only) | `plugins/owner/` |
| 👥 **Groups** | Kick · ban · warnings · mute · links · mention · anti-link | `plugins/admins/` · `plugins/group/` |
| 🪙 **Economy** | Profile · gift · steal · level | `plugins/bank/` |
| 🎨 **Logos** | 23 themes plus an animated 🅇 logo | `plugins/logo/` |

Exact command names for these areas are listed in the in-bot menu.

---

## Installation

**Requirements:** Node.js 18+ · Git

### Android · Termux

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y
git clone https://github.com/sovereignempirex-ux/sovereignx-core
cd sovereignx-core
npm install
npm start
```

### Windows · Linux · macOS

Install Node.js 18+ and Git, then:

```bash
git clone https://github.com/sovereignempirex-ux/sovereignx-core
cd sovereignx-core
npm install
npm start
```

### First launch

1. The silver **Salever** banner appears in the terminal.
2. Salever asks for a **pairing code**.
3. Enter the code in WhatsApp (Linked devices) to link the session.

---

## Configuration

| File | Holds |
|:--|:--|
| `system/config.js` | Bot settings · terminal banner · response templates |
| `system/utils.js` | Shared helpers — stickers, X assets, calm responses via `getCalmResponse()` |
| `system/control.js` | Group events · permission control |

Review `system/config.js` for the current configuration before your first launch.

- **AI:** the Gemini plugin lives in `plugins/ai/` — check it for how the key is supplied.
- **Weather:** works without an API key.
- **Secrets:** keep keys and session data out of version control. See [Security](#security).

---

## Deployment

Salever starts with `npm start`, so any environment that meets the requirements can host it.

| Target | Notes |
|:--|:--|
| **Android · Termux** | Follow the [Termux steps](#android--termux) |
| **Desktop / server** | Follow the [Windows · Linux · macOS steps](#windows--linux--macos) |
| **Managed hosting** | Cavirox — [cavirox.com](https://cavirox.com) |

<div align="center">

<img src="https://b.top4top.io/p_3725xw4y21.jpg" alt="Cavirox" width="160" />

</div>

---

## Development

```text
Edit  →  Test  →  Run  →  Debug  →  Commit
```

### Adding a command

```text
plugins/
└── <category>/
    └── <command>.js
```

1. Pick the category folder that fits (`game`, `ai`, `tools`, `owner`, …).
2. Follow the structure of an existing plugin in that folder — for example `plugins/owner/tesbtn.js`.
3. Start with `npm start` and test the command in WhatsApp.
4. If it should appear in the menus, check `plugins/menu.js` and `plugins/menu2.js`.

### Contributing

```text
Fork  →  Branch  →  Implement  →  Test  →  Pull Request
```

Keep to the existing folder structure, test before you open a PR, and never commit secrets.

---

## Roadmap

**Current**

- [x] Modular plugin-based command system
- [x] Gemini 2.5 Flash integration with multiple AI personalities
- [x] Interactive HTML games — chess, XO, piano
- [x] Internal image processing and animated logos
- [x] Group management and nativeFlow buttons
- [x] Embedded MeowSab framework and Sharp

**Future ideas** — not committed features

- [ ] Plugin authoring guide
- [ ] Full configuration reference
- [ ] Complete command reference for every plugin
- [ ] Further architecture improvements

---

## Security

- Treat your pairing session and credentials as private. Never share or commit them.
- Never upload API keys. Use environment variables where appropriate.
- Review any third-party plugin before adding it to `plugins/`.
- Salever makes no security guarantees — review the code before exposing it to others.

---

## Support

| | |
|:--|:--|
| **Channel** | [Salever on WhatsApp](https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K) · ID `120363412381946365@newsletter` |
| **Repository** | [sovereignempirex-ux/sovereignx-core](https://github.com/sovereignempirex-ux/sovereignx-core) |
| **Owner / Developer** | svcp |
| **Hosting** | [Cavirox](https://cavirox.com) |

---

## License

Released under the **MIT License**. See [LICENSE](LICENSE).

## Credits

| | |
|:--|:--|
| **Creator** | svcp |
| **Framework** | MeowSab, embedded and customized for Salever |
| **Media** | Sharp, embedded |
| **AI** | Gemini |
| **Hosting** | Cavirox |

---

<div align="center">

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓**

*Silver by identity. Sovereign by design.*<br />
*Built for experimentation. Designed for extension.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<sub>Made by svcp · © 2026 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 · MIT License</sub>

</div>
