"""Synthesise the SFX kit used by the mograph (public/sfx/*.wav).

Everything is generated procedurally (numpy), so there are no licensing questions.
Run: python3 scripts/gen_sfx.py
"""
import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(42)


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def save(name, x, gain_db=-1.0):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * (10 ** (gain_db / 20))
    # tiny fades to avoid clicks
    n = min(96, len(x) // 4)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    data = (x * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def onepole_lp(x, fc):
    """One-pole low-pass with (possibly time-varying) cutoff fc (Hz)."""
    fc = np.broadcast_to(np.asarray(fc, dtype=np.float64), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def bandpass(x, fc, q=2.0):
    """State-variable band-pass with time-varying centre frequency."""
    fc = np.broadcast_to(np.asarray(fc, dtype=np.float64), x.shape)
    y = np.zeros_like(x)
    low = band = 0.0
    damp = 1.0 / q
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR)
        high = x[i] - low - damp * band
        band += f * high
        low += f * band
        y[i] = band
    return y


def env_ar(n, attack, release_curve=4.0):
    a = int(n * attack)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 2
    e[a:] = np.exp(-release_curve * np.linspace(0, 1, n - a))
    return e


def whoosh(dur=0.55, f0=250, f1=2600, peak=0.6, q=1.4):
    n = int(SR * dur)
    noise = rng.normal(0, 1, n)
    s = np.linspace(0, 1, n)
    fc = np.where(s < peak, f0 + (f1 - f0) * (s / peak) ** 1.5, f1 - (f1 - f0) * 0.6 * ((s - peak) / (1 - peak)))
    y = bandpass(noise, fc, q) + 0.25 * onepole_lp(noise, fc * 0.5)
    e = np.where(s < peak, (s / peak) ** 2.2, np.exp(-5 * (s - peak) / (1 - peak)))
    return y * e


def sub_hit(dur=0.9, f0=90, f1=38, click=0.35):
    tt = t_(dur)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-tt * 5.5)
    n = rng.normal(0, 1, len(tt)) * np.exp(-tt * 60)
    return body + click * onepole_lp(n, 3500)


# --- the kit -----------------------------------------------------------------
save('whoosh', whoosh(0.55))
save('whoosh-short', whoosh(0.32, 400, 3800, 0.55, 1.6), -3)
save('whoosh-deep', whoosh(0.7, 120, 1400, 0.65, 1.2), -2)
save('swish', whoosh(0.22, 1200, 6500, 0.4, 2.2), -6)
save('impact', sub_hit(1.1, 110, 36, 0.5))
save('hit', sub_hit(0.45, 160, 60, 0.6), -3)

# UI click: short filtered transient + tiny tone
tt = t_(0.05)
click = onepole_lp(rng.normal(0, 1, len(tt)), 6000) * np.exp(-tt * 180) + 0.4 * np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 120)
save('click', click, -6)

# pop: fast upward pitch blip
tt = t_(0.12)
f = 380 + 900 * (1 - np.exp(-tt * 60))
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 38)
save('pop', pop, -6)

# tick: tiny high click for counters / checklists
tt = t_(0.03)
tick = np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 260) + 0.3 * rng.normal(0, 1, len(tt)) * np.exp(-tt * 400)
save('tick', tick, -10)

# ding: soft notification (two partials)
tt = t_(0.9)
ding = (np.sin(2 * np.pi * 1318.5 * tt) + 0.6 * np.sin(2 * np.pi * 1975.5 * tt) + 0.25 * np.sin(2 * np.pi * 2637 * tt)) * np.exp(-tt * 6)
ding += np.concatenate([np.zeros(int(0.07 * SR)), (np.sin(2 * np.pi * 1760 * tt) * np.exp(-tt * 7))[: len(tt) - int(0.07 * SR)]]) * 0.7
save('ding', ding, -8)

# sparkle: shimmering upward arpeggio
tt = t_(0.9)
sp = np.zeros(len(tt))
for k, fr in enumerate([1568, 2093, 2637, 3136, 4186]):
    st = int(k * 0.06 * SR)
    seg = tt[: len(tt) - st]
    sp[st:] += np.sin(2 * np.pi * fr * seg) * np.exp(-seg * 7) * (0.9 ** k)
save('sparkle', sp, -10)

# riser: noise + rising tone, crescendo
tt = t_(1.6)
s = tt / tt[-1]
tone = np.sin(2 * np.pi * np.cumsum(180 + 900 * s ** 2) / SR)
noise = bandpass(rng.normal(0, 1, len(tt)), 400 + 5000 * s ** 2, 1.2)
riser = (0.5 * tone + noise) * s ** 2.5
save('riser', riser, -4)

# shutter: two mechanical clicks
tt = t_(0.18)
sh = np.zeros(len(tt))
for st, g in [(0.0, 1.0), (0.075, 0.8)]:
    i0 = int(st * SR)
    seg = tt[: len(tt) - i0]
    sh[i0:] += g * bandpass(rng.normal(0, 1, len(seg)), 2600, 3.0) * np.exp(-seg * 120)
save('shutter', sh, -3)

# clapperboard: sharp wooden clap with a short resonance
tt = t_(0.35)
cl = bandpass(rng.normal(0, 1, len(tt)), 1700, 4.0) * np.exp(-tt * 45) + 0.6 * sub_hit(0.35, 220, 90, 0.2)[: len(tt)]
save('clap', cl, -2)

# stamp: thud + paper slap
tt = t_(0.45)
st_ = sub_hit(0.45, 140, 55, 0.2) + 0.8 * onepole_lp(rng.normal(0, 1, len(tt)), 2500) * np.exp(-tt * 70)
save('stamp', st_, -2)

# glitch: stuttered digital bursts
tt = t_(0.4)
gl = np.zeros(len(tt))
seg_len = int(0.025 * SR)
for i in range(0, len(tt), seg_len):
    if rng.random() < 0.7:
        fr = rng.choice([220, 440, 880, 1760, 3520])
        seg = tt[: min(seg_len, len(tt) - i)]
        sq = np.sign(np.sin(2 * np.pi * fr * seg))
        gl[i : i + len(seg)] = sq * rng.uniform(0.3, 1.0)
gl = np.round(gl * 4) / 4  # bit crush
save('glitch', gl * np.exp(-tt * 3), -8)

# beep: camera standby / record
tt = t_(0.14)
save('beep', np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt * 18), -12)

print('sfx written to', os.path.abspath(OUT))
