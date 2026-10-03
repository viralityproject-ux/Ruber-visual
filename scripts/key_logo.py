"""Trim + key a logo on a white background into a transparent PNG.

Usage: python3 scripts/key_logo.py in.webp out.png
Alpha is derived from the distance to pure white so anti-aliased edges stay clean
and near-white boxes (JPEG/WebP noise, 250-255) become fully transparent.
"""
import sys

import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
dist = 255.0 - rgb.min(axis=2)  # 0 on white
lo, hi = 8.0, 60.0
alpha = np.clip((dist - lo) / (hi - lo), 0, 1)
ys, xs = np.where(alpha > 0.05)
pad = 12
y0, y1 = max(0, ys.min() - pad), min(rgb.shape[0], ys.max() + pad + 1)
x0, x1 = max(0, xs.min() - pad), min(rgb.shape[1], xs.max() + pad + 1)
a = alpha[y0:y1, x0:x1]
c = rgb[y0:y1, x0:x1]
# un-premultiply against white so edge pixels keep their true colour
safe = np.maximum(a, 1e-3)[..., None]
col = np.clip((c - 255.0 * (1 - a[..., None])) / safe, 0, 255)
out = np.dstack([col, a * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(dst, optimize=True)
print(dst, out.shape[1], 'x', out.shape[0])
