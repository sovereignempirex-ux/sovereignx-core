/* ========== Interactive Chess - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import fs from "fs";
import path from "path";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Chess</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
body{background:linear-gradient(145deg,#1a1a1a,#2e2e2e);font-family:Arial,sans-serif;color:#e8e8e8;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:15px;}
.title{font-size:24px;font-weight:bold;text-align:center;margin-bottom:5px;text-shadow:0 2px 4px rgba(0,0,0,0.6);}
.subtitle{font-size:13px;color:rgba(232,232,232,0.7);text-align:center;margin-bottom:15px;}
.board-container{position:relative;width:90vw;max-width:450px;aspect-ratio:1/1;}
.board{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:100%;height:100%;border:4px solid #c0c0c0;border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.7);}
.square{display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,36px);cursor:pointer;position:relative;transition:background 0.15s;user-select:none;}
.light{background:#dcdcdc;}
.dark{background:#8b8b8b;}
.selected{background:rgba(53,224,255,.55) !important;box-shadow:inset 0 0 0 3px #35e0ff;}
.movable{background:rgba(0,190,90,0.45) !important;}
.check{background:rgba(255,40,40,0.55) !important;}
.last-move{background:rgba(255,215,0,0.35) !important;}
.piece{pointer-events:none;text-shadow:0 2px 4px rgba(0,0,0,0.35);}
.status-bar{display:flex;justify-content:space-between;align-items:center;width:90vw;max-width:450px;margin-top:12px;background:rgba(0,0,0,0.5);padding:10px 15px;border-radius:10px;font-size:14px;border:1px solid #4a4a4a;}
.turn-indicator{display:flex;align-items:center;gap:8px;font-weight:bold;}
.turn-dot{width:14px;height:14px;border-radius:50%;box-shadow:0 0 8px currentColor;}
.white-turn{background:#fff;color:#fff;}
.black-turn{background:#333;color:#333;border:1px solid #777;}
.controls{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;justify-content:center;}
.btn{background:linear-gradient(135deg,#d4d4d4,#a8a8a8);border:none;color:#111;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;transition:transform 0.1s,opacity 0.2s;}
.btn:hover{opacity:0.9;}
.btn:active{transform:scale(0.95);}
.btn.secondary{background:linear-gradient(135deg,#555,#444);color:#e8e8e8;}
.captured{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;margin-top:10px;min-height:30px;font-size:22px;}
.footer{font-size:11px;color:rgba(232,232,232,0.5);margin-top:15px;text-align:center;}
#promo-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center;}
#promo-overlay.show{display:flex;}
.promo-box{background:#242424;border:3px solid #c0c0c0;border-radius:16px;padding:20px;text-align:center;}
.promo-box h3{margin-bottom:15px;font-size:18px;}
.promo-pieces{display:flex;gap:12px;justify-content:center;}
.promo-pieces button{font-size:40px;background:#333;border:2px solid #666;border-radius:10px;padding:10px 15px;cursor:pointer;transition:transform 0.1s;color:#e8e8e8;}
.promo-pieces button:hover{transform:scale(1.15);border-color:#35e0ff;}
</style>
</head>
<body>
<div class="title">♟️ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Chess</div>
<div class="subtitle">شطرنج تفاعلي • ضد صديق • فضه 🅇</div>
<div class="board-container"><div class="board" id="board"></div></div>
<div class="status-bar">
<div class="turn-indicator"><div class="turn-dot white-turn" id="turn-dot"></div><span id="status">دور الأبيض ⬜</span></div>
<div id="move-count">النقلات: 0</div>
</div>
<div class="captured" id="captured"></div>
<div class="controls">
<button class="btn secondary" onclick="undoMove()">↩️ تراجع</button>
<button class="btn secondary" onclick="resetGame()">🔄 إعادة</button>
</div>
<div id="promo-overlay"><div class="promo-box"><h3>اختر القطعة</h3><div class="promo-pieces" id="promo-pieces"></div></div></div>
<div class="footer">♟️ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Chess • by svcp • فضه ✨</div>
<script>
const PIECES={w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}};
let board,turn,selected,history,captured,lastMove,gameOver,moves,promoteSquare;

function initialBoard(){
const b=Array(8).fill(null).map(()=>Array(8).fill(null));
const back=['r','n','b','q','k','b','n','r'];
for(let i=0;i<8;i++){b[0][i]={t:back[i],c:'b'};b[1][i]={t:'p',c:'b'};b[6][i]={t:'p',c:'w'};b[7][i]={t:back[i],c:'w'};}
return b;
}
function cloneBoard(b){return b.map(r=>r.map(c=>c?{...c}:null));}
function resetGame(){board=initialBoard();turn='w';selected=null;history=[];captured={w:[],b:[]};lastMove=null;gameOver=false;moves=0;promoteSquare=null;render();checkGameState();}

function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function getMoves(r,c){
const p=board[r][c];if(!p||p.c!==turn)return[];
const ms=[];
const add=(nr,nc)=>{if(!inBounds(nr,nc))return false;const t=board[nr][nc];if(!t){ms.push([nr,nc]);return true;}if(t.c!==p.c){ms.push([nr,nc]);}return false;};
if(p.t==='p'){const d=p.c==='w'?-1:1;const start=p.c==='w'?6:1;
if(inBounds(r+d,c)&&!board[r+d][c]){ms.push([r+d,c]);if(r===start&&inBounds(r+2*d,c)&&!board[r+2*d][c])ms.push([r+2*d,c]);}
for(const dc of[-1,1]){const nr=r+d,nc=c+dc;if(inBounds(nr,nc)&&board[nr][nc]&&board[nr][nc].c!==p.c)ms.push([nr,nc]);}}
if(p.t==='n'){for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc);}
if(p.t==='b'||p.t==='r'||p.t==='q'){const dirs=[];
if(p.t==='b'||p.t==='q')dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
if(p.t==='r'||p.t==='q')dirs.push([-1,0],[1,0],[0,-1],[0,1]);
for(const[dr,dc]of dirs){let nr=r+dr,nc=c+dc;while(inBounds(nr,nc)){if(!add(nr,nc))break;nr+=dr;nc+=dc;}}}
if(p.t==='k'){for(const[dr,dc]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])add(r+dr,c+dc);}
return ms;
}

function isAttacked(r,c,byColor){
for(let i=0;i<8;i++)for(let j=0;j<8;j++){const p=board[i][j];if(!p||p.c!==byColor)continue;
if(p.t==='p'){const d=p.c==='w'?-1:1;if(r===i+d&&Math.abs(c-j)===1)return true;}
if(p.t==='n'){if(Math.abs(r-i)===2&&Math.abs(c-j)===1||Math.abs(r-i)===1&&Math.abs(c-j)===2)return true;}
if(p.t==='k'){if(Math.abs(r-i)<=1&&Math.abs(c-j)<=1)return true;}
if(p.t==='b'||p.t==='q'){if(Math.abs(r-i)===Math.abs(c-j)&&Math.abs(r-i)>0){let dr=Math.sign(r-i),dc=Math.sign(c-j),ok=true;let nr=i+dr,nc=j+dc;while(nr!==r||nc!==c){if(board[nr][nc]){ok=false;break;}nr+=dr;nc+=dc;}if(ok)return true;}}
if(p.t==='r'||p.t==='q'){if(r===i||c===j){let dr=Math.sign(r-i),dc=Math.sign(c-j),ok=true;let nr=i+dr,nc=j+dc;while(nr!==r||nc!==c){if(board[nr][nc]){ok=false;break;}nr+=dr;nc+=dc;}if(ok)return true;}}}
return false;
}
function findKing(color){for(let i=0;i<8;i++)for(let j=0;j<8;j++){const p=board[i][j];if(p&&p.t==='k'&&p.c===color)return[i,j];}return null;}

function makeMove(fr,fc,tr,tc){
const p=board[fr][fc];const cap=board[tr][tc];
history.push({board:cloneBoard(board),turn,lastMove,captured:{w:[...captured.w],b:[...captured.b]},moves});
if(cap){captured[p.c].push(cap.t);}
board[tr][tc]={...p};board[fr][fc]=null;
if(p.t==='p'&&(tr===0||tr===7)){promoteSquare=[tr,tc];showPromo(p.c);return;}
lastMove=[fr,fc,tr,tc];turn=turn==='w'?'b':'w';moves++;render();checkGameState();
}

function showPromo(color){
const overlay=document.getElementById('promo-overlay');const container=document.getElementById('promo-pieces');
container.innerHTML='';
for(const t of['q','r','b','n']){const btn=document.createElement('button');btn.textContent=PIECES[color][t];btn.onclick=()=>{const rc=promoteSquare;board[rc[0]][rc[1]]={t,c:color};overlay.classList.remove('show');promoteSquare=null;lastMove=[rc[0],rc[1],rc[0],rc[1]];turn=turn==='w'?'b':'w';moves++;render();checkGameState();};container.appendChild(btn);}
overlay.classList.add('show');
}

function hasLegalMoves(color){
for(let i=0;i<8;i++)for(let j=0;j<8;j++){const p=board[i][j];if(!p||p.c!==color)continue;
const oldTurn=turn;turn=color;const ms=getMoves(i,j);turn=oldTurn;
for(const[mr,mc]of ms){const src=board[i][j],dst=board[mr][mc];board[mr][mc]=src;board[i][j]=null;
const k=findKing(color);const inCheck=k&&isAttacked(k[0],k[1],color==='w'?'b':'w');board[i][j]=src;board[mr][mc]=dst;
if(!inCheck)return true;}}
return false;
}

function checkGameState(){
if(gameOver)return;
const k=findKing(turn);const inCheck=k&&isAttacked(k[0],k[1],turn==='w'?'b':'w');
const hasMoves=hasLegalMoves(turn);
if(!hasMoves){gameOver=true;
if(inCheck){document.getElementById('status').textContent=(turn==='w'?'⬜ الأبيض':'⬛ الأسود')+' كش مات! ♚';}
else{document.getElementById('status').textContent='تعادل - لا نقلات! 🤝';}
}else if(inCheck){document.getElementById('status').textContent=(turn==='w'?'⬜ الأبيض':'⬛ الأسود')+' في كش! ⚠️';}
else{document.getElementById('status').textContent=turn==='w'?'دور الأبيض ⬜':'دور الأسود ⬛';}
document.getElementById('move-count').textContent='النقلات: '+moves;
}

function undoMove(){if(!history.length||promoteSquare)return;const h=history.pop();board=h.board;turn=h.turn;lastMove=h.lastMove;captured.w=h.captured.w;captured.b=h.captured.b;gameOver=false;moves=h.moves;render();checkGameState();if(gameOver)gameOver=false;}
function render(){
const el=document.getElementById('board');el.innerHTML='';
const k=findKing(turn);const inCheck=!gameOver&&k&&isAttacked(k[0],k[1],turn==='w'?'b':'w');
const movesSel=selected?getMoves(selected[0],selected[1]):[];
for(let r=0;r<8;r++)for(let c=0;c<8;c++){
const sq=document.createElement('div');sq.className='square '+((r+c)%2===0?'light':'dark');
if(selected&&selected[0]===r&&selected[1]===c)sq.classList.add('selected');
if(lastMove&&(lastMove[0]===r&&lastMove[1]===c||lastMove[2]===r&&lastMove[3]===c))sq.classList.add('last-move');
if(inCheck&&k&&k[0]===r&&k[1]===c)sq.classList.add('check');
if(movesSel.some(([mr,mc])=>mr===r&&mc===c))sq.classList.add('movable');
const p=board[r][c];if(p){const span=document.createElement('span');span.className='piece';span.textContent=PIECES[p.c][p.t];sq.appendChild(span);}
sq.onclick=()=>onSquare(r,c);el.appendChild(sq);}
const cap=document.getElementById('captured');const wp=captured.w.map(t=>PIECES.b[t]).join('');const bp=captured.b.map(t=>PIECES.w[t]).join('');
cap.innerHTML=(wp?'⬜ '+wp+' ':'')+(bp?'⬛ '+bp:'');
}

function onSquare(r,c){
if(gameOver||promoteSquare)return;
const p=board[r][c];
if(selected){
const ms=getMoves(selected[0],selected[1]);
if(ms.some(([mr,mc])=>mr===r&&mc===c)){makeMove(selected[0],selected[1],r,c);selected=null;return;}
if(p&&p.c===turn){selected=[r,c];render();return;}
selected=null;render();return;
}
if(p&&p.c===turn){selected=[r,c];render();}
}
resetGame();
</script>
</body>
</html>`;

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `chess_${Date.now()}.html`);
    fs.writeFileSync(filePath, HTML_TEMPLATE);
    const fileBuffer = fs.readFileSync(filePath);

    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'text/html',
      fileName: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓_Chess.html',
      caption: `♟️ *𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Chess* ✨\n\n🎮 شطرنج تفاعلي كامل\n♟️ قوانين صحيحة + كش/مات + ترقية بيدق\n↩️ تراجع + 🔄 إعادة\n🌿 تم تطويره بواسطة svcp • فضه 🅇`,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        externalAdReply: {
          title: "♟️ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Chess",
          body: "شطرنج تفاعلي • فضه ✨",
          thumbnailUrl: await getXAsset(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    fs.unlinkSync(filePath);
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });

  } catch (err) {
    console.error('[chess]', err);
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || err}`);
  }
};

test.usage = ["chess", "شطرنج"];
test.command = ["chess", "شطرنج"];
test.category = "game";
export default test;
