/* ========== 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 BOT - Main Entry Point ========== */
import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';
import { initBotConfig, BOT_NUMBER, OWNERS } from "./system/config.js";

/* =========== Client Setup ========== */
const client = new Client({
  phoneNumber: BOT_NUMBER,
  prefix: [".", "/", "!"], 
  owners: OWNERS.map(({ name, lid, jid }) => ({ name, lid, jid })),
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
  global.db = new UltraDB();
}

/* =========== Bot Configuration ========== */
const botConfig = initBotConfig(client);

/* =========== Start ========== */
client.start();

setTimeout(async () => {
  if (client.commandSystem) { 
    sub(client);
  }
}, 2000);

/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
  if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
});

/* =========== Memory Monitor ========== */ 

setInterval(() => {
  const used = process.memoryUsage().rss / 1024 / 1024
  if (used > 800) {
    console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
    process.exit(1) 
  }
}, 300_000)

export { client, botConfig };