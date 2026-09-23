# 🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 - WhatsApp Bot

<div align="center">
  <img src="https://i.postimg.cc/vHQhQdyR/𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵-𝑿.jpg" alt="𝑺𝒂𝒍𝒆𝒗𝒆𝒓" width="500"/>

  [![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel%20𝑺𝒂𝒍𝒆𝒗𝒆𝒓-orange?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K)
  [![Node](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  **Bot واتساب متكامل بتصميم فضه 🪙 وهوية متحركة 🅇**
  مبني على إطار العمل الداخلي **MeowSab** + معالج صور **Sharp** مدمج بالكامل — بدون أي استيراد خارجي.

  [التثبيت](#-التثبيت) • [المميزات](#-المميزات) • [الأوامر](#-أوامر-جديدة) • [الاستضافة](#-الاستضافة) • [الدعم](#-الدعم)
</div>

---

## 🌟 المميزات

- ✅ **هوية 𝑺𝒂𝒍𝒆𝒗𝒆र فضه** — لون `#c0c0c0` + حرف X متحرك 🅇 في كل الردود
- ✅ **ردود هادئة وجميلة** — قوالب عربية 🌿 ✨ 💚 عبر `getCalmResponse()`
- ✅ **بانر تيرمنال منظم** — يظهر عند تشغيل البوت مع معلومات القناة والإصدار
- ✅ **مكتبات داخلية بالكامل** — Sharp + MeowSab مدمجان داخل المشروع (لا استيراد خارجي)
- ✅ **معالج صور داخلي** — ستيكرات، شعار متحرك، معالجة صور عبر `system/image-processor.js`
- ✅ **ألعاب تفاعلية HTML** — شطرنج، اكس او، بيانو (ملفات HTML تُفتح بالمتصفح)
- ✅ **ذكاء اصطناعي** — محادثة Gemini 2.5 Flash + شخصيات AI متعددة
- ✅ **أوامر مدمجة من مصادر متعددة** — بدون تكرارات، بنفس هيكلة الأوامر الأصلية
- ✅ **أزرار متقدمة** — nativeFlow، كتالوج، مواقع (`plugins/owner/tesbtn.js`)
- ✅ **سريع وسهل التعديل** — كل شيء في `plugins/` و `system/`

---

## 📂 هيكل المشروع

```
sovereignx-core-main/
├── index.js                 # نقطة التشغيل الرئيسية
├── package.json             # الاسم: 𝑺𝒂𝒍𝒆𝒗𝒆र | المؤلف: svcp
├── system/
│   ├── config.js            # إعدادات البوت + البانر + قوالب الردود
│   ├── utils.js             # أدوات موحدة (ستيكر، أصول X، ردود هادئة)
│   ├── image-processor.js   # معالج صور داخلي (Sharp)
│   └── control.js           # أحداث المجموعات + التحكم بالصلاحيات
├── plugins/                 # جميع الأوامر
│   ├── game/                # شطرنج ♟️ | اكس او 🅇 | بيانو 🎹 | تحميل 📥
│   ├── ai/                  # محادثة Gemini + شخصيات AI
│   ├── islamic/             # نشيد ⚔️
│   ├── tools/               # طقس 🌤️ | فيديو ملاحظة 🎥 | صور وأدوات
│   ├── admins/ group/       # إدارة المجموعات
│   ├── bank/ info/ auto/    # بنك، معلومات، أوامر تلقائية
│   ├── logo/ voices/ owner/ # شعارات، أصوات، أوامر المالك
│   └── menu.js menu2.js     # قائمة الأوامر
├── ws-main/                 # إطار MeowSab (معدّل بالكامل 🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓)
└── sharp-tmx-main/          # مكتبة Sharp المدمجة داخليًا
```

---

## 🚀 التثبيت

### Termux (Android)

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y
git clone https://github.com/sovereignempirex-ux/sovereignx-core
cd sovereignx-core
npm install
npm start
```

### Windows / Linux / macOS

```bash
git clone https://github.com/sovereignempirex-ux/sovereignx-core
cd sovereignx-core
npm install
npm start
```

> 💡 عند التشغيل سيظهر بانر **𝑺𝒂𝒍𝒆𝒗𝒆𝒓** الفضه في التيرمنال ثم يطلب رمز الربط (Pairing Code).

---

## 🎮 أوامر جديدة

| الأمر | الوصف |
|-------|-------|
| `.chess` / `.شطرنج` | ♟️ شطرنج تفاعلي كامل — قوانين صحيحة، كش/مات، ترقية، تراجع |
| `.xo` / `.اكس او` | 🅇⭕ اكس او ضد الكمبيوتر أو لاعبين + عدادة نقاط |
| `.piano` / `.بيانو` | 🎹 بيانو تفاعلي بـ Web Audio (8 مفاتيح بيضاء + 5 سوداء) |
| `.download` / `.تنزيل` | 📥 تحميل فيديو/صوت من يوتيوب |
| `.ai` / `.ذكاء` | 🤖 محادثة Gemini 2.5 Flash حقيقية |
| `.نشيد` / `.nashid` | ⚔️ نشيد عشوائي أو ببحث — تحميل MP3 |
| `.الطقس` / `.weather` | 🌤️ طقس أي مدينة (بدون مفتاح API) |
| `.videonote` / `.vn` | 🎥 إرسال فيديو كملاحظة دائرية |
| `.tesbtn` | 🔘 تجربة أزرار nativeFlow (للمالك فقط) |

> جميع الألعاب تُرسل كملف HTML → افتحه في المتصفح و العب مباشرة 🎮

---

## 🌟 أهم الأوامر

- **إدارة المجموعات:** كيك، حظر، تحذيرات، ميوت، روابط، منشن، anti-link
- **التحميل:** يوتيوب (فيديو/صوت)، تحويل ستكر→صورة، صورة→فيديو
- **البنك والمستويات:** بروفايل، هدية، سرقة، مستوى
- **الذكاء الاصطناعي:** Many personalities AI + Gemini Chat
- **الشعارات:** 23 ثيم + شعار X متحرك
- **المالك:** restart، stop، join، leave، خصوصية، nativeFlow buttons

---

## 🌐 الاستضافة

### Cavirox Hosting

<div align="center">
  <img src="https://b.top4top.io/p_3725xw4y21.jpg" alt="Cavirox" width="200"/>

[![Website](https://img.shields.io/badge/Website-Cavirox-orange?style=for-the-badge&logo=website)](https://cavirox.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-blue?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K)

</div>

---

## 👤 الدعم

- **المالك والمطور:** svcp
- **قناة البوت:** [𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Channel](https://whatsapp.com/channel/0029Vb8glFqJkK7EdMYrao0K)
- **ID القناة:** `120363412381946365@newsletter`
- **المستودع:** [GitHub](https://github.com/sovereignempirex-ux/sovereignx-core)

---

<div align="center">

**صُنع بـ ♡ بواسطة svcp 🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓**

**© 2026 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 — جميع الحقوق محفوظة**

🪙 ✨ 🌿

</div>
