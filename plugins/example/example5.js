const example = async (m, { conn }) => {

return await conn.sendButtonNormal(m.chat, {
  media: { url: 'https://files.catbox.moe/buq2ui.mp4' },
  mediaType: 'video', // or image
  caption: `hi, @${m.sender.split("@")[0]}`,
  buttons: [
// 1. Quick Reply
    { name: "quick_reply", params: { display_text: "👍 Quick Reply", id: "quick1" } },
    { name: "quick_reply", params: { display_text: "👎 Another Reply", id: "quick2" } },
    
    // 2. URL Button
    { name: "cta_url", params: { display_text: "🔗 Google Link", url: "https://google.com" } },
    
    // 3. Call Button
    { name: "cta_call", params: { display_text: "📞 Call Support", phone_number: "201283073813" } },
    
    // 4. Copy Button
    { name: "cta_copy", params: { display_text: "📋 Copy Code", copy_code: "ABC123XYZ" } },
    
    // 5. Single Select Menu
    { name: "single_select", params: { 
      title: "📋 Choose Option",
      sections: [{
        title: "Menu",
        rows: [
          { title: "Option 1", description: "Description 1", id: "opt1" },
          { title: "Option 2", description: "Description 2", id: "opt2" }
        ]
      }]
    }},
    
    // 6. Call Permission Request
    { name: "call_permission_request", params: { 
      display_text: "📞 Request Call",
      phone_number: "201283073813",
      duration: 60
    }}
  ], 
  mentions: [m.sender],
  newsletter: {
      name: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
      jid: '120363409792989178@newsletter'
    },
}, m)

};
example.usage = ["تست5"]
example.category = "example";
example.command = ["تست5"]
export default example;
