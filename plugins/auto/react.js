export default async function before(m, { conn , bot }) {
  const triggers = {
    "ڤينوم": ["🍻", "🫦", "🐦", "🐤", "🥃"],
    "سيلفير": ["🫦", "🍻", "🐦", "🐤", "🥃"]
  };

  const emojis = triggers[m.text];
  if (emojis) {
    const random = emojis[Math.floor(Math.random() * emojis.length)];
    m.react(random);
  }
  
  return false;
}
