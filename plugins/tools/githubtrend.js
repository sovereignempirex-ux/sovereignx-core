/* ========== GitHub Trending - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import axios from "axios";
import cheerio from "cheerio";
import { getCalmResponse } from "../../system/utils.js";

async function ghTrending() {
    try {
        const url = "https://github.com/trending";
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const repositories = [];

        $(".Box-row").each((index, element) => {
            const title = $(element).find("h2 a").text().trim().replace(/\s+/g, " ");
            const repoLink = "https://github.com" + $(element).find("h2 a").attr("href");
            const description = $(element).find("p").text().trim();
            const stars = $(element).find("a[href$='/stargazers']").text().trim();
            
            const numbers = $(element).find("a.Link--muted").map((i, el) => $(el).text().trim()).get();
            const forks = numbers.length > 1 ? numbers[1] : "0";

            const language = $(element).find("[itemprop='programmingLanguage']").text().trim();

            repositories.push({
                title,
                repoLink,
                description,
                stars,
                forks,
                language: language || "Unknown",
            });
        });

        return repositories;
    } catch (error) {
        return [];
    }
}

const test = async (m, { conn }) => {
    try {
        const waitMsg = await m.reply(await getCalmResponse('thinking'));
        const repos = await ghTrending();
        
        if (!repos.length) return m.reply("لم أتمكن من جلب البيانات من GitHub Trending 🌿");

        let message = `🌿 *GitHub Trending اليوم*\n\n`;
        repos.slice(0, 5).forEach((repo, index) => {
            message += `${index + 1}. *${repo.title}*\n`;
            message += `🔗 ${repo.repoLink}\n`;
            message += `⭐ ${repo.stars} | 🍴 ${repo.forks}\n`;
            message += `💻 ${repo.language}\n`;
            message += `📝 ${repo.description || "لا يوجد وصف"}\n\n`;
        });
        message += `✨ 𝑺𝒶𝓁𝑒𝓋𝑒𝓇`;

        await conn.sendMessage(m.chat, { text: message, contextInfo: { 
          externalAdReply: {
            title: "𝑺𝒶𝓁𝑒𝓋𝑒𝓇 🌿",
            body: "GitHub Trending",
            thumbnailUrl: 'https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }}, { quoted: m });
        
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
        
    } catch (error) {
        m.reply(`${await getCalmResponse('error')}\n\n🔍 ${error.message}`);
    }
};

test.usage = ["githubtrend"];
test.command = ["githubtrend", "ghtrend", "github"];
test.category = "tools";
export default test;