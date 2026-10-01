// Render QA stills: node scripts/stills.mjs <compId> <sec> [sec...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [compId, ...secs] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
for (const s of secs) {
  const frame = Math.round(parseFloat(s) * composition.fps);
  const output = path.resolve(`out/stills/${compId}-${String(s).replace('.', '_')}.jpg`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5});
  console.log('wrote', output);
}
