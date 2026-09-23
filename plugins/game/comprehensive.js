/* ========== Comprehensive Game & AI Plugin - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import axios from "axios";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
const gameStates = new Map();

// ============================================================
// CHESS GAME
// ============================================================
const CHESS_PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

function createChessBoard() {
  return [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.'],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];
}

function renderChessBoard(board, turn) {
  let str = `  ${turn === 'white' ? '⚪' : '⚫'} دور: ${turn === 'white' ? 'الأبيض' : 'الأسود'}\n`;
  str += '  a b c d e f g h\n';
  for (let i = 0; i < 8; i++) {
    str += `${8-i} `;
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      str += piece === '.' ? '⬜ ' : CHESS_PIECES[piece] + ' ';
    }
    str += `${8-i}\n`;
  }
  str += '  a b c d e f g h\n';
  return str;
}

function parseMove(move) {
  const match = move.match(/^([a-h])(\d)\s*([a-h])(\d)$/);
  if (!match) return null;
  return {
    from: { col: match[1].charCodeAt(0) - 97, row: 8 - parseInt(match[2]) },
    to: { col: match[3].charCodeAt(0) - 97, row: 8 - parseInt(match[4]) }
  };
}

function isValidMove(board, move, turn) {
  // Basic move validation (simplified)
  const piece = board[move.from.row][move.from.col];
  if (piece === '.') return false;
  const isWhite = piece === piece.toUpperCase();
  if ((turn === 'white' && !isWhite) || (turn === 'black' && isWhite)) return false;
  // Simplified - just check destination is different
  return !(move.from.row === move.to.row && move.from.col === move.to.col);
}

function makeMove(board, move) {
  const newBoard = board.map(row => [...row]);
  newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
  newBoard[move.from.row][move.from.col] = '.';
  return newBoard;
}

// ============================================================
// TIC-TAC-TOE (X/O)
// ============================================================
function createTicTacToeBoard() {
  return Array(9).fill('.');
}

function renderTicTacToe(board) {
  const symbols = { '.': '⬜', 'X': '🅇', 'O': '⭕' };
  let str = '';
  for (let i = 0; i < 3; i++) {
    str += ' ';
    for (let j = 0; j < 3; j++) {
      str += symbols[board[i*3+j]] + ' ';
    }
    str += '\n';
  }
  return str;
}

function checkTicTacToeWin(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diagonals
  ];
  for (const [a,b,c] of lines) {
    if (board[a] !== '.' && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes('.')) return 'draw';
  return null;
}

// ============================================================
// AI CHAT (using external API)
// ============================================================
async function getAIResponse(prompt) {
  try {
    // Using a free AI API
    const response = await axios.post('https://api.ryzendesu.vip/api/ai/gemini-pro', {
      text: prompt,
      prompt: 'أنت مساعد ذكي عربي، جاوب باللهجة المغربية بطريقة مفيدة ومباشرة.'
    }, { timeout: 15000 });
    return response.data.answer || 'ماجانيش رد، عاود جرب';
  } catch (e) {
    return '🅇 خدمة الذكاء الاصطناعي غير متاحة حالياً';
  }
}

// ============================================================
// DOWNLOAD FUNCTIONALITY
// ============================================================
async function downloadMedia(url, type = 'video') {
  try {
    // Using a simple download approach
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    return Buffer.from(response.data);
  } catch (e) {
    throw new Error('فشل التحميل: ' + e.message);
  }
}

// ============================================================
// MAIN COMMAND HANDLER
// ============================================================
const test = async (m, { conn, text, usedPrefix, command }) => {
  const args = text?.trim().split(/\s+/) || [];
  const subCommand = args[0]?.toLowerCase() || '';

  // ----- CHESS -----
  if (['شطرنج', 'chess'].includes(subCommand)) {
    const gameId = `chess_${m.chat}_${m.sender}`;
    let state = gameStates.get(gameId);
    
    const subSub = args[1]?.toLowerCase();
    
    if (subSub === 'جديد' || subSub === 'new' || !state) {
      state = { board: createChessBoard(), turn: 'white', player: m.sender };
      gameStates.set(gameId, state);
      return m.reply(`♟️ *لعبة شطرنج جديدة*\n\n${renderChessBoard(state.board, state.turn)}\n\n📝 *الحركة:* اكتب \`.شطرنج e2 e4\`\n🏳️ *استسلام:* \`.شطرنج استسلام\``);
    }
    
    if (subSub === 'استسلام' || subSub === 'resign') {
      gameStates.delete(gameId);
      return m.reply('🏳️ تم الاستسلام. اللعبة انتهت.');
    }
    
    if (subSub && args[2]) {
      if (state.player !== m.sender) {
        return m.reply('🅇 ليس دورك!');
      }
      if (state.turn === 'white' && m.sender !== state.player) return m.reply('🅇 دور الأبيض!');
      
      const move = parseMove(`${subSub} ${args[2]}`);
      if (!move || !isValidMove(state.board, move, state.turn)) {
        return m.reply('🅇 حركة غير صالحة! مثال: \`.شطرنج e2 e4\`');
      }
      
      state.board = makeMove(state.board, move);
      state.turn = state.turn === 'white' ? 'black' : 'white';
      gameStates.set(gameId, state);
      
      return m.reply(`♟️ *حركة مقبولة*\n\n${renderChessBoard(state.board, state.turn)}`);
    }
    
    return m.reply(`♟️ *الشطرنج*\n\n${state ? renderChessBoard(state.board, state.turn) : 'لا توجد لعبة جارية'}\n\n📝 *الأوامر:*\n• \`.شطرنج جديد\` - لعبة جديدة\n• \`.شطرنج e2 e4\` - حركة\n• \`.شطرنج استسلام\` - إنهاء`);
  }

  // ----- TIC-TAC-TOE (X/O) -----
  if (['اكس-او', 'اكسأو', 'xo', 'tic', 'tictactoe'].includes(subCommand)) {
    const gameId = `xo_${m.chat}`;
    let state = gameStates.get(gameId);
    
    const subSub = args[1]?.toLowerCase();
    
    if (subSub === 'جديد' || subSub === 'new' || !state) {
      state = { board: createTicTacToeBoard(), turn: 'X', players: [m.sender], waiting: true };
      gameStates.set(gameId, state);
      return m.reply(`⭕🅇 *لعبة X/O جديدة*\n\n${renderTicTacToe(state.board)}\n\n👥 *انضم:* اكتب \`.اكس-او انضم\`\n🎮 *العب:* اكتب رقم 1-9`);
    }
    
    if (subSub === 'انضم' || subSub === 'join') {
      if (state.players.length >= 2) return m.reply('🅇 اللعبة ممتلئة!');
      if (state.players.includes(m.sender)) return m.reply('✅ أنت مسجل بالفعل!');
      state.players.push(m.sender);
      state.waiting = false;
      gameStates.set(gameId, state);
      return m.reply(`✅ انضم ${m.pushName}!\n\n⭕ ${state.players[0]} vs 🅇 ${state.players[1]}\n\n${renderTicTacToe(state.board)}\n\n🎮 دور 🅇 (${state.players[0]}): اكتب رقم 1-9`);
    }
    
    const moveNum = parseInt(subSub);
    if (moveNum >= 1 && moveNum <= 9) {
      const playerIndex = state.players.indexOf(m.sender);
      if (playerIndex === -1) return m.reply('🅇 أنت لست في اللعبة!');
      if (state.turn === 'X' && playerIndex !== 0) return m.reply('🅇 ليس دورك!');
      if (state.turn === 'O' && playerIndex !== 1) return m.reply('🅇 ليس دورك!');
      if (state.board[moveNum-1] !== '.') return m.reply('🅇 المربع محتل!');
      
      state.board[moveNum-1] = state.turn;
      const winner = checkTicTacToeWin(state.board);
      
      if (winner) {
        gameStates.delete(gameId);
        if (winner === 'draw') {
          return m.reply(`🤝 *تعادل!*\n\n${renderTicTacToe(state.board)}`);
        }
        return m.reply(`🏆 *فاز ${winner}!*\n\n${renderTicTacToe(state.board)}\n\n🎉 مبروك ${state.players[winner==='X'?0:1]}!`);
      }
      
      state.turn = state.turn === 'X' ? 'O' : 'X';
      gameStates.set(gameId, state);
      
      return m.reply(`${renderTicTacToe(state.board)}\n\n🎮 دور ${state.turn === 'X' ? '🅇' : '⭕'} (${state.players[state.turn==='X'?0:1]})`);
    }
    
    return m.reply(`⭕🅇 *X/O*\n\n${state ? renderTicTacToe(state.board) : 'لا توجد لعبة'}\n\n📝 *الأوامر:*\n• \`.اكس-او جديد\` - لعبة جديدة\n• \`.اكس-او انضم\` - انضمام\n• \`.اكس-او 5\` - لعب في مربع 5`);
  }

  // ----- AI CHAT -----
  if (['ذكاء', 'ai', 'سؤال', 'اسأل'].includes(subCommand)) {
    const question = args.slice(1).join(' ');
    if (!question) return m.reply('❓ اكتب سؤالك بعد الأمر.\nمثال: \`.ذكاء ما هي عاصمة المغرب؟\`');
    
    const waitMsg = await m.reply(await getCalmResponse('thinking'));
    const answer = await getAIResponse(question);
    
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    return m.reply(`🤖 *جواب الذكاء الاصطناعي*\n\n${answer}\n\n✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓`);
  }

  // ----- DOWNLOAD -----
  if (['تنزيل', 'تحميل', 'download', 'dl'].includes(subCommand)) {
    const url = args[1];
    if (!url || !url.startsWith('http')) {
      return m.reply('📥 اكتب الرابط بعد الأمر.\nمثال: \`.تنزيل https://example.com/video.mp4\`');
    }
    
    const waitMsg = await m.reply(await getCalmResponse('thinking'));
    
    try {
      const buffer = await downloadMedia(url);
      const fileName = url.split('/').pop() || 'file';
      
      await conn.sendMessage(m.chat, {
        document: buffer,
        mimetype: 'application/octet-stream',
        fileName: `𝑺𝒂𝒍𝒆𝒗𝒆𝒓_${fileName}`,
        caption: `✅ *تم التحميل*\n\n📁 ${fileName}\n📦 ${(buffer.length/1024/1024).toFixed(2)} MB\n\n✨ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓`
      }, { quoted: m });
      
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    } catch (e) {
      await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${e.message}`);
    }
    return;
  }

  // ----- HELP -----
  const helpText = `
🎮 *ألعاب و أدوات - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓*

♟️ *الشطرنج:*
• \`.شطرنج جديد\` - لعبة جديدة
• \`.شطرنج e2 e4\` - حركة
• \`.شطرنج استسلام\` - إنهاء

⭕🅇 *X/O:*
• \`.اكس-او جديد\` - لعبة جديدة
• \`.اكس-او انضم\` - انضمام
• \`.اكس-او 5\` - لعب (1-9)

🤖 *الذكاء الاصطناعي:*
• \`.ذكاء سؤالك هنا\` - اسأل أي شيء

📥 *التنزيل:*
• \`.تنزيل <رابط>\` - تحميل ملف

🎹 *أخرى:*
• \`.piano\` - بيانو تفاعلي
• \`.الطقس مدينة\` - حالة الطقس
• \`.videonote <رابط>\` - فيديو دائري

✨ اكتب أمر لتبدأ!
`.trim();

  return m.reply(helpText);
};

test.usage = ["العاب", "الالعاب", "games", "help", "مساعدة"];
test.command = ["العاب", "الالعاب", "games", "game", "help", "مساعدة", "شطرنج", "اكس-او", "xo", "ذكاء", "ai", "تنزيل", "download"];
test.category = "game";
export default test;