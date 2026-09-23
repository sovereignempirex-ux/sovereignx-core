/* ========== JavaScript Evaluator - 𝑺𝒶𝓁𝑒𝓋𝑒𝓇 Style ========== */
import syntaxerror from 'syntax-error';
import { format } from 'util';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getCalmResponse } from "../../system/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] === 'number') return super(Math.min(args[0], 10000));
    return super(...args);
  }
}

const test = async (m, { conn, args, usedPrefix, noPrefix, isOwner }) => {
  if (!isOwner) return;

  const name = conn.getName?.(m.sender) || 'Owner';
  let _return;
  let _syntax = '';
  
  const _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix;

  try {
    let i = 15;
    const f = { exports: {} };
    const exec = new (async () => {}).constructor(
      'print', 'm', 'handler', 'require', 'conn', 'Array', 'process', 'args', 'groupMetadata', 'module', 'exports', 'argument', _text
    );
    _return = await exec.call(conn, (...args) => {
      if (--i < 1) return;
      console.log(...args);
      return m.reply(format(...args));
    }, m, test, require, conn, CustomArray, process, args, m.groupMetadata, f, f.exports, [conn, { conn, usedPrefix, noPrefix, args, groupMetadata: m.groupMetadata }]);
  } catch (e) {
    const err = syntaxerror(_text, 'Execution Function', { allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, sourceType: 'module' });
    if (err) _syntax = '```' + err + '```\n\n';
    _return = e;
  } finally {
    const output = _syntax + format(_return);
    if (output.length > 4096) {
      const fileName = `eval_${Date.now()}.txt`;
      await conn.sendMessage(m.chat, { document: Buffer.from(output), fileName, mimetype: 'text/plain' }, { quoted: m });
    } else {
      await m.reply(output);
    }
  }
};

test.customPrefix = /=?>|~/;
test.command = /(?:)/i;
test.category = "owner";
test.usage = ["> <code>", "=> <code>"];
export default test;