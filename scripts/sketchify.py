"""Turn a photo crop into a pencil-sketch line layer (DoG edges) that lines up 1:1 with the colour crop.

python3 scripts/sketchify.py <photo> <out-prefix> <x0> <y0> <x1> <y1> <out-w> <out-h>
Writes <out-prefix>-crop.jpg (colour) and <out-prefix>-sketch.png (white lines on transparent).
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

src, prefix = sys.argv[1], sys.argv[2]
x0, y0, x1, y1, ow, oh = map(int, sys.argv[3:9])
im = Image.open(src).convert('RGB').crop((x0, y0, x1, y1)).resize((ow, oh), Image.LANCZOS)
im.save(prefix + '-crop.jpg', quality=90)

g = np.asarray(im.convert('L'), dtype=np.float32) / 255.0
g = gaussian_filter(g, 0.8)


def edges(sigma, thr, gain):
    d = gaussian_filter(g, sigma) - gaussian_filter(g, sigma * 1.6)
    return np.clip((-d - thr) * gain, 0, 1)


fine = edges(1.1, 0.006, 70)
bold = edges(2.6, 0.010, 45)
lines = np.maximum(fine * 0.85, bold)
lines = np.where(lines < 0.12, 0, lines)
lines = gaussian_filter(lines, 0.5)
alpha = (np.clip(lines * 1.25, 0, 1) * 255).astype(np.uint8)
rgba = np.zeros((oh, ow, 4), dtype=np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = alpha
Image.fromarray(rgba, 'RGBA').save(prefix + '-sketch.png', optimize=True)
print('ok', prefix, round(float(alpha.mean()), 2))
