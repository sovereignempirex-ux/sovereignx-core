/* ========== Interactive Piano - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import fs from "fs";
import path from "path";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Piano</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;background:linear-gradient(135deg,#1c1c1c,#3a3a3a);font-family:Arial,sans-serif;overflow-x:hidden;min-height:100vh;}
body{padding:20px 0;display:flex;flex-direction:column;align-items:center;}
.title{text-align:center;color:white;font-size:24px;font-weight:bold;margin-bottom:5px;text-shadow:0 2px 4px rgba(0,0,0,0.3);}
.sub{text-align:center;color:rgba(255,255,255,0.9);font-size:14px;margin:0 0 20px;}
.piano-wrap{width:100%;padding:0 12px;max-width:500px;}
.piano{position:relative;width:100%;height:52vw;max-height:260px;min-height:170px;display:flex;touch-action:none;}
.white{position:relative;width:12.5%;flex:1 1 12.5%;height:100%;padding:0;margin:0;background:#fff;border:1px solid #222;border-radius:0 0 8px 8px;color:#222;font-size:11px;font-weight:bold;display:flex;align-items:flex-end;justify-content:center;padding-bottom:14px;box-shadow:0 5px 0 #aaa;z-index:1;transition:all 0.05s;}
.white:first-child{border-radius:10px 0 0 10px;}
.white:last-child{border-radius:0 10px 10px 0;}
.white:active,.white.active{background:#e8e8e8;transform:translateY(5px);box-shadow:0 1px 0 #888;}
.black{position:absolute;top:0;width:9%;height:58%;padding:0;margin:0;background:linear-gradient(90deg,#111,#333,#050505);border:2px solid #000;border-radius:0 0 6px 6px;color:white;font-size:9px;font-weight:bold;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;box-shadow:0 6px 5px rgba(0,0,0,.5);z-index:5;transition:all 0.05s;}
.black:active,.black.active{background:#555;transform:translateY(4px);box-shadow:0 2px 3px rgba(0,0,0,.5);}
.b1{left:7.8%}.b2{left:20.3%}.b3{left:45.3%}.b4{left:57.8%}.b5{left:70.3%}
#note{text-align:center;color:white;font-size:20px;font-weight:bold;margin-top:20px;text-shadow:0 2px 4px rgba(0,0,0,0.3);min-height:30px;}
.footer{text-align:center;color:rgba(255,255,255,0.7);font-size:12px;margin-top:20px;padding:0 10px;}
.key-hint{display:flex;justify-content:center;gap:8px;margin:15px 0;flex-wrap:wrap;}
.key-hint span{background:rgba(255,255,255,0.2);padding:4px 10px;border-radius:20px;font-size:11px;color:white;}
</style>
</head>
<body>
<div class="title">🎹 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Piano</div>
<div class="sub">Do - Re - Mi - Fa - Sol - La - Si - Do</div>
<div class="key-hint">
<span>Do</span><span>Re</span><span>Mi</span><span>Fa</span><span>Sol</span><span>La</span><span>Si</span><span>Do</span>
</div>
<div class="piano-wrap">
<div class="piano">
<button class="white" data-freq="261.63" data-name="Do">Do</button>
<button class="white" data-freq="293.66" data-name="Re">Re</button>
<button class="white" data-freq="329.63" data-name="Mi">Mi</button>
<button class="white" data-freq="349.23" data-name="Fa">Fa</button>
<button class="white" data-freq="392.00" data-name="Sol">Sol</button>
<button class="white" data-freq="440.00" data-name="La">La</button>
<button class="white" data-freq="493.88" data-name="Si">Si</button>
<button class="white" data-freq="523.25" data-name="Do">Do</button>
<button class="black b1" data-freq="277.18" data-name="Do#">Do#</button>
<button class="black b2" data-freq="311.13" data-name="Re#">Re#</button>
<button class="black b3" data-freq="369.99" data-name="Fa#">Fa#</button>
<button class="black b4" data-freq="415.30" data-name="Sol#">Sol#</button>
<button class="black b5" data-freq="466.16" data-name="La#">La#</button>
</div>
</div>
<div id="note">🎵 اضغط على المفاتيح للعزف</div>
<div class="footer">🎹 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Piano • يعمل باللمس والفأرة</div>
<script>
let audioContext=null;
function initAudio(){
if(!audioContext){
const AudioContext=window.AudioContext||window.webkitAudioContext;
if(!AudioContext){document.getElementById('note').textContent='المتصفح لا يدعم الصوت';return null;}
audioContext=new AudioContext();
}
if(audioContext.state==='suspended'){audioContext.resume();}
return audioContext;
}
function playPiano(freq){
const ctx=initAudio();if(!ctx)return;
const now=ctx.currentTime;
const master=ctx.createGain();
master.gain.setValueAtTime(0,now);
master.gain.linearRampToValueAtTime(0.5,now+0.015);
master.gain.exponentialRampToValueAtTime(0.001,now+1.2);
master.connect(ctx.destination);
const osc1=ctx.createOscillator();const osc2=ctx.createOscillator();const osc3=ctx.createOscillator();
const gain1=ctx.createGain();const gain2=ctx.createGain();const gain3=ctx.createGain();
osc1.type='triangle';osc2.type='sine';osc3.type='sine';
osc1.frequency.value=freq;osc2.frequency.value=freq*2;osc3.frequency.value=freq*3;
gain1.gain.value=1;gain2.gain.value=.22;gain3.gain.value=.08;
osc1.connect(gain1);osc2.connect(gain2);osc3.connect(gain3);
gain1.connect(master);gain2.connect(master);gain3.connect(master);
osc1.start(now);osc2.start(now);osc3.start(now);
osc1.stop(now+1.3);osc2.stop(now+1.3);osc3.stop(now+1.3);
}
document.querySelectorAll('.white,.black').forEach(function(key){
function press(e){e.preventDefault();key.classList.add('active');document.getElementById('note').textContent='🎵 ' + key.dataset.name;playPiano(parseFloat(key.dataset.freq));}
function release(){key.classList.remove('active');document.getElementById('note').textContent='🎵 اضغط على المفاتيح للعزف';}
key.addEventListener('pointerdown',press);
key.addEventListener('pointerup',release);
key.addEventListener('pointercancel',release);
key.addEventListener('pointerleave',release);
key.addEventListener('touchstart',function(e){e.preventDefault();press(e);},{passive:false});
key.addEventListener('touchend',function(e){e.preventDefault();release();},{passive:false});
});
</script>
</body>
</html>`;

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));
  
  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    
    const fileName = `piano_${Date.now()}.html`;
    const filePath = path.join(tmpDir, fileName);
    
    fs.writeFileSync(filePath, HTML_TEMPLATE);
    
    const fileBuffer = fs.readFileSync(filePath);
    
    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'text/html',
      fileName: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓_Piano.html',
      caption: `🎹 *𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Piano*\n\n🎵 بيانو تفاعلي كامل\n✨ افتح الملف في المتصفح للعزف\n🎵 يدعم اللمس والفأرة\n🌿 تم تطويره بواسطة svcp`,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        externalAdReply: {
          title: "🎹 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Piano",
          body: "بيانو تفاعلي تفاعلي",
          thumbnailUrl: await getXAsset(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
    
    fs.unlinkSync(filePath);
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });
    
  } catch (err) {
    console.error('[piano]', err);
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || err}`);
  }
};

test.usage = ["piano", "بيانو"];
test.command = ["piano", "بيانو", "piano"];
test.category = "game";
export default test;