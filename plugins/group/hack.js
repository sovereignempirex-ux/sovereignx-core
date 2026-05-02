let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply('❌ ~ يعمل في الجروبات فقط');

    const groupId = m.chat;
    let groupMetadata = {};
    try {
        groupMetadata = await conn.groupMetadata(groupId);
    } catch (e) {}

    // ─── جمع البيانات المسبقة ───
    const allJids = participants.map(p => p.id);
    const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    const superAdmin = participants.find(p => p.admin === 'superadmin');
    const ownerList = (global.owner || []).map(([jid, name, dev]) => ({
        num: jid?.replace(/[^0-9]/g, ''),
        name: name || 'مطور البوت',
        dev: dev || false,
        jid: (jid?.replace(/[^0-9]/g, '') || '') + '@s.whatsapp.net'
    })).filter(o => o.num);

    const plugins = Object.keys(global.plugins || {});
    const cmdCount = plugins.length;

    // ─── معلومات النظام ───
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const memTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

    // ─── 1️⃣ محاكاة التهكير المتقدمة ───
    let msg = await conn.sendMessage(groupId, {
        text: '🔴 ~ جاري تهكير الجروب...\n\n[□□□□□□□□□□□□□□□□□□] 0%'
    });

    const stages = [
        { icon: '🔓', text: 'كسر جدار الحماية (Firewall)...', pct: 5, delay: 800 },
        { icon: '🔑', text: 'فك تشفير مفاتيح AES-256...', pct: 12, delay: 900 },
        { icon: '📡', text: 'الاتصال بالخادم المركزي [45.33.12.8]...', pct: 20, delay: 1100 },
        { icon: '🌐', text: 'تجاوز بروتوكولات TLS 1.3...', pct: 28, delay: 1000 },
        { icon: '👁️', text: 'تفعيل وضع التجسس على الرسائل...', pct: 35, delay: 1200 },
        { icon: '💉', text: 'حقن كود استغلال XSS...', pct: 42, delay: 900 },
        { icon: '👥', text: `استخراج بيانات ${participants.length} عضو...`, pct: 50, delay: 1400 },
        { icon: '📸', text: `تنزيل ${participants.length} صورة بروفايل...`, pct: 58, delay: 1300 },
        { icon: '📹', text: 'فحص الميديا والفيديوهات...', pct: 65, delay: 1100 },
        { icon: '📂', text: 'فك ضغط قاعدة البيانات...', pct: 72, delay: 1000 },
        { icon: '💬', text: 'قراءة الرسائل المؤرشفة...', pct: 78, delay: 1200 },
        { icon: '📊', text: 'تحليل الأنماط السلوكية...', pct: 85, delay: 1000 },
        { icon: '💾', text: 'حفظ البيانات في /tmp/extracted...', pct: 92, delay: 900 },
        { icon: '🔐', text: 'تجاوز التحقق الثنائي (2FA)...', pct: 97, delay: 1100 },
        { icon: '✅', text: 'اكتمل الاختراق بنجاح!', pct: 100, delay: 1000 }
    ];

    for (const stage of stages) {
        await new Promise(r => setTimeout(r, stage.delay));
        const filled = '█'.repeat(Math.floor(stage.pct / 5));
        const empty = '░'.repeat(20 - Math.floor(stage.pct / 5));
        await conn.sendMessage(groupId, {
            text: `${stage.icon} ~ ${stage.text}\n\n[${filled}${empty}] ${stage.pct}%\n⏱️ ~ ETA: ${((100 - stage.pct) * 0.15).toFixed(1)}s`,
            edit: msg.key
        });
    }

    // ─── 2️⃣ الرسالة النهائية الشاملة ───
    const ownerBlock = ownerList.length > 0
        ? ownerList.map((o, i) => 
            `${i === ownerList.length - 1 ? '└' : '├'}─ ${o.dev ? '👑' : '👤'} ~ ${o.name}\n` +
            `${i === ownerList.length - 1 ? ' ' : '│'}   📱 ~ @${o.num}\n` +
            `${i === ownerList.length - 1 ? ' ' : '│'}   🆔 ~ ${o.jid}\n` +
            `${i === ownerList.length - 1 ? ' ' : '│'}   🛡️ ~ ${o.dev ? 'مطور أساسي' : 'مطور فرعي'}`
          ).join('\n')
        : '└─ ❌ ~ غير محدد';

    const adminList = admins.length > 0
        ? admins.slice(0, 5).map((a, i) => {
            const num = a.id.split('@')[0];
            const isOwner = ownerList.some(o => o.jid === a.id);
            return `${i === Math.min(admins.length, 5) - 1 ? '└' : '├'}─ ${isOwner ? '👑' : '🔧'} ~ @${num} ${isOwner ? '(مطور)' : ''}`;
          }).join('\n') + (admins.length > 5 ? `\n└─ ... و ${admins.length - 5} أدمن آخر` : '')
        : '└─ ❌ ~ لا يوجد أدمنز';

    const sampleFiles = participants.slice(0, 5).map((p, i) => {
        const n = p.id.split('@')[0];
        const types = ['jpg', 'png', 'mp4', 'pdf', 'db'];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = (Math.random() * 15 + 0.5).toFixed(2);
        return `${i === 4 ? '└' : '├'}─ 📄 ~ extract_${n}_${Date.now().toString(36).slice(-6)}.${type} (${size} MB)`;
    }).join('\n');

    const finalText = `
╔══════════════════════════════════════════════════╗
║         ⚠️  تـمّ الاخـتـراق بـنـجـاح  ⚠️         ║
║         [SOVEREIGN-X PENETRATION SYSTEM]         ║
╚══════════════════════════════════════════════════╝

📊 ═══ تـقـريـر الـبـيـانـات الـمـسـتـخـرجـة ═══

🏷️ ~ معلومات الجروب:
├─ 📌 ~ الاسم: ${groupMetadata.subject || 'غير معروف'}
├─ 📝 ~ الوصف: ${(groupMetadata.desc || 'لا يوجد').toString().substring(0, 50)}${(groupMetadata.desc || '').length > 50 ? '...' : ''}
├─ 🆔 ~ المعرف: ${groupId.split('@')[0]}
├─ 👥 ~ إجمالي الأعضاء: ${participants.length}
├─ 🔧 ~ عدد الأدمنز: ${admins.length}
├─ 👑 ~ منشئ الجروب: ${superAdmin ? '@' + superAdmin.id.split('@')[0] : 'غير معروف'}
├─ 🔒 ~ نوع الجروب: ${groupMetadata.announce ? 'إعلانات فقط' : 'عام'}
├─ 🖼️ ~ الصور المستخرجة: ${participants.length} ملف
├─ 💾 ~ حجم البيانات: ${(participants.length * 2.4 + Math.random() * 500).toFixed(2)} MB
├─ 🔐 ~ حالة الأمان: مكسورة ⚠️
└─ ⏱️ ~ مدة العملية: ${(uptime % 60).toFixed(1)}s

👑 ═══ مـعـلـومـات الـمـالـك (الـمـطـور) ═══
${ownerBlock}

🔧 ═══ قـائـمـة الأدمنـز ═══
${adminList}

📋 ═══ إحـصـائـيـات الـنـظـام ═══
├─ 🤖 ~ اسم البوت: ${global.packname || 'SOVEREIGN-X BOT'}
├─ ⚡ ~ إجمالي الأوامر: ${cmdCount} أمر
├─ 📦 ~ الملحقات المحملة: ${plugins.length} ملحق
├─ 🖥️ ~ Node.js: ${process.version}
├─ 💾 ~ الذاكرة المستخدمة: ${memUsed} / ${memTotal} MB
├─ ⏱️ ~ وقت التشغيل: ${hours}h ${mins}m ${secs}s
├─ 🌍 ~ المنصة: ${process.platform}
└─ 🕐 ~ التوقيت: ${new Date().toLocaleString('ar-SA')}

📁 ═══ عـيـنـة مـن الـمـلـفـات ═══
${sampleFiles}
└─ ... و ${Math.max(0, participants.length - 5)} ملف آخر

╔══════════════════════════════════════════════════╗
║  ⚠️ ~ تـنـبـيـه: هـذه مـجـرد مـحـاكـاة للـتـسـلـيـة  ║
║  🔒 ~ لا يـوجـد اخـتـراق حـقـيـقـي - بـيـانـاتـك آمـنـة  ║
╚══════════════════════════════════════════════════╝
    `.trim();

    await conn.sendMessage(groupId, {
        text: finalText,
        mentions: [...allJids, ...ownerList.map(o => o.jid)]
    });
};

handler.command = ['تهكير'];
handler.group = true;
handler.desc = 'محاكاة تهكير متقدمة للجروب';

export default handler;
