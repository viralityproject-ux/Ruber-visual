"""Replace the closing tagline of the soundtrack with a new VO take.

The supplied mix (revisi/inbox/audio/music.mp3) already contains the old VO. Its vocal stem
(vocal.mp3) is sample-aligned with the mix over the ending, so subtracting it leaves the clean
music bed; the new take (vo-ending-v3.mp3) is then level-matched to the old voice and laid at AT.

python3 scripts/swap_ending.py  →  public/audio/soundtrack-v2.mp3
"""
import os
import subprocess

import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), '..')
SR = 48000
CUT = 129.55  # old tagline starts at 129.77; the voice is silent here
AT = 130.0  # where the new take starts (2:10)


def load(path, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).copy()


mix = load(os.path.join(ROOT, 'revisi/inbox/audio/music.mp3'))
voc = load(os.path.join(ROOT, 'revisi/inbox/audio/vocal.mp3'))
new = load(os.path.join(ROOT, 'revisi/inbox/audio/vo-ending-v3.mp3'))
n = len(mix)
voc = np.pad(voc, ((0, max(0, n - len(voc))), (0, 0)))[:n]

# least-squares gain of the stem inside the mix over the old tagline
a, b = int(CUT * SR), n
g = float(np.sum(mix[a:b] * voc[a:b]) / (np.sum(voc[a:b] ** 2) + 1e-12))
ramp = np.clip((np.arange(n) - a) / (0.03 * SR), 0, 1)[:, None]
out = mix - g * voc * ramp


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)))


# match the new take's speech level to the old voice it replaces
old_speech = voc[int(129.77 * SR):int(133.4 * SR)]
old_speech = old_speech[np.abs(old_speech).max(axis=1) > 0.01]
new_speech = new[np.abs(new).max(axis=1) > 0.01]
k = rms(old_speech) / rms(new_speech)
i0 = int(AT * SR)
seg = new[: max(0, n - i0)] * k
out[i0:i0 + len(seg)] += seg

peak = float(np.max(np.abs(out)))
if peak > 0.98:
    out *= 0.98 / peak
tmp = os.path.join(ROOT, 'out', 'soundtrack-v2.f32')
os.makedirs(os.path.dirname(tmp), exist_ok=True)
out.astype(np.float32).tofile(tmp)
dst = os.path.join(ROOT, 'public/audio/soundtrack-v2.mp3')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '320k', dst], check=True)
os.remove(tmp)
print(f'stem gain {g:.3f}, new take gain {k:.2f} ({20 * np.log10(k):+.1f} dB), peak {peak:.2f} -> {dst}')
