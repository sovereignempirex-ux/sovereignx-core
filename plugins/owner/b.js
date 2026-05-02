import { exec } from 'child_process';
import { promisify } from 'util';
import { readdirSync, statSync, unlinkSync, rmdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const execAsync = promisify(exec);

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ ~ هذا الأمر للمطور فقط');

    m.reply('⏳ ~ جاري تنظيف البوت وإنهاء العمليات الفرعية...');

    let cleanedFiles = 0;
    let cleanedDirs = 0;
    let killedProcesses = 0;

    try {
        // ─── 1️⃣ تنظيف الملفات المؤقتة ───
        const baseDir = '/data/data/com.termux/files/home/SALEVER/BOT';
        const dirsToClean = [
            resolve(baseDir, 'tmp'),
            resolve(baseDir, 'cache'),
            resolve(baseDir, 'temp'),
            resolve(baseDir, 'downloads'),
            resolve(baseDir, 'media'),
            resolve(baseDir, 'sessions')
        ];

        for (const dir of dirsToClean) {
            if (!existsSync(dir)) continue;

            const items = readdirSync(dir);
            for (const item of items) {
                const itemPath = join(dir, item);
                try {
                    const stats = statSync(itemPath);
                    if (stats.isFile()) {
                        unlinkSync(itemPath);
                        cleanedFiles++;
                    } else if (stats.isDirectory()) {
                        rmdirSync(itemPath, { recursive: true });
                        cleanedDirs++;
                    }
                } catch (err) {
                    console.error('Clean error:', err.message);
                }
            }
        }

        // ─── 2️⃣ إنهاء البوتات/العمليات الفرعية ───
        try {
            const { stdout } = await execAsync('ps -o pid,ppid,comm | grep node');
            const lines = stdout.trim().split('\n');
            const currentPid = process.pid;

            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                const pid = parseInt(parts[0]);
                const ppid = parseInt(parts[1]);

                // اقتل العمليات الفرعية فقط (ما عدا البوت الرئيسي)
                if (pid !== currentPid && (ppid === currentPid || ppid === 1)) {
                    try {
                        process.kill(pid, 'SIGTERM');
                        killedProcesses++;
                    } catch (e) {
                        try {
                            process.kill(pid, 'SIGKILL');
                            killedProcesses++;
                        } catch (e2) {}
                    }
                }
            }
        } catch (e) {
            // لا توجد عمليات فرعية
        }

        // ─── 3️⃣ تنظيف الذاكرة المؤقتة ───
        if (global.gc) global.gc();

        // ─── 4️⃣ التقرير النهائي ───
        await m.reply(
            `🧹 ~ تم تنظيف البوت\n\n` +
            `📁 ~ ملفات ممسوحة: ${cleanedFiles}\n` +
            `📂 ~ مجلدات ممسوحة: ${cleanedDirs}\n` +
            `⚡ ~ عمليات منتهية: ${killedProcesses}\n` +
            `🧠 ~ الذاكرة المؤقتة: تم التنظيف\n\n` +
            `✅ ~ البوت جاهز ونظيف`
        );

    } catch (error) {
        console.error('Batch error:', error);
        m.reply('❌ ~ خطأ: ' + (error.message || 'فشل في التنظيف'));
    }
};

handler.command = ['باتش'];
handler.owner = true;
handler.desc = 'تنظيف ملفات البوت وإنهاء العمليات الفرعية';

export default handler;
