/* ========== AI Chat (Gemini) - 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 Style ========== */
import fs from "fs";
import path from "path";
import { getCalmResponse, getXAsset } from "../../system/utils.js";

const HTML_TEMPLATE = `<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>𝑺𝒂𝒍𝒆𝒗𝒆𝒓 AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{background:linear-gradient(145deg,#161616,#0c0c0c);color:#e8e8e8;padding:10px 0;display:flex;justify-content:center;align-items:center;height:100vh}
.card{
  width:100%;max-width:500px;margin:auto;
  background:linear-gradient(145deg,#161616,#0c0c0c);
  border:2px solid #4a4a4a;border-radius:22px;padding:14px;
  display:flex;flex-direction:column;gap:14px;
  box-shadow:0 10px 40px rgba(0,0,0,.9);
  height:96vh;min-height:720px;
  overflow:hidden
}
.header-box{display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,.4);padding:12px 16px;border-radius:14px;border:1px solid rgba(192,192,192,.2)}
.title{font-size:18px;font-weight:900;letter-spacing:1px;background:linear-gradient(135deg,#f0f0f0,#c0c0c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.status-turn{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:bold;color:#c0c0c0}
.indicator{width:10px;height:10px;border-radius:50%;background:#c0c0c0;box-shadow:0 0 8px #c0c0c0;position:relative}
.indicator.think::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:1.5px solid #c0c0c0;animation:ring 1.1s ease-out infinite}
@keyframes ring{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.3);opacity:0}}

#chat-box{
  flex:1;min-height:500px;
  overflow-y:auto;background:rgba(0,0,0,.45);
  border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:16px;
  border:1px solid #3a3a3a;
}
#chat-box::-webkit-scrollbar{width:4px}
#chat-box::-webkit-scrollbar-thumb{background:#4a4a4a;border-radius:10px}

.msg{padding:14px 18px;border-radius:18px;max-width:90%;line-height:1.8;font-size:14.5px;white-space:pre-wrap;word-wrap:break-word;animation:pop .2s}
@keyframes pop{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
.user{align-self:flex-end;background:linear-gradient(135deg,#c0c0c0,#ececec);color:#0c0c0c;font-weight:700;border-bottom-right-radius:5px}
.ai{align-self:flex-start;background:#1f1f1f;border:1px solid #4a4a4a;color:#e8e8e8;border-bottom-left-radius:5px}
.think{opacity:.7}

.input-area{display:flex;gap:10px;background:rgba(0,0,0,.55);padding:14px;border-radius:14px;border:1.5px solid #4a4a4a;margin-top:4px}
#user-input{flex:1;background:transparent;border:none;color:#fff;outline:none;font-size:15px}
#send-btn{background:linear-gradient(135deg,#d4d4d4,#c0c0c0);border:none;border-radius:10px;color:#0c0c0c;padding:11px 22px;font-weight:900;cursor:pointer}
#send-btn:disabled{opacity:.4}
.footer{font-size:10px;color:#8a8a8a;text-align:center;letter-spacing:1px}
</style>
</head>
<body>
<div class="card">
    <div class="header-box">
        <div class="title">🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 AI 🅇</div>
        <div class="status-turn"><span class="indicator" id="indicator"></span><span id="status-text">جاهز</span></div>
    </div>

    <div id="chat-box">
        <div class="msg ai">مرحبا بيك في 𝑺𝒂𝒍𝒆𝒗𝑒𝑟 AI ✨

انا خدام بـ Gemini 2.5 Flash الحقيقي
سولني اللي بغيتي وغنجاوبك دابا، بلا اخطاء. 🌿</div>
    </div>

    <div class="input-area">
        <input type="text" id="user-input" placeholder="كتب سؤالك هنا..." autocomplete="off" />
        <button id="send-btn">ارسال</button>
    </div>
    <div class="footer">Ⓢ ⑇ 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 AI | BY svcp | Powered by Gemini</div>
</div>

<script>
(function(){
const chatBox=document.getElementById('chat-box');
const userInput=document.getElementById('user-input');
const sendBtn=document.getElementById('send-btn');
const statusText=document.getElementById('status-text');
const indicator=document.getElementById('indicator');
let history=[{role:"system", content:"أنت 𝑺𝒂𝒍𝒆𝒗𝑒𝑟 AI، مساعد ذكي هادئ ومفيد، جاوب بالعربية أو الدارجة بطريقة مباشرة وسلمية."}];

function addMessage(text, type){
    const msg=document.createElement('div');
    msg.className='msg '+type;
    msg.textContent=text;
    chatBox.appendChild(msg);
    chatBox.scrollTop=chatBox.scrollHeight;
    return msg;
}

async function getGeminiReply(prompt){
    const jsRes = await fetch('https://aisure.uk/assets/index-oEfnSo1c.js');
    const jsText = await jsRes.text();
    const anonKey = jsText.match(/(eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+)/)[1];
    const supabaseUrl = jsText.match(/https:\\/\\/[a-z]+\\.supabase\\.co/)[0];

    const rand = Math.floor(Math.random()*9999999);
    const email = 'user'+rand+'@gmail.com';
    const pass = 'Pass'+rand+'!';

    const signUp = await fetch(supabaseUrl+'/auth/v1/signup',{
        method:'POST',
        headers:{
            'apikey': anonKey,
            'Authorization': 'Bearer '+anonKey,
            'Content-Type':'application/json',
            'Origin':'https://aisure.uk'
        },
        body: JSON.stringify({email,password:pass})
    });
    const signData = await signUp.json();
    const token = signData.access_token;
    if(!token) throw new Error('فشل التسجيل');

    history.push({role:"user", content: prompt});

    const aiRes = await fetch(supabaseUrl+'/functions/v1/chat',{
        method:'POST',
        headers:{
            'apikey': anonKey,
            'Authorization': 'Bearer '+token,
            'Content-Type':'application/json',
            'Origin':'https://aisure.uk'
        },
        body: JSON.stringify({
            model:"google/gemini-2.5-flash",
            messages: history,
            stream: true
        })
    });

    const reader = aiRes.body.getReader();
    const decoder = new TextDecoder();
    let full="";
    let buffer="";

    while(true){
        const {done, value} = await reader.read();
        if(done) break;
        buffer += decoder.decode(value,{stream:true});
        let lines = buffer.split('\\n');
        buffer = lines.pop();
        for(let line of lines){
            if(line.startsWith('data: ')){
                let dataStr = line.replace('data: ','').trim();
                if(dataStr==='[DONE]') continue;
                try{
                    let json = JSON.parse(dataStr);
                    let delta = json.choices?.[0]?.delta?.content || "";
                    if(delta){
                        full+=delta;
                    }
                }catch(e){}
            }
        }
    }
    if(full) history.push({role:"assistant", content: full});
    return full || "ماجانيش الرد، عاود جرب";
}

async function sendMessage(){
    const text=userInput.value.trim();
    if(!text) return;
    addMessage(text,'user');
    userInput.value='';
    sendBtn.disabled=true;
    indicator.classList.add('think');
    statusText.textContent='يفكر...';
    const thinkMsg=addMessage('▌ جاري التفكير... 🅇','ai think');

    try{
        const reply = await getGeminiReply(text);
        thinkMsg.textContent=reply;
        thinkMsg.classList.remove('think');
    }catch(e){
        thinkMsg.textContent='🅇 خطأ: '+e.message+'\\nعاود جرب دابا';
    }
    sendBtn.disabled=false;
    indicator.classList.remove('think');
    statusText.textContent='جاهز';
    userInput.focus();
}

sendBtn.onclick=sendMessage;
userInput.onkeypress=e=>{if(e.key==='Enter') sendMessage()};
})();
</script>
</body>
</html>`;

const test = async (m, { conn }) => {
  const waitMsg = await m.reply(await getCalmResponse('thinking'));

  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `aichat_${Date.now()}.html`);
    fs.writeFileSync(filePath, HTML_TEMPLATE);
    const fileBuffer = fs.readFileSync(filePath);

    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'text/html',
      fileName: '𝑺𝒂𝒍𝒆𝒗𝒆𝒓_AI.html',
      caption: `🅇 *𝑺𝒂𝒍𝒆𝒗𝒆𝒓 AI* 🅇 ✨\n\n🤖 محادثة ذكاء اصطناعي حقيقية (Gemini 2.5 Flash)\n✨ افتح الملف في المتصفح واسأل أي شيء\n🌿 هادئ ومباشر • تم تطويره بواسطة svcp • فضه 🅇`,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        externalAdReply: {
          title: "🅇 𝑺𝒂𝒍𝒆𝒗𝒆𝒓 AI 🅇",
          body: "محادثة ذكاء اصطناعي • فضه ✨",
          thumbnailUrl: await getXAsset(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    fs.unlinkSync(filePath);
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: waitMsg.key.id, fromMe: true } });

  } catch (err) {
    console.error('[aichat]', err);
    await m.reply(`${await getCalmResponse('error')}\n\n🔍 ${err?.message || err}`);
  }
};

test.usage = ["ai", "ذكاء", "salever"];
test.command = ["ai", "ذكاء", "salever", "chat", "شات"];
test.category = "ai";
export default test;
