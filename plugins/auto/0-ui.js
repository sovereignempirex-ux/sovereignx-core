/* ========== 𝑺𝒂𝒍𝒆𝒗𝒆𝓇 UI Hook ==========
 * خطّاف عام يُنفَّذ قبل أي أمر — يرقّي m.reply و conn.sendMessage
 * فتصبح كل الأوامر (159) ترسل بطاقات حديثة بأزرار nativeFlow.
 *
 * التسمية عمداً 0-ui.js ليُحمَّل أولاً بين خطّافات auto (ترتيب أبجدي).
 * يرجع false دائماً حتى لا يعترض تدفّق الأوامر.
 */
import { installUI } from '../../system/ui.js';

export default async function before(m, { conn }) {
  try {
    installUI(m, conn);
  } catch { /* لا نعترض أبداً */ }
  return false;
}
