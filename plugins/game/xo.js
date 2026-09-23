/* ========== Tic-Tac-Toe (X-O) - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import fs from "fs";
import path from "path";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>𝑺𝒂𝒍𝒆𝒗𝒆𝒓 X-O</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
body{background:linear-gradient(145deg,#141414,#292929);font-family:Arial,sans-serif;color:#e8e8e8;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:15px;}
.title{font-size:26px;font-weight:bold;text-align:center;text-shadow:0 2px 6px rgba(0,0,0,0.6);}
.subtitle{font-size:13px;color:rgba(232,232,232,0.7);margin:6px 0 18px;text-align:center;}
.mode-btns{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;justify-content:center;}
.mode-btn{background:rgba(255,255,255,0.08);border:2px solid rgba(232,232,232,0.25);color:#e8e8e8;padding:9px 18px;border-radius:25px;font-size:14px;font-weight:bold;cursor:pointer;transition:all 0.2s;}
.mode-btn.active{background:linear-gradient(135deg,#d4d4d4,#a8a8a8);color:#111;border-color:#c0c0c0;box-shadow:0 4px 15px rgba(192,192,192,0.35);}
.board{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:rgba(0,0,0,0.45);padding:10px;border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,0.7);border:1px solid #4a4a4a;}
.cell{width:clamp(70px,22vw,110px);height:clamp(70px,22vw,110px);background:linear-gradient(145deg,#333333,#262626);border:2px solid rgba(232,232,232,0.14);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:clamp(36px,10vw,56px);font-weight:bold;cursor:pointer;transition:all 0.15s;user-select:none;}
.cell:hover:not(.filled){background:rgba(255,255,255,0.1);border-color:rgba(232,232,232,0.3);}
.cell:active:not(.filled){transform:scale(0.94);}
.cell.x{color:#e8e8e8;text-shadow:0 0 15px rgba(232,232,232,0.75);}
.cell.o{color:#35e0ff;text-shadow:0 0 15px rgba(53,224,255,0.75);}
.cell.win{background:linear-gradient(145deg,#2d4a2d,#1a331a);border-color:#4aff4a;animation:glow 0.8s ease-in-out infinite alternate;}
@keyframes glow{from{box-shadow:0 0 6px #4aff4a;}to{box-shadow:0 0 20px #4aff4a;}}
.status{margin-top:16px;font-size:17px;font-weight:bold;min-height:26px;text-align:center;}
.score{display:flex;gap:18px;margin-top:14px;background:rgba(0,0,0,0.4);padding:10px 22px;border-radius:12px;font-size:15px;font-weight:bold;flex-wrap:wrap;justify-content:center;border:1px solid #4a4a4a;}
.score .x-s{color:#e8e8e8;}.score .o-s{color:#35e0ff;}.score .d-s{color:#999;}
.btn{background:linear-gradient(135deg,#d4d4d4,#a8a8a8);border:none;color:#111;padding:11px 26px;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;margin-top:14px;transition:transform 0.1s;}
.btn:active{transform:scale(0.95);}
.footer{font-size:11px;color:rgba(232,232,232,0.45);margin-top:16px;text-align:center;}
</style>
</head>
<body>
<div class="title">🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 X-O ⭕</div>
<div class="subtitle">اكس او • ضد الكمبيوتر أو مع صديق • فضه ✨</div>
<div class="mode-btns">
<button class="mode-btn active" id="mode-ai" onclick="setMode('ai')">🤖 ضد الكمبيوتر</button>
<button class="mode-btn" id="mode-2p" onclick="setMode('2p')">👥 لاعبان</button>
</div>
<div class="board" id="board"></div>
<div class="status" id="status">دورك 🅇</div>
<div class="score">
<span class="x-s">🅇 <span id="sx">0</span></span>
<span class="d-s">🤝 <span id="sd">0</span></span>
<span class="o-s">⭕ <span id="so">0</span></span>
</div>
<button class="btn" onclick="resetRound()">🔄 جولة جديدة</button>
<div class="footer">🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 X-O • by svcp</div>
<script>
const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board,turn,gameOver,mode='ai',score={x:0,o:0,d:0};

function setMode(m){mode=m;document.getElementById('mode-ai').classList.toggle('active',m==='ai');document.getElementById('mode-2p').classList.toggle('active',m==='2p');resetRound();}

function resetRound(){board=Array(9).fill('');turn='X';gameOver=false;render();setStatus('دورك 🅇');}

function setStatus(t){document.getElementById('status').textContent=t;}

function winner(b){for(const a of WINS){const i=a[0],j=a[1],k=a[2];if(b[i]&&b[i]===b[j]&&b[i]===b[k])return{p:b[i],line:[i,j,k]};}return b.every(v=>v)?{p:'D',line:[]}:null;}

function render(){
const el=document.getElementById('board');el.innerHTML='';
const w=winner(board);
for(let i=0;i<9;i++){
const c=document.createElement('div');c.className='cell';
if(board[i]){c.classList.add('filled',board[i]==='X'?'x':'o');c.textContent=board[i]==='X'?'🅇':'⭕';}
if(w&&w.line.includes(i))c.classList.add('win');
c.onclick=()=>play(i);el.appendChild(c);}
document.getElementById('sx').textContent=score.x;document.getElementById('so').textContent=score.o;document.getElementById('sd').textContent=score.d;
}

function finish(w){
gameOver=true;
if(w.p==='D'){score.d++;setStatus('تعادل 🤝');}
else if(w.p==='X'){score.x++;setStatus(mode==='ai'?'فزت! 🅇 🎉':'فاز اللاعب 🅇');}
else{score.o++;setStatus(mode==='ai'?'الكمبيوتر فاز ⭕ 🤖':'فاز اللاعب ⭕');}
render();
}

function play(i){
if(gameOver||board[i])return;
if(mode==='ai'&&turn==='O')return;
board[i]=turn;const w=winner(board);
if(w)return finish(w);
turn=turn==='X'?'O':'X';
render();
if(mode==='ai'&&turn==='O'&&!gameOver){setStatus('يفكر الكمبيوتر 🤖...');setTimeout(aiMove,450);}
else setStatus(turn==='X'?'دورك 🅇':'دور اللاعب ⭕');
}

function aiMove(){
if(gameOver)return;
const mv=bestMove();if(mv<0)return;
board[mv]='O';const w=winner(board);
if(w)return finish(w);
turn='X';render();setStatus('دورك 🅇');
}

function bestMove(){
for(let i=0;i<9;i++){if(!board[i]){board[i]='O';const w=winner(board);board[i]='';if(w&&w.p==='O')return i;}}
for(let i=0;i<9;i++){if(!board[i]){board[i]='X';const w=winner(board);board[i]='';if(w&&w.p==='X')return i;}}
if(!board[4])return 4;
const corners=[0,2,6,8].filter(i=>!board[i]);
if(corners.length)return corners[Math.floor(Math.random()*corners.length)];
const empty=board.map((v,i)=>v?-1:i).filter(i=>i>=0);
return empty.length?empty[Math.floor(Math.random()*empty.length)]:-1;
}
resetRound();
</script>
</body>
</html>`;

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `xo_${Date.now()}.html`);
    fs.writeFileSync(filePath, HTML_TEMPLATE);
    const fileBuffer = fs.readFileSync(filePath);

    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'text/html',
      fileName: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓_X-O.html',
      caption: `🅇 *𝑺𝒂𝒍𝒆𝒗𝒆𝒓 X-O* ⭕ ✨\n\n🎮 اكس او تفاعلي\n🤖 ضد الكمبيوتر أو 👥 لاعبين\n🏆 عدادة نقاط + خط الفوز\n🌿 تم تطويره بواسطة svcp • فضه 🅇`,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        externalAdReply: {
          title: "🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 X-O ⭕",
          body: "اكس او تفاعلي • فضه ✨",
          thumbnailUrl: await getXAsset(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    fs.unlinkSync(filePath);
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });

  } catch (err) {
    console.error('[xo]', err);
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || err}`);
  }
};

test.usage = ["xo", "اكس او", "tictactoe"];
test.command = ["xo", "اكس او", "tictactoe", "ttt", "اكس-او"];
test.category = "game";
export default test;
