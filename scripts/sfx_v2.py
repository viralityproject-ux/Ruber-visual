"""V2 sound design: synthesise every effect procedurally and lay them on the timeline as one stem.

Output: public/audio/sfx-v2.wav (48 kHz stereo). The cue sheet below follows the acts in src/acts/*.
Word cues come straight from src/data/vo2.ts, so the effects land on the same moments as the animation.
Tonal effects are tuned to G / C / D / F so they sit inside the music (C major / G minor).

Run: python3 scripts/sfx_v2.py
"""
import json
import os
import re
import wave

import numpy as np
from scipy.signal import butter, lfilter, sosfilt

SR = 48000
DUR = 134.92
ROOT = os.path.join(os.path.dirname(__file__), '..')
rng = np.random.default_rng(7)

# ----------------------------------------------------------------------------- VO cues
src = open(os.path.join(ROOT, 'src/data/vo2.ts'), encoding='utf8').read()
body = src[src.index('export const VO2'):]
body = body[body.index('= [') + 2: body.rindex(']') + 1]
body = re.sub(r'([{,]\s*)([a-z]+):', r'\1"\2":', body)
body = re.sub(r',\s*([\]}])', r'\1', body)
VO = json.loads(body)


def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())


def w(line, word, nth=0):
    hits = [x for x in VO[line]['words'] if norm(x['w']).startswith(norm(word))]
    return hits[nth]['s']


# ----------------------------------------------------------------------------- dsp helpers
def t_(dur):
    return np.arange(int(SR * dur)) / SR


def lp(x, fc, order=2):
    sos = butter(order, min(fc, SR * 0.45), 'low', fs=SR, output='sos')
    return sosfilt(sos, x)


def hp(x, fc, order=2):
    sos = butter(order, fc, 'high', fs=SR, output='sos')
    return sosfilt(sos, x)


def bp_sweep(x, fc, q=1.5, block=256):
    """Band-pass with a time-varying centre (processed in short blocks)."""
    y = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        f = float(np.clip(fc[min(i, len(fc) - 1)], 40, SR * 0.4))
        bw = f / q
        lo, hi = max(20, f - bw / 2), min(SR * 0.45, f + bw / 2)
        b, a = butter(2, [lo, hi], 'band', fs=SR)
        seg = x[i:i + block]
        if zi is None or len(zi) != max(len(a), len(b)) - 1:
            zi = np.zeros(max(len(a), len(b)) - 1)
        y[i:i + block], zi = lfilter(b, a, seg, zi=zi)
    return y


def env(n, attack=0.01, decay=6.0):
    tt = np.arange(n) / SR
    a = np.clip(tt / max(attack, 1e-4), 0, 1) ** 2
    return a * np.exp(-tt * decay)


def norm_peak(x, db=-1.0):
    p = np.max(np.abs(x)) or 1.0
    return x / p * 10 ** (db / 20)


def fade(x, n=64):
    n = min(n, len(x) // 4)
    if n > 0:
        x[:n] *= np.linspace(0, 1, n)
        x[-n:] *= np.linspace(1, 0, n)
    return x


# ----------------------------------------------------------------------------- the kit
NOTES = {'G4': 392.0, 'C5': 523.25, 'D5': 587.33, 'F5': 698.46, 'G5': 783.99, 'C6': 1046.5, 'D6': 1174.66, 'F6': 1396.91, 'G6': 1567.98, 'D7': 2349.32}


def whoosh(dur=0.55, f0=250, f1=2600, peak=0.6, q=1.4):
    n = int(SR * dur)
    s = np.linspace(0, 1, n)
    fc = np.where(s < peak, f0 + (f1 - f0) * (s / peak) ** 1.5, f1 - (f1 - f0) * 0.55 * ((s - peak) / (1 - peak)))
    noise = rng.normal(0, 1, n)
    y = bp_sweep(noise, fc, q) + 0.2 * lp(noise, f1 * 0.4)
    e = np.where(s < peak, (s / peak) ** 2.2, np.exp(-5 * (s - peak) / (1 - peak)))
    return fade(norm_peak(hp(y * e, 90)))


def suck(dur=0.5):
    return fade(whoosh(dur, 300, 3200, 0.85, 1.6)[::1])


def sub_hit(dur=0.9, f0=110, f1=38, click=0.35, decay=5.5):
    tt = t_(dur)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * decay)
    n = rng.normal(0, 1, len(tt)) * np.exp(-tt * 60)
    return fade(norm_peak(body + click * lp(n, 3500)))


def pop(freq=700, dur=0.12):
    tt = t_(dur)
    f = freq * 0.55 + freq * 0.75 * (1 - np.exp(-tt * 60))
    return fade(norm_peak(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 34)))


def click():
    tt = t_(0.05)
    x = lp(rng.normal(0, 1, len(tt)), 6000) * np.exp(-tt * 180) + 0.45 * np.sin(2 * np.pi * 2349 * tt) * np.exp(-tt * 130)
    return fade(norm_peak(x))


def tick(freq=3136):
    tt = t_(0.035)
    x = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 240) + 0.25 * rng.normal(0, 1, len(tt)) * np.exp(-tt * 420)
    return fade(norm_peak(x))


def ding(f1=NOTES['G6'], f2=NOTES['D7'], dur=1.1):
    tt = t_(dur)
    x = (np.sin(2 * np.pi * f1 * tt) + 0.5 * np.sin(2 * np.pi * f2 * tt) + 0.18 * np.sin(2 * np.pi * f1 * 2 * tt)) * np.exp(-tt * 5.5)
    return fade(norm_peak(x * np.clip(tt / 0.004, 0, 1)))


def sparkle(notes=('G5', 'C6', 'D6', 'G6', 'D7'), gap=0.055, dur=1.0):
    tt = t_(dur)
    x = np.zeros(len(tt))
    for k, nm in enumerate(notes):
        st = int(k * gap * SR)
        seg = tt[: len(tt) - st]
        x[st:] += np.sin(2 * np.pi * NOTES[nm] * seg) * np.exp(-seg * 6.5) * (0.88 ** k)
    return fade(norm_peak(x))


def shimmer(dur=1.6):
    tt = t_(dur)
    x = np.zeros(len(tt))
    for nm in ('G5', 'D6', 'G6', 'D7'):
        f = NOTES[nm]
        x += np.sin(2 * np.pi * f * tt + 2 * np.sin(2 * np.pi * 5.3 * tt)) * (0.6 + 0.4 * np.sin(2 * np.pi * (1.3 + f / 3000) * tt))
    noise = hp(rng.normal(0, 1, len(tt)), 6000) * 0.25
    e = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 1.5
    return fade(norm_peak((x * 0.25 + noise) * e))


def riser(dur=1.2):
    tt = t_(dur)
    s = tt / tt[-1]
    tone = np.sin(2 * np.pi * np.cumsum(NOTES['G4'] * 0.5 + NOTES['G4'] * 1.5 * s ** 2) / SR)
    noise = bp_sweep(rng.normal(0, 1, len(tt)), 400 + 6000 * s ** 2, 1.1)
    return fade(norm_peak((0.35 * tone + noise) * s ** 2.4))


def shutter():
    tt = t_(0.16)
    x = np.zeros(len(tt))
    for st, g in [(0.0, 1.0), (0.07, 0.75)]:
        i0 = int(st * SR)
        seg = tt[: len(tt) - i0]
        x[i0:] += g * bp_sweep(rng.normal(0, 1, len(seg)), np.full(len(seg), 2800.0), 3.0) * np.exp(-seg * 110)
    return fade(norm_peak(x))


def stamp():
    tt = t_(0.45)
    return fade(norm_peak(sub_hit(0.45, 150, 55, 0.2) + 0.8 * lp(rng.normal(0, 1, len(tt)), 2500) * np.exp(-tt * 70)))


def glitch(dur=0.35):
    tt = t_(dur)
    x = np.zeros(len(tt))
    seg_len = int(0.022 * SR)
    for i in range(0, len(tt), seg_len):
        if rng.random() < 0.72:
            fr = rng.choice([196, 392, 784, 1568, 3136])
            seg = tt[: min(seg_len, len(tt) - i)]
            x[i:i + len(seg)] = np.sign(np.sin(2 * np.pi * fr * seg)) * rng.uniform(0.3, 1.0)
    x = np.round(x * 4) / 4
    return fade(norm_peak(lp(x, 7000) * np.exp(-tt * 3)))


def bitcrush_sweep(dur=0.45):
    """Pixelation: a tone stepping down through ever coarser sample-and-hold."""
    tt = t_(dur)
    s = tt / dur
    f = NOTES['G6'] * (1 - 0.75 * s)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * rng.normal(0, 1, len(tt))
    hold = (1 + (s * 90).astype(int) * 6).astype(int)
    y = np.zeros_like(tone)
    i = 0
    while i < len(tone):
        h = hold[i]
        y[i:i + h] = tone[i]
        i += h
    y = np.round(y * 3) / 3
    return fade(norm_peak(lp(y, 9000) * (1 - s) ** 0.6))


def servo(dur=0.5):
    tt = t_(dur)
    f = 900 + 500 * np.sin(2 * np.pi * 2.2 * tt)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 + rng.normal(0, 1, len(tt)) * 0.3
    x = bp_sweep(x, f * 2, 2.5)
    return fade(norm_peak(x * np.sin(np.pi * tt / dur)))


def scribble(dur=0.6):
    tt = t_(dur)
    am = np.abs(np.sin(2 * np.pi * 7.5 * tt)) ** 0.6
    x = bp_sweep(rng.normal(0, 1, len(tt)), 3200 + 1200 * np.sin(2 * np.pi * 7.5 * tt), 2.0) * am
    return fade(norm_peak(x * np.clip(tt / 0.03, 0, 1)))


def ping(f=NOTES['D6']):
    tt = t_(0.45)
    x = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 1.5 * tt)) * np.exp(-tt * 11)
    return fade(norm_peak(x * np.clip(tt / 0.003, 0, 1)))


def laser(dur=0.35):
    tt = t_(dur)
    f = 2400 * np.exp(-tt * 9) + 220
    return fade(norm_peak(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7) + 0.2 * hp(rng.normal(0, 1, len(tt)), 3000) * np.exp(-tt * 20)))


def clank():
    tt = t_(0.35)
    x = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(410, 18), (1130, 26), (2210, 34), (3170, 40)])
    return fade(norm_peak(x + 0.5 * lp(rng.normal(0, 1, len(tt)), 4000) * np.exp(-tt * 90)))


def thud():
    tt = t_(0.3)
    return fade(norm_peak(sub_hit(0.3, 130, 60, 0.6, 10) + 0.5 * lp(rng.normal(0, 1, len(tt)), 900) * np.exp(-tt * 40)))


def heartbeat_pops(n=6, gap=0.09):
    tt = t_(n * gap + 0.2)
    x = np.zeros(len(tt))
    for k in range(n):
        p = pop([NOTES['G5'], NOTES['C6'], NOTES['D6']][k % 3], 0.1)
        st = int(k * gap * SR)
        x[st:st + len(p)] += p * (0.8 ** k)
    return fade(norm_peak(x))


def counter_ticks(dur, start_rate=8, end_rate=40):
    tt = t_(dur)
    x = np.zeros(len(tt))
    pos = 0.0
    k = 0
    while pos < dur:
        s = pos / dur
        rate = start_rate + (end_rate - start_rate) * s ** 1.6
        tk = tick(2349 if k % 2 else 3136) * (0.6 + 0.4 * s)
        i0 = int(pos * SR)
        x[i0:i0 + len(tk)] += tk[: len(x) - i0]
        pos += 1 / rate
        k += 1
    return fade(norm_peak(x))


def clock_ticks(dur, rate=4):
    tt = t_(dur)
    x = np.zeros(len(tt))
    for k in range(int(dur * rate)):
        tk = tick(1800 if k % 2 else 2400) * 0.9
        i0 = int(k / rate * SR)
        x[i0:i0 + len(tk)] += tk[: len(x) - i0]
    return fade(norm_peak(x))


def notif_burst(n=5, gap=0.11):
    tt = t_(n * gap + 0.5)
    x = np.zeros(len(tt))
    notes = [NOTES['D6'], NOTES['G6'], NOTES['C6'], NOTES['F6'], NOTES['D6'], NOTES['G6']]
    for k in range(n):
        p = ping(notes[k % len(notes)])
        st = int(k * gap * SR)
        x[st:st + len(p)] += p[: len(x) - st] * 0.8
    return fade(norm_peak(x))


KIT = {
    'whoosh': whoosh(0.55),
    'whoosh_s': whoosh(0.3, 450, 4200, 0.55, 1.6),
    'whoosh_l': whoosh(0.8, 120, 1500, 0.65, 1.2),
    'swish': whoosh(0.2, 1400, 7000, 0.4, 2.2),
    'suck': suck(0.5),
    'impact': sub_hit(1.1, 110, 36, 0.5),
    'hit': sub_hit(0.45, 160, 60, 0.6),
    'boom': sub_hit(1.6, 80, 30, 0.3, 3.0),
    'pop_g': pop(NOTES['G5']),
    'pop_c': pop(NOTES['C6']),
    'pop_d': pop(NOTES['D6']),
    'pop_lo': pop(NOTES['G4']),
    'click': click(),
    'tick': tick(),
    'ding': ding(),
    'ding_lo': ding(NOTES['D6'], NOTES['G6'], 1.0),
    'sparkle': sparkle(),
    'shimmer': shimmer(),
    'riser': riser(1.2),
    'riser_s': riser(0.6),
    'shutter': shutter(),
    'stamp': stamp(),
    'glitch': glitch(),
    'pixel': bitcrush_sweep(),
    'servo': servo(),
    'scribble': scribble(),
    'ping': ping(),
    'laser': laser(),
    'clank': clank(),
    'thud': thud(),
    'hearts': heartbeat_pops(),
    'notifs': notif_burst(),
}

# base levels (dB) per sound
LEVEL = {
    'whoosh': -17, 'whoosh_s': -19, 'whoosh_l': -17, 'swish': -22, 'suck': -19,
    'impact': -15, 'hit': -17, 'boom': -15,
    'pop_g': -24, 'pop_c': -24, 'pop_d': -24, 'pop_lo': -23, 'click': -21, 'tick': -26,
    'ding': -22, 'ding_lo': -22, 'sparkle': -25, 'shimmer': -27, 'riser': -20, 'riser_s': -21,
    'shutter': -19, 'stamp': -15, 'glitch': -22, 'pixel': -21, 'servo': -27, 'scribble': -25,
    'ping': -25, 'laser': -22, 'clank': -22, 'thud': -18, 'hearts': -26, 'notifs': -25,
}

# ----------------------------------------------------------------------------- cue sheet
CUES = []


def cue(t, name, db=0.0, pan=0.0, rate=1.0):
    CUES.append((t, name, db, pan, rate))


def pops(times, pan_from=-0.4, pan_to=0.4, db=0.0):
    names = ['pop_g', 'pop_c', 'pop_d']
    for k, tt in enumerate(times):
        p = pan_from + (pan_to - pan_from) * (k / max(1, len(times) - 1))
        cue(tt, names[k % 3], db, p)


# Act 1 — hook
cue(0.2, 'pop_lo')
cue(0.4, 'whoosh_s')
cue(0.92, 'swish', pan=-0.3)
cue(4.72, 'whoosh', pan=0.2)
cue(5.22, 'swish', pan=0.5)
cue(w(2, 'terlihat'), 'sparkle', pan=0.4)
cue(w(2, 'menarik') + 0.3, 'glitch', pan=0.4)
cue(w(3, 'disampaikan') - 0.2, 'servo', -2)
cue(w(3, 'tepat') - 0.05, 'shutter')
cue(9.4, 'whoosh_s')
pops([w(4, 'relevan') + 0.3 + i * 0.07 for i in range(6)], -0.5, 0.5)
pops([w(4, 'menjangkau') + 0.2 + i * 0.05 for i in range(10)], -0.7, 0.7, -3)
cue(w(4, 'dituju'), 'ding_lo', pan=0.3)
cue(12.82, 'suck')
cue(13.2, 'boom', -2)

# Act 2 — logo
cue(13.62, 'pop_lo')
for i, b in enumerate([13.92, 14.41, 14.9]):
    cue(b, ['pop_g', 'pop_c', 'pop_d'][i], 2)
cue(13.7, 'riser', -3)
cue(15.1, 'whoosh_s')
cue(15.84, 'impact')
cue(15.86, 'shimmer', 3)
cue(w(5, 'ruber') - 0.02, 'swish', pan=-0.2)
cue(17.2, 'whoosh')
cue(w(6, 'menerjemahkan'), 'servo', 1)
cue(17.62, 'scribble', -1, -0.1)
cue(w(6, 'ide') - 0.02, 'ding', pan=-0.6)
cue(w(6, 'menjadi') - 0.36, 'whoosh_s', pan=0.4)
cue(w(6, 'komunikasi'), 'whoosh', pan=0)
pops([w(6, 'komunikasi') + 0.55 + i * 0.07 for i in range(6)], -0.2, 0.2, -4)
cue(w(6, 'visual', 0), 'sparkle', pan=0.5)
pops([w(7, 'yang') + i * 0.1 for i in range(5)], -0.3, 0.3, -6)
cue(w(7, 'tujuan'), 'stamp', -2, 0.2)
cue(21.5, 'whoosh_l')

# Act 3 — services
cue(22.0, 'whoosh', pan=0)
for c in [w(8, 'company'), w(9, 'digital'), w(10, 'short'), w(10, 'corporate'), w(11, 'reels'), w(11, 'photoshoot'), w(12, 'product')]:
    cue(c - 0.09, 'click', pan=-0.6)
    cue(c - 0.04, 'swish', -2, 0.3)
for k in range(4):
    cue(w(11, 'photoshoot') + k * 0.17, 'shutter', -3, 0.1 + k * 0.1)
cue(30.3, 'whoosh_l')
pops([30.5 + i * 0.06 for i in range(12)], -0.8, 0.8, -6)
cue(w(13, 'perusahaan'), 'pop_d', 2)
cue(w(14, 'organisasi'), 'pop_g', 2)
for k in range(10):
    cue(34.0 + k * 0.06, 'tick', -2, -0.6 + k * 0.12)
cue(34.35, 'whoosh_l', -2)

# Act 4 — journey
cue(35.25, 'whoosh_l')
for b in [35.75, 36.23, 36.71, 37.2]:
    cue(b - 0.05, 'whoosh_s', -3, rng.uniform(-0.5, 0.5))
cue(w(15, 'perjalanan'), 'shimmer', 1)
cue(37.3, 'riser_s')
cue(38.18, 'whoosh_l')
cue(38.45, 'impact', -1)
pops([38.5 + i * 0.05 for i in range(14)], -0.8, 0.8, -7)
cue(w(16, 'berkolaborasi'), 'sparkle', -2)
pops([w(17, 'beragam') + i * 0.06 for i in range(8)], -0.8, 0.8, -3)
cue(42.35, 'swish')
cue(w(18, 'kebutuhan') - 0.06, 'pop_lo', 2, -0.5)
cue(w(19, 'karakter') - 0.06, 'pop_lo', 2, 0)
cue(w(19, 'tantangan') - 0.06, 'pop_lo', 2, 0.5)
cue(w(19, 'berbeda'), 'glitch', -2)
cue(w(19, 'berbeda') + 0.05, 'sparkle', -2)
cue(45.75, 'swish')
cue(46.4, 'thud')
cue(46.55, 'whoosh_l', -2)

# Act 5 — principle
cue(47.2, 'whoosh', -1)
cue(w(20, 'pengalaman') + 0.02, 'scribble', 1)
pops([w(20, 'tersebut') - 0.1 + i * 0.07 for i in range(5)], -0.7, 0.7, -3)
cue(w(21, 'membentuk'), 'suck')
cue(w(21, 'membentuk') + 0.38, 'hit')
cue(w(21, 'pegang') - 0.02, 'stamp')
for k in range(6):
    cue(w(22, 'hingga') + k * 0.06, 'tick', -2, -0.5 + k * 0.2)
cue(w(22, 'hari') + 0.05, 'ding_lo', -2, 0.5)
cue(51.1, 'whoosh_l', -1)

# Act 6 — speed
cue(w(23, 'kecepatan') - 0.12, 'whoosh_s', 2, 0.6)
cue(w(23, 'kecepatan') + 0.15, 'hit', -2)
cue(w(23, 'bersama'), 'pop_d', 3)
for k in range(9):
    cue(w(23, 'ketepatan') - 0.05 + k * 0.03, 'tick', -3, -0.4 + k * 0.1)
cue(w(23, 'ketepatan') + 0.22, 'click', 2)
cue(54.72, 'swish')
cue(w(24, 'karena') - 0.1, 'notifs', 0, 0)
cue(w(24, 'kebutuhan'), 'notifs', -2, 0.3)
cue(w(24, 'terus') - 0.2, 'riser', -1)
cue(57.15, 'whoosh')
cue(w(25, 'momentum') - 0.1, 'click', 2)
cue(w(25, 'momentum'), 'servo', -6)
CUES.append((w(25, 'momentum') + 0.05, '__clock', -1.0, 0.0, 1.0))
cue(w(25, 'menunggu'), 'ding', 1)
cue(w(25, 'menunggu') + 0.02, 'impact', -3)
cue(59.5, 'whoosh_l')

# Act 7 — process
cue(60.2, 'whoosh', -1)
cue(w(26, 'proses') - 0.1, 'whoosh_l', -3)
cue(w(26, 'proses') + 0.05, 'riser_s', -4)
pops([w(26, 'proses') + 0.3 + i * 0.12 for i in range(5)], -0.7, 0.7, -2)
for k, c in enumerate([w(27, 'memahami'), w(28, 'menentukan'), w(29, 'menyusun'), w(30, 'mengeksekusinya')]):
    cue(c - 0.12, 'whoosh', -2, 0.4)
for k in range(4):
    cue(w(27, 'kebutuhan') - 0.45 + k * 0.32, 'tick', 2, -0.3)
cue(w(28, 'pendekatan') - 0.06, 'click', 1)
cue(w(28, 'pendekatan') + 0.02, 'pop_d', -2)
pops([w(29, 'menyusun') + 0.25 + i * 0.22 for i in range(4)], -0.4, 0.4, -4)
cue(w(30, 'mengeksekusinya') + 0.2, 'riser', -4)
cue(w(30, 'cepat'), 'ding', -1)
cue(72.4, 'whoosh', -2)
pops([w(31, 'tepat') + i * 0.09 for i in range(4)], -0.6, 0.6, 1)
cue(w(31, 'akurat'), 'impact', -2)
cue(w(31, 'akurat') + 0.02, 'shimmer', 2)
cue(73.7, 'whoosh_l')

# Act 8 — readiness
cue(w(32, 'bagi'), 'hit', -3)
cue(w(32, 'bekerja') + 0.1, 'whoosh', -2, 0.5)
cue(w(32, 'cepat'), 'swish', 0, 0.5)
cue(w(32, 'bukan'), 'pop_lo', 1)
cue(w(32, 'terburu') - 0.1, 'glitch', 2, -0.5)
cue(w(32, 'terburu') + 0.05, 'scribble', 0, -0.5)
cue(w(32, 'terburu') + 0.42, 'swish', 1, -0.4)
cue(78.55, 'suck')
cue(w(33, 'kecepatan') - 0.05, 'impact', -2)
for k, c in enumerate([w(33, 'kesiapan'), w(33, 'koordinasi'), w(34, 'pengalaman'), w(34, 'pemahaman')]):
    cue(c - 0.05, ['pop_g', 'pop_c', 'pop_d', 'pop_g'][k], 2, [-0.6, 0.6, -0.6, 0.6][k])
    cue(c + 0.1, 'riser_s', -8 + k * 1.5)
cue(w(34, 'jelas') - 0.05, 'swish')
cue(w(35, 'tujuan') - 0.1, 'laser', 0, 0.4)
cue(w(35, 'tujuan') + 0.2, 'hit', -1, 0.5)
cue(86.15, 'whoosh', -2, 0.5)

# Act 8c — detail
pops([w(36, 'proses') + i * 0.1 for i in range(4)], -0.5, 0.5, -2)
for k in range(5):
    cue(w(37, 'setiap') + 0.05 + k * 0.22, 'tick', 0, -0.4 + k * 0.2)
cue(w(37, 'efisien') - 0.05, 'whoosh_s', -1)
cue(w(37, 'efisien') + 0.2, 'ding_lo', -2)
cue(w(38, 'tanpa') - 0.1, 'swish')
pops([w(38, 'tanpa') + i * 0.1 for i in range(3)], -0.5, 0.5, -3)
cue(w(38, 'kualitas'), 'ding', -2)
cue(w(38, 'dan') - 0.15, 'whoosh_s', -2, 0.5)
cue(w(38, 'perhatian') - 0.1, 'servo', 0, 0)
for c in [w(38, 'perhatian') + 0.05, w(38, 'terhadap') + 0.1, w(38, 'detail') - 0.05]:
    cue(c, 'click', -1, 0.3)
cue(94.18, 'whoosh_l', -1)
cue(94.74, 'pixel', 1)
cue(94.97, 'shimmer', -1)

# Act 9 — digital
cue(95.38, 'riser', -3)
cue(w(39, 'digital'), 'shimmer', 2)
pops([w(40, 'membangun') - 0.15 + k * 0.06 for k in range(15)], -0.8, 0.8, -6)
for k in range(5):
    cue(w(40, 'mengelola') + k * 0.07, 'click', -5, -0.6 + k * 0.3)
cue(w(41, 'lebih') - 0.2, 'whoosh', -2, 0.5)
cue(w(41, '15'), 'impact', -3)
pops([w(41, 'media') + k * 0.08 for k in range(6)], -0.7, 0.4, -2)
cue(w(42, 'melalui') - 0.1, 'whoosh_l', -2)
pops([w(42, 'melalui') + 0.1 + k * 0.05 for k in range(16)], -0.8, 0.8, -8)
cue(w(43, 'secara') - 0.1, 'suck', 1)
cue(w(43, 'akumulatif'), 'hit')
CUES.append((w(44, 'menghasilkan'), '__counter', -2.0, 0.0, 1.0))
cue(w(44, 'menghasilkan'), 'riser', -2)
cue(w(44, 'miliar'), 'boom', -1)
cue(w(44, 'miliar') + 0.02, 'glitch', -2)
cue(w(44, 'views') - 0.05, 'pop_d', 2)
cue(108.3, 'whoosh', -1)

# Act 10 — message
cue(w(45, 'memahami') + 0.1, 'swish', -3)
cue(w(45, 'visual') - 0.08, 'impact', -3)
cue(w(45, 'visual'), 'shimmer', 1)
cue(w(46, 'bukan') - 0.1, 'whoosh', -2)
cue(113.4, 'tick', 0)
cue(114.0, 'tick', 0)
cue(w(46, 'terlihat') + 0.28, 'swish', 1, 0.3)
cue(w(47, 'tetapi') - 0.05, 'whoosh_s', -1)
cue(w(47, 'tetapi') + 0.3, 'whoosh_s', -4, 0.4)
cue(w(47, 'tetapi') + 0.6, 'tick', -2, 0.4)
cue(w(47, 'pesan') + 0.1, 'tick', -2, 0.4)
cue(w(47, 'diterima'), 'ding', -1, 0.3)
cue(w(48, 'diingat') - 0.25, 'swish')
cue(w(48, 'diingat') - 0.08, 'pop_c', 2, 0)
cue(w(48, 'relevan') - 0.08, 'pop_d', 2, 0.5)
cue(w(48, 'audience') - 0.1, 'hearts', 2)
cue(120.9, 'suck')
cue(121.0, 'boom', -3)

# Act 11 — idea
cue(121.42, 'pop_lo', 1)
cue(w(49, 'ide') - 0.04, 'ding', 0)
cue(w(49, 'ide'), 'shimmer', 2)
cue(w(50, 'menjadi') - 0.15, 'whoosh')
cue(w(50, 'menjadi') - 0.02, 'clank', 1)
cue(w(50, 'menjadi') + 0.45, 'clank', -2, 0.4)
for k in range(4):
    cue(w(50, 'proses') - 0.2 + k * 0.12, 'tick', 1, -0.6 + k * 0.4)
cue(w(51, 'kemudian') - 0.1, 'whoosh')
cue(w(51, 'karya') - 0.1, 'pop_c', 1)
cue(w(51, 'siap') - 0.05, 'click', 3)
cue(w(51, 'siap'), 'ding', -1)
cue(w(51, 'bertemu'), 'whoosh_s', -1)
cue(w(51, 'bertemu') + 0.05, 'hearts', 0)
cue(w(52, 'audience') + 0.1, 'sparkle', -2)
cue(129.05, 'suck')
cue(129.28, 'whoosh', -2)

# Act 12 — outro
outro_t0 = w(53, 'ruber') - 0.33  # same as A12Outro
cue(outro_t0, 'pop_lo', 2)
cue(outro_t0 + 0.09, 'whoosh_s', -3)
cue(outro_t0 + 0.7, 'impact', -4)
cue(outro_t0 + 0.75, 'shimmer', 0)
cue(w(54, 'built'), 'pop_g', -2)
cue(w(54, 'every'), 'pop_c', -2)
cue(w(54, 'exceptional'), 'pop_d', 0)
cue(w(54, 'exceptional') + 0.05, 'sparkle', -1)
cue(w(54, 'exceptional') + 0.45, 'swish', -4)
cue(133.75, 'shimmer', -4)

# ----------------------------------------------------------------------------- mixdown
n = int(SR * DUR) + SR
L = np.zeros(n)
R = np.zeros(n)


def place(t, x, db, pan):
    g = 10 ** (db / 20)
    i0 = int(round(t * SR))
    if i0 >= n:
        return
    x = x[: n - i0] * g
    pl = np.cos((pan + 1) * np.pi / 4)
    pr = np.sin((pan + 1) * np.pi / 4)
    L[i0:i0 + len(x)] += x * pl * np.sqrt(2)
    R[i0:i0 + len(x)] += x * pr * np.sqrt(2)


clock_dur = w(25, 'menunggu') - (w(25, 'momentum') + 0.05)
counter_dur = w(44, 'miliar') - w(44, 'menghasilkan')
for t0, name, db, pan, rate in sorted(CUES):
    if name == '__clock':
        place(t0, clock_ticks(clock_dur, 6), -24 + db, pan)
        continue
    if name == '__counter':
        place(t0, counter_ticks(counter_dur), -25 + db, pan)
        continue
    x = KIT[name]
    if rate != 1.0:
        idx = np.arange(0, len(x) - 1, rate)
        x = np.interp(idx, np.arange(len(x)), x)
    place(t0, x, LEVEL[name] + db, pan)

# duck under the voice: -4 dB while a word is being spoken (smoothed)
duck = np.ones(n)
for line in VO:
    for wd in line['words']:
        a, b = int(wd['s'] * SR), int(wd['e'] * SR)
        duck[a:b] = 10 ** (-4 / 20)
k = int(0.06 * SR)
duck = np.convolve(duck, np.ones(k) / k, mode='same')
L *= duck
R *= duck

peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
if peak > 0.95:
    L *= 0.95 / peak
    R *= 0.95 / peak
out = np.stack([L, R], axis=1)[: int(SR * DUR)]
data = (np.clip(out, -1, 1) * 32767).astype(np.int16)
path = os.path.join(ROOT, 'public/audio/sfx-v2.wav')
with wave.open(path, 'wb') as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(data.tobytes())
print(f'{len(CUES)} cues -> {os.path.abspath(path)} (peak {peak:.2f})')
