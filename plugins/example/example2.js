const example = async (m, { conn }) => {

await conn.sendButton(m.chat, {
  imageUrl: "https://i.postimg.cc/g0962vhb/I.jpg",
  bodyText: "Hello! This is the message text",
  footerText: "Footer text",
  buttons: [
    // 1. Quick Reply
    { name: "quick_reply", params: { display_text: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿", id: "🫦" } },
    { name: "quick_reply", params: { display_text: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿", id: "🍻" } },
    
    // 2. URL Button
    { name: "cta_url", params: { display_text: "🔗 Google Link", url: "https://animeplay306-dev.github.io/noho-website" } },
    
    // 3. Call Button
    { name: "cta_call", params: { display_text: "📞 Call Support", phone_number: "201271606283" } },
    
    // 4. Copy Button
    { name: "cta_copy", params: { display_text: "📋 Copy Code", copy_code: "𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿" } },
    
    // 5. Single Select Menu
    { name: "single_select", params: { 
      title: "📋 Choose Option",
      sections: [{
        title: "Menu",
        rows: [
          { title: "Option 1", description: "🫦", id: ".اوامر" },
          { title: "Option 2", description: "🍻", id: ".مطوب" }
        ]
      }]
    }},
    
    // 6. Call Permission Request
    { name: "call_permission_request", params: { 
      display_text: "📞 Request Call",
      phone_number: "201271606283",
      duration: 60
    }}
  ],
  mentions: [m.sender],
  newsletter: {
      name: '𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿',
      jid: '120363409792989178@newsletter'
    },
  interactiveConfig: {
    buttons_limits: 10,
    list_title: "Available Options",
    button_title: "Click Here",
    canonical_url: "https://example.com"
  }
}, m);


};
example.usage = ["تست2"]
example.category = "example";
example.command = ["تست2"]
export default example;
