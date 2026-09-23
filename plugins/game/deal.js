/* ========== Deal Game (Football Squad Builder) - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import axios from 'axios';
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const PLAYERS = {
  GK: [
    { name: 'بوفون', icon: '🧤' }, { name: 'كاسياس', icon: '🧤' }, { name: 'مانويل نوير', icon: '🧤' },
    { name: 'ياشين', icon: '🧤' }, { name: 'أوليفر كان', icon: '🧤' }, { name: 'ديدا', icon: '🧤' },
    { name: 'بيتر شمايكل', icon: '🧤' }, { name: 'تير شتيجن', icon: '🧤' }, { name: 'أليسون', icon: '🧤' },
    { name: 'إيديرسون', icon: '🧤' }, { name: 'دي خيا', icon: '🧤' }, { name: 'كورتوا', icon: '🧤' },
    { name: 'دوناروما', icon: '🧤' }, { name: 'أوبلاك', icon: '🧤' }, { name: 'نافاس', icon: '🧤' },
    { name: 'هوغو لوريس', icon: '🧤' }, { name: 'إدوين فان دير سار', icon: '🧤' },
    { name: 'محمد الشناوي', icon: '🧤' }, { name: 'محمد العويس', icon: '🧤' },
  ],
  DEF: [
    { name: 'راموس', icon: '🛡️' }, { name: 'فاندايك', icon: '🛡️' }, { name: 'بويول', icon: '🛡️' },
    { name: 'كانافارو', icon: '🛡️' }, { name: 'مالديني', icon: '🛡️' }, { name: 'بيكنباور', icon: '🛡️' },
    { name: 'ثياجو سيلفا', icon: '🛡️' }, { name: 'كومباني', icon: '🛡️' }, { name: 'بيكيه', icon: '🛡️' },
    { name: 'فاران', icon: '🛡️' }, { name: 'نيستا', icon: '🛡️' }, { name: 'ريو فرديناند', icon: '🛡️' },
    { name: 'جون تيري', icon: '🛡️' }, { name: 'كافو', icon: '🛡️' }, { name: 'روبرتو كارلوس', icon: '🛡️' },
    { name: 'مارسيلو', icon: '🛡️' }, { name: 'أشلي كول', icon: '🛡️' }, { name: 'الكسندر أرنولد', icon: '🛡️' },
    { name: 'روبرتسون', icon: '🛡️' }, { name: 'كارفخال', icon: '🛡️' },
  ],
  MID: [
    { name: 'زيدان', icon: '⚙️' }, { name: 'دي بروين', icon: '⚙️' }, { name: 'مودريتش', icon: '⚙️' },
    { name: 'إنييستا', icon: '⚙️' }, { name: 'تشافي', icon: '⚙️' }, { name: 'كروس', icon: '⚙️' },
    { name: 'جيرارد', icon: '⚙️' }, { name: 'لامبارد', icon: '⚙️' }, { name: 'بيرلو', icon: '⚙️' },
    { name: 'كاكا', icon: '⚙️' }, { name: 'مارادونا', icon: '⚙️' }, { name: 'كاسيميرو', icon: '⚙️' },
    { name: 'كانتي', icon: '⚙️' }, { name: 'بوسكيتس', icon: '⚙️' }, { name: 'رودري', icon: '⚙️' },
    { name: 'بيليجهام', icon: '⚙️' }, { name: 'موسيالا', icon: '⚙️' }, { name: 'فابينيو', icon: '⚙️' },
    { name: 'يايا توريه', icon: '⚙️' }, { name: 'بول سكولز', icon: '⚙️' },
  ],
  ATT: [
    { name: 'رونالدو البرازيلي', icon: '⚽' }, { name: 'مبابي', icon: '⚽' }, { name: 'هالاند', icon: '⚽' },
    { name: 'بنزيما', icon: '⚽' }, { name: 'هاري كين', icon: '⚽' }, { name: 'سواريز', icon: '⚽' },
    { name: 'ليفاندوفسكي', icon: '⚽' }, { name: 'فان باستن', icon: '⚽' }, { name: 'باتيستوتا', icon: '⚽' },
    { name: 'دروجبا', icon: '⚽' }, { name: 'زلاتان', icon: '⚽' }, { name: 'تييري هنري', icon: '⚽' },
    { name: 'ميسي', icon: '⚽' }, { name: 'رونالدو (كريستيانو)', icon: '⚽' }, { name: 'نيمار', icon: '⚽' },
    { name: 'محمد صلاح', icon: '⚽' }, { name: 'فينيسيوس', icon: '⚽' }, { name: 'لامين يامال', icon: '⚽' },
    { name: 'رونالدينيو', icon: '⚽' }, { name: 'أجويرو', icon: '⚽' },
  ],
  HC: [
    { name: 'بيب جوارديولا', icon: '📋' }, { name: 'يورجن كلوب', icon: '📋' }, { name: 'جوزيه مورينيو', icon: '📋' },
    { name: 'كارلو أنشيلوتي', icon: '📋' }, { name: 'أليكس فيرجسون', icon: '📋' }, { name: 'أرسين فينجر', icon: '📋' },
    { name: 'ديجو سيميوني', icon: '📋' }, { name: 'زين الدين زيدان', icon: '📋' }, { name: 'لويس فان خال', icon: '📋' },
    { name: 'رافائيل بينيتيز', icon: '📋' }, { name: 'فابيو كابيلو', icon: '📋' }, { name: 'مارسيلو بيلسا', icon: '📋' },
    { name: 'توماس توخيل', icon: '📋' }, { name: 'أنطونيو كونتي', icon: '📋' }, { name: 'ماوريسيو بوكيتينو', icon: '📋' },
    { name: 'إريك تين هاغ', icon: '📋' }, { name: 'يوهان كرويف', icon: '📋' }, { name: 'خابي ألونسو', icon: '📋' },
    { name: 'لوتشيانو سباليتي', icon: '📋' },
  ],
};

const POSITIONS = ['GK', 'DEF', 'MID', 'ATT', 'HC'];
const POSITION_LABEL = { GK: '🧤 حارس', DEF: '🛡️ دفاع', MID: '⚙️ وسط', ATT: '⚽ هجوم', HC: '📋 مدرب' };

const dealStorage = new Map();

const cleanText = (s) => (s || '').replace(/[\u200B-\u200F\uFEFF\u061C]/g, '').trim();

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const generateBoxes = () => {
  const boxes = {};
  for (const pos of POSITIONS) {
    const pool = shuffle([...PLAYERS[pos]]);
    boxes[pos] = pool.slice(0, 5).map((p, i) => ({ number: i + 1, player: p, opened: false }));
  }
  return boxes;
};

const createGame = (starterId, starterName) => ({
  stage: 'WAITING',
  players: new Map([[starterId, { name: starterName, boxes: generateBoxes(), picked: {}, attempts: 0 }]]),
  starterId,
  turnOrder: [],
  currentTurnIndex: 0,
  posIndex: 0,
});

const displayBoxes = (boxes, pos) =>
  boxes[pos].map(b => b.opened ? `📦 بوكس ${b.number}: ${b.player.icon} *${b.player.name}*` : `🔒 بوكس ${b.number}`).join('\n');

async function evaluateSquad(playerName, picked) {
  const squadText = Object.entries(picked).map(([pos, p]) => `${POSITION_LABEL[pos]}: ${p.icon} ${p.name}`).join(', ');
  const prompt = `أنت محلل كرة قدم خبير. قيّم هذه التشكيلة التي اختارها ${playerName}:\n${squadText}\n\nاكتب تقييماً قصيراً (3-4 جمل) بالعربية عن قوة التشكيلة ونقاط القوة والضعف.`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await axios.get(`https://nour-deepseek-api.vercel.app/chat?message=${encodeURIComponent(prompt)}`, { timeout: 15000 });
      if (res.data?.success && res.data?.reply) return res.data.reply;
    } catch (e) {}
  }
  return '🅇 تعذر التقييم من AI حالياً 🌿';
}

async function advanceTurn(game, groupId, prevMsg, m, conn) {
  game.currentTurnIndex++;
  if (game.currentTurnIndex % 2 === 0) game.posIndex++;

  if (game.posIndex >= POSITIONS.length) {
    game.stage = 'FINISHED';
    let msg = prevMsg + `\n🎊 *انتهت اللعبة!*\n\n`;
    for (const pd of game.players.values()) {
      msg += `👤 *${pd.name}*:\n`;
      msg += Object.entries(pd.picked).map(([pos, p]) => `${POSITION_LABEL[pos]}: ${p.icon} ${p.name}`).join('\n');
      msg += '\n\n';
    }
    await m.reply(msg);
    await m.reply('⚽ جاري تقييم التشكيلات بالذكاء الاصطناعي... 🌿');
    for (const pd of game.players.values()) {
      const eval_ = await evaluateSquad(pd.name, pd.picked);
      await conn.sendMessage(m.chat, {
        text: `📊 *تقييم تشكيلة ${pd.name}:*\n\n${Object.entries(pd.picked).map(([pos, p]) => `${POSITION_LABEL[pos]}: ${p.icon} ${p.name}`).join('\n')}\n\n🤖 *رأي AI:*\n${eval_}`
      }, { quoted: m });
    }
    dealStorage.delete(groupId);
    return;
  }

  const nextUserId = game.turnOrder[game.currentTurnIndex];
  const nextPd = game.players.get(nextUserId);
  const nextPos = POSITIONS[game.posIndex];
  const msg = prevMsg + `🎮 دور *${nextPd.name}* الآن!\n📍 المركز: ${POSITION_LABEL[nextPos]}\n\nاكتب: *.deal بوكس <رقم>*\n\n${displayBoxes(nextPd.boxes, nextPos)}`;
  return m.reply(msg);
}

const test = async (m, { conn }) => {
  const groupId = m.chat;
  const userId = m.sender;
  const userName = m.pushName || 'مجهول';
  const parts = cleanText(m.text).split(/\s+/);
  const sub = parts[1] || 'بدء';

  if (sub === 'بدء') {
    if (dealStorage.has(groupId)) return m.reply('⚠️ فيه لعبة شغالة بالفعل! 🌿');
    dealStorage.set(groupId, createGame(userId, userName));
    return m.reply(`🎰 *『 Deal or No Deal 』*\n\n✅ *${userName}* فتح اللعبة!\n\n👥 للانضمام اكتب: *.deal me*\n\n📌 القواعد:\n• 5 مراكز: حارس، دفاع، وسط، هجوم، مدرب\n• كل مركز فيه 5 بوكسات\n• تفتح بوكسين بس في كل مركز\n• لو اللاعب عاجبك اكتب *.deal كافي*\n• لو مش عاجبك افتح بوكس تاني بـ *.deal بوكس <رقم>* (آخر فرصة)`);
  }

  if (sub === 'me') {
    const game = dealStorage.get(groupId);
    if (!game) return m.reply('🅇 مفيش لعبة شغالة! 🌿');
    if (game.stage !== 'WAITING') return m.reply('🅇 اللعبة بدأت بالفعل!');
    if (game.players.has(userId)) return m.reply('⚠️ أنت مسجل بالفعل!');
    if (game.players.size >= 2) return m.reply('🅇 اللعبة ممتلئة! (لاعبين اثنين فقط)');

    game.players.set(userId, { name: userName, boxes: generateBoxes(), picked: {}, attempts: 0 });
    const [p1, p2] = [...game.players.keys()];
    game.turnOrder = Array(POSITIONS.length).fill([p1, p2]).flat();
    game.currentTurnIndex = 0;
    game.posIndex = 0;
    game.stage = 'PLAYING';

    const firstPd = game.players.get(p1);
    return m.reply(`✅ *${userName}* انضم!\n\n🎮 دور *${firstPd.name}* الأول!\n📍 المركز: ${POSITION_LABEL[POSITIONS[0]]}\n\nاكتب: *.deal بوكس <رقم>*\n\n${displayBoxes(firstPd.boxes, POSITIONS[0])}`);
  }

  if (sub === 'بوكس') {
    const game = dealStorage.get(groupId);
    if (!game || game.stage !== 'PLAYING') return m.reply('🅇 مفيش لعبة شغالة دلوقتي! 🌿');

    const currentUserId = game.turnOrder[game.currentTurnIndex];
    if (currentUserId !== userId) return m.reply('⏳ مش دورك!');

    const boxNum = parseInt(parts[2]);
    if (isNaN(boxNum) || boxNum < 1 || boxNum > 5) {
      return m.reply('🅇 اكتب رقم بوكس من 1 لـ 5! مثال: `.deal بوكس 3`');
    }

    const pd = game.players.get(userId);
    const pos = POSITIONS[game.posIndex];
    const box = pd.boxes[pos].find(b => b.number === boxNum);

    if (!box) return m.reply('🅇 رقم البوكس غلط!');
    if (box.opened) return m.reply('🅇 البوكس ده اتفتح قبل كده!');

    box.opened = true;
    pd.attempts++;
    const player = box.player;

    let msg = `🎰 *بوكس ${boxNum} - ${POSITION_LABEL[pos]}*\n\n${player.icon} *${player.name}*\n\n${displayBoxes(pd.boxes, pos)}\n\n`;

    if (pd.attempts === 1) {
      msg += `💭 عاجبك؟\n• اكتب *.deal كافي* لو عاجبك ✅\n• اكتب *.deal بوكس <رقم>* لو مش عاجبك (آخر فرصة)`;
      return m.reply(msg);
    }

    pd.picked[pos] = player;
    pd.attempts = 0;
    msg += `✅ انتهى دورك في *${POSITION_LABEL[pos]}*!\nاللاعب المختار: ${player.icon} *${player.name}*\n\n`;
    return advanceTurn(game, groupId, msg, m, conn);
  }

  if (sub === 'كافي') {
    const game = dealStorage.get(groupId);
    if (!game || game.stage !== 'PLAYING') return m.reply('🅇 مفيش لعبة شغالة دلوقتي! 🌿');

    const currentUserId = game.turnOrder[game.currentTurnIndex];
    if (currentUserId !== userId) return m.reply('⏳ مش دورك!');

    const pd = game.players.get(userId);
    const pos = POSITIONS[game.posIndex];

    if (pd.attempts === 0) return m.reply('🅇 افتح بوكس الأول في المركز الأول بـ `.deal بوكس <رقم>`!');

    const openedBox = pd.boxes[pos].find(b => b.opened && !pd.picked[pos]);
    if (!openedBox) return m.reply('🅇 مفيش بوكس مفتوح!');

    pd.picked[pos] = openedBox.player;
    pd.attempts = 0;

    const msg = `✅ اخترت: ${openedBox.player.icon} *${openedBox.player.name}*\nالمركز: ${POSITION_LABEL[pos]}\n\n`;
    return advanceTurn(game, groupId, msg, m, conn);
  }

  if (['الغاء', 'إلغاء', 'انهاء'].includes(sub)) {
    const game = dealStorage.get(groupId);
    if (!game) return m.reply('🅇 مفيش لعبة شغالة! 🌿');
    if (!game.players.has(userId)) return m.reply('🚫 أنت مش في اللعبة!');
    dealStorage.delete(groupId);
    return m.reply(`🛑 تم إنهاء اللعبة بواسطة ${userName} 🌿`);
  }

  return m.reply(`🅇 أمر غير معروف: \`${sub}\`\n\nالأوامر:\n• .deal بدء\n• .deal me\n• .deal بوكس <رقم>\n• .deal كافي\n• .deal انهاء`);
};

test.usage = ["deal بدء", "deal me", "deal بوكس <رقم>", "deal كافي", "deal انهاء"];
test.command = ["deal", "صفقة", "تشكيلة"];
test.category = "game";
export default test;