<div align="center">
<img src="[https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg](https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg)" alt="𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Identity" width="160" style="border-radius: 4px;" />
🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓
Sovereign WhatsApp Architecture.

A silver-themed, modular automation system engineered for AI, zero-dependency media processing, and extensible bot development.
WhatsApp Channel

NodeJS Requirement

License

Hosted By
Philosophy ⟡ Architecture ⟡ Commands ⟡ Quick Start ⟡ Developer
</div>
⟡ PROJECT PHILOSOPHY
𝑺𝒂𝒍𝒆𝒗𝒆𝒓 is not just a bot; it is a meticulously crafted runtime environment for WhatsApp. Built around the core aesthetics of Silver, Elegance, and Sovereignty, it rejects the chaotic structure of standard automation scripts.
Instead of relying on fragile external dependencies, 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 integrates its essential frameworks directly into the core, ensuring maximum stability, security, and performance. Every interaction is designed to reflect a calm, premium identity via specialized response templates (getCalmResponse()) and the signature 🅇 motif.
⟡ FEATURE ECOSYSTEM
❖ Core Engine
 * Embedded Framework: Built on a deeply modified, internal version of MeowSab.
 * Zero-Dependency Media: Ships with its own sharp-tmx-main environment for image processing.
 * Organized Telemetry: Clean, informative terminal banners displaying runtime states and versioning.
❖ Interaction & UI
 * Calm Templates: Pre-configured Arabic responses (🌿 ✨ 💚) for a serene user experience.
 * Advanced Interfaces: Native flow support, catalogs, and interactive action buttons.
 * Granular Control: Comprehensive group management, anti-link systems, and user authority mapping.
❖ Artificial Intelligence
 * Gemini 2.5 Flash: High-speed, context-aware conversational AI.
 * Multi-Persona Matrix: Switchable AI personalities designed for different interaction models.
❖ HTML Game Engine
 * Browser-Based Execution: Games like Chess, Tic-Tac-Toe, and a Web Audio Piano are generated as interactive .html payloads, allowing users to play directly in their browsers.
⟡ SYSTEM ARCHITECTURE
𝑺𝒂𝒍𝒆𝒗𝒆𝒓 operates on a closed-loop architectural model. By keeping crucial libraries inside the workspace, it eliminates version conflicts and external API latency for media operations.
graph TD
    A[WhatsApp Network] <-->|Sockets| B(index.js)
    B <--> C{Core Runtime}
    
    subgraph Internal Framework
    E[ws-main / MeowSab]
    F[sharp-tmx-main / Media]
    end
    
    C --- E
    C --- F
    
    C <--> D[system/control.js]
    
    subgraph Plugin System
    G((plugins/))
    G --> H[AI Module]
    G --> I[Game Engine]
    G --> J[Admin Tools]
    end

Directory Structure
| Directory/File | Purpose |
|---|---|
| index.js | Primary application entry point and socket initializer. |
| system/ | Core logic: configurations, image processors, and permission controllers. |
| plugins/ | Modular command registry categorized by functionality (Games, AI, Tools). |
| ws-main/ | The embedded, customized MeowSab internal framework. |
| sharp-tmx-main/ | Localized Sharp library for sovereign media manipulation. |
⟡ COMMAND MATRIX
Commands are compartmentalized within the plugins/ directory. Below is a subset of the operational capabilities.
🤖 AI & Logic
| Command | Alias | Description |
|---|---|---|
| .ai | .ذكاء | Initialize Gemini 2.5 Flash interaction. |
| Various | Various | Invoke localized AI personalities. |
🎮 Interactive Games (HTML Payload)
| Command | Alias | Description |
|---|---|---|
| .chess | .شطرنج | Full interactive chess with validation, checkmate, and promotion. |
| .xo | .اكس او | Tic-Tac-Toe engine (Player vs AI / Player vs Player) with scoreboard. |
| .piano | .بيانو | Web Audio synthesizer (8 white keys, 5 black keys). |
🛠 Tools & Media
| Command | Alias | Description |
|---|---|---|
| .download | .تنزيل | Fetch and extract Video/Audio payloads from YouTube. |
| .videonote | .vn | Process and transmit standard video as a circular WhatsApp Note. |
| .weather | .الطقس | Fetch meteorological data without requiring an API key. |
| .nashid | .نشيد | Query or generate random Islamic audio (MP3). |
🛡️ Administration & Economy
| Command | Alias | Description |
|---|---|---|
| .tesbtn | None | Evaluate nativeFlow button capabilities (Owner authorization required). |
| System | System | Restart, Halt, Join/Leave routing, Privacy configuration. |
| Group | Group | Kick, Ban, Warn, Mute, Anti-link enforcement, Mass Mention. |
| Economy | Economy | Digital banking: Profiles, Leveling, Gifting, and Stealing mechanics. |
(Refer to plugins/menu.js for the complete operational matrix).
⟡ QUICK START
Ensure Node.js v18.x or higher is installed before proceeding.
▫️ Linux / Windows / macOS
# 1. Clone the repository
git clone https://github.com/sovereignempirex-ux/sovereignx-core.git

# 2. Navigate to the directory
cd sovereignx-core

# 3. Install required node modules
npm install

# 4. Initialize the runtime
npm start

▫️ Android (Termux)
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y
git clone https://github.com/sovereignempirex-ux/sovereignx-core.git
cd sovereignx-core
npm install
npm start

Upon execution, the 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 terminal banner will initiate, followed by a request for your WhatsApp Pairing Code.
⟡ CONFIGURATION
System behavior is governed centrally. Review the following files to adjust bot parameters:
 * system/config.js
   Modify owner credentials, bot identity strings, global prefixes, and banner settings.
 * system/utils.js
   Adjust output aesthetics, the 🅇 signature assets, and the getCalmResponse() string arrays.
 * system/control.js
   Manage group event listeners and hierarchical permissions.
⟡ DEVELOPER WORKFLOW
Adding functionality to 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 requires zero modification to the core runtime.
Standard Plugin Integration:
 * Navigate to the relevant category in plugins/ (e.g., plugins/tools/).
 * Create a new .js file mapping to the command structure.
 * Save and execute .restart via WhatsApp or restart the Node process.
 * The system automatically registers the new module into memory.
⟡ ROADMAP
 * [x] Internalize MeowSab framework.
 * [x] Integrate zero-dependency Sharp processor.
 * [x] Implement Gemini 2.5 Flash architecture.
 * [x] Deploy HTML-based interactive game payloads.
 * [ ] Future: Expansion of the nativeFlow button interfaces.
 * [ ] Future: Advanced telemetry and crash-recovery loops.
⟡ SECURITY PROTOCOLS
 * Session Data: Never expose or commit the generated session files.
 * Environment Variables: Utilize .env approaches for any external API keys you may add in the future.
 * Module Auditing: Review code before dropping external .js files into the plugins/ directory to prevent unauthorized execution.
⟡ SUPPORT & DEPLOYMENT
Hosting Infrastructure
𝑺𝒂𝒍𝒆𝒗𝒆𝒓 is optimized for deployment on Cavirox Hosting.

Explore Cavirox
Maintainers & Resources
 * Lead Architect: svcp
 * Repository: GitHub/sovereignempirex-ux
 * Official Broadcasts: 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Network (ID: 120363412381946365@newsletter)
<div align="center">
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓
Built for experimentation. Designed for sovereignty.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 — Released under the MIT License.
🪙 ✨ 🌿
</div>
