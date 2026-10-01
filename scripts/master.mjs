// Final audio master for a rendered MP4: peak limiter + two-pass loudness normalisation
// to -14 LUFS / -1 dBTP (social media target). The video stream is copied untouched.
// Usage: node scripts/master.mjs out/ruber-visual-16x9.mp4 out/ruber-visual-16x9-master.mp4
// Needs ffmpeg on PATH; if it is missing the step is skipped and the un-mastered render is kept.
import {spawnSync} from 'node:child_process';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/master.mjs <in.mp4> <out.mp4>');
  process.exit(1);
}

const probe = spawnSync('ffmpeg', ['-version'], {encoding: 'utf8'});
if (probe.error) {
  console.warn(`\nffmpeg tidak ditemukan, mastering dilewati. Video tetap bisa dipakai: ${input}`);
  console.warn('Install ffmpeg (Mac: brew install ffmpeg, Windows: winget install Gyan.FFmpeg) lalu jalankan ulang npm run master.\n');
  process.exit(0);
}

const pre = 'alimiter=limit=0.89:attack=3:release=60:level=false';
const target = 'I=-14:TP=-1:LRA=11';

const pass1 = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', input, '-af', `${pre},loudnorm=${target}:print_format=json`, '-f', 'null', '-'], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
const json = pass1.stderr.slice(pass1.stderr.lastIndexOf('{'), pass1.stderr.lastIndexOf('}') + 1);
const m = JSON.parse(json);

const filter = [
  pre,
  `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
  'aresample=48000',
].join(',');

const pass2 = spawnSync(
  'ffmpeg',
  ['-hide_banner', '-v', 'error', '-y', '-i', input, '-c:v', 'copy', '-af', filter, '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', output],
  {stdio: 'inherit'},
);
if (pass2.status !== 0) process.exit(pass2.status ?? 1);
console.log(`mastered -> ${output}`);
