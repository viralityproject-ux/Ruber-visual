import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {Label, Typed, W, at} from '../components/Text';
import {Bar, CheckBadge, Media, Pill} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, spr} from '../lib/anim';

const STEPS = [
  {title: 'Brief', verb: 'masuk', noun: 'brief', verbCue: 'masuk', icon: 'chat'},
  {title: 'Treatment', verb: 'bergerak', noun: 'treatment', verbCue: 'bergerak', icon: 'doc'},
  {title: 'Tim', verb: 'bersiap', noun: 'tim', verbCue: 'bersiap', icon: 'users'},
  {title: 'Produksi', verb: 'berjalan', noun: 'produksi', verbCue: 'berjalan', icon: 'camera'},
];

const CREW = ['DIRECTOR', 'DOP', 'GAFFER', 'SOUND'];

const Field: React.FC<{k: string; v: string; t0: number}> = ({k, v, t0}) => {
  const {u} = useLayout();
  const t = useT();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: `${16 * u}px 0`, borderBottom: `${1.5 * u}px solid rgba(255,255,255,0.08)`, opacity: prog(t, t0 - 0.1, 0.2)}}>
      <span style={{fontFamily: F.mono, fontSize: 24 * u, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em'}}>{k}</span>
      <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 28 * u, color: '#fff'}}>
        <Typed text={v} t0={t0} cps={40} caret={false} />
      </span>
    </div>
  );
};

const StepBody: React.FC<{i: number; t0: number}> = ({i, t0}) => {
  const t = useT();
  const {u} = useLayout();
  if (i === 0) {
    return (
      <div style={{marginTop: 26 * u}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14 * u, padding: 18 * u, borderRadius: 20 * u, background: 'rgba(123,60,255,0.18)', border: `${1.5 * u}px solid rgba(179,145,255,0.35)`, transform: `translateY(${mix(-30, 0, prog(t, t0, 0.4, ease.outBack))}px)`, opacity: prog(t, t0, 0.2)}}>
          <div style={{width: 46 * u, height: 46 * u, borderRadius: 14 * u, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="chat" size={26 * u} color="#fff" stroke={2.2} />
          </div>
          <div>
            <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 26 * u, color: '#fff'}}>New brief received</div>
            <div style={{fontFamily: F.mono, fontSize: 20 * u, color: 'rgba(255,255,255,0.55)'}}>just now</div>
          </div>
        </div>
        <div style={{marginTop: 14 * u}}>
          <Field k="CLIENT" v="Brand partner" t0={t0 + 0.2} />
          <Field k="OUTPUT" v="Campaign film 60s" t0={t0 + 0.45} />
          <Field k="PLATFORM" v="IG · TikTok · YT" t0={t0 + 0.7} />
          <Field k="DEADLINE" v="D-14" t0={t0 + 0.95} />
        </div>
      </div>
    );
  }
  if (i === 1) {
    const thumbs = ['photos/street-duo-03.jpg', 'photos/fashion-hijab-purple.jpg', 'photos/street-girl-sit.jpg'];
    return (
      <div style={{marginTop: 26 * u, position: 'relative', height: 380 * u}}>
        {[2, 1, 0].map((k) => {
          const p = spr(t, t0 + 0.1 * (2 - k), 180, 16);
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 360 * u,
                borderRadius: 22 * u,
                background: k === 0 ? '#fff' : 'rgba(255,255,255,0.85)',
                transform: `translate(${k * 16 * u * p}px, ${k * -14 * u * p}px) rotate(${k * 2.5 * p}deg)`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                padding: 26 * u,
                boxSizing: 'border-box',
                opacity: Math.min(1, p * 2),
              }}
            >
              {k === 0 ? (
                <>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20 * u, color: C.violet, letterSpacing: '0.12em'}}>TREATMENT · v1</div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 40 * u, color: C.ink, letterSpacing: '-0.03em', marginTop: 6 * u}}>Moodboard & Look</div>
                  <div style={{display: 'flex', gap: 10 * u, marginTop: 18 * u}}>
                    {thumbs.map((src, j) => (
                      <div key={src} style={{flex: 1, height: 150 * u, borderRadius: 14 * u, overflow: 'hidden', transform: `scale(${prog(t, t0 + 0.3 + j * 0.1, 0.4, ease.outBack)})`}}>
                        <Media src={src} />
                      </div>
                    ))}
                  </div>
                  {[0.9, 0.7, 0.8].map((wd, j) => (
                    <div key={j} style={{height: 12 * u, width: `${wd * 100 * prog(t, t0 + 0.5 + j * 0.1, 0.4)}%`, background: 'rgba(7,7,15,0.12)', borderRadius: 9, marginTop: 14 * u}} />
                  ))}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
  if (i === 2) {
    const zoom = mix(1.14, 1.02, prog(t, t0 - 0.4, 2.4, ease.outCubic));
    return (
      <div style={{marginTop: 26 * u}}>
        <div style={{position: 'relative', height: 300 * u, borderRadius: 22 * u, overflow: 'hidden', background: '#000'}}>
          <Media src="photos/bts-set-office-crew.jpg" pos="60% 55%" zoom={zoom} />
          <div style={{position: 'absolute', left: 18 * u, top: 16 * u, padding: `${6 * u}px ${14 * u}px`, borderRadius: 999, background: 'rgba(7,7,15,0.55)', fontFamily: F.mono, fontWeight: 700, fontSize: 20 * u, color: '#fff', letterSpacing: '0.08em'}}>
            SET · STANDBY
          </div>
        </div>
        <div style={{display: 'flex', gap: 12 * u, marginTop: 20 * u, flexWrap: 'wrap'}}>
          {CREW.map((role, j) => {
            const tj = t0 + 0.35 + j * 0.12;
            const p = prog(t, tj, 0.4, ease.outBackStrong);
            return (
              <div
                key={role}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8 * u,
                  padding: `${8 * u}px ${14 * u}px ${8 * u}px ${8 * u}px`,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  border: `${1.5 * u}px solid rgba(179,145,255,0.35)`,
                  transform: `scale(${p})`,
                  opacity: Math.min(1, p * 2),
                }}
              >
                <CheckBadge t0={tj + 0.1} size={30} />
                <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 19 * u, color: '#fff', letterSpacing: '0.06em'}}>{role}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  const run = clamp01((t - t0) / 2.2);
  const blink = Math.floor(t * 2.5) % 2 === 0;
  return (
    <div style={{marginTop: 26 * u}}>
      <div style={{position: 'relative', height: 330 * u, borderRadius: 22 * u, overflow: 'hidden', background: '#000'}}>
        <Media src="photos/bts-shoot-bedroom-crew.jpg" pos="45% 40%" zoom={mix(1.12, 1.0, prog(t, t0 - 0.3, 1.4, ease.outCubic))} />
        <div style={{position: 'absolute', inset: 0, opacity: prog(t, t0 + 0.75, 0.25, ease.inOutCubic)}}>
          <Media src="photos/bts-shoot-bedroom-camera.jpg" pos="55% 45%" zoom={mix(1.0, 1.08, prog(t, t0 + 0.75, 1.6, ease.linear))} />
        </div>
        <div style={{position: 'absolute', left: 18 * u, top: 16 * u, display: 'flex', alignItems: 'center', gap: 10 * u, fontFamily: F.mono, fontWeight: 700, fontSize: 22 * u, color: '#fff'}}>
          <span style={{width: 16 * u, height: 16 * u, borderRadius: '50%', background: C.violetLight, opacity: blink ? 1 : 0.3}} />
          REC
        </div>
        <div style={{position: 'absolute', right: 18 * u, top: 16 * u, fontFamily: F.mono, fontWeight: 700, fontSize: 22 * u, color: '#fff'}}>
          {`00:00:${String(Math.floor(run * 9)).padStart(2, '0')}:${String(Math.floor((run * 9 * 25) % 25)).padStart(2, '0')}`}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16 * u, marginTop: 24 * u}}>
        <span style={{fontFamily: F.mono, fontSize: 22 * u, color: 'rgba(255,255,255,0.6)'}}>SHOOT DAY</span>
        <Bar p={run} h={12} dark style={{flex: 1}} />
        <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24 * u, color: '#fff'}}>{Math.round(run * 100)}%</span>
      </div>
    </div>
  );
};

// "Brief masuk, treatment bergerak, tim bersiap, produksi berjalan,"
export const S11Workflow: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const cues = STEPS.map((s) => at(13, s.noun));
  const verbs = STEPS.map((s) => at(13, s.verbCue));
  const k = cues.slice(1).reduce((acc, c) => acc + spr(t, c - 0.15, 170, 22), 0); // continuous focus index
  const cardW = (portrait ? 860 : 700) * u;
  const cardH = (portrait ? 660 : 640) * u;
  const step = portrait ? cardH + 90 * u : cardW + 120 * u;
  const zoom = 1 + bump(t, cues[Math.round(k)] ?? 0, 0.4) * 0.03;
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 20, 20], [C.violet, 80, 85]]} />
      {/* progress header */}
      <div style={{position: 'absolute', top: (portrait ? 110 : 64) * u, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14 * u, zIndex: 2}}>
        {STEPS.map((s, i) => {
          const on = t >= cues[i] - 0.1;
          const done = i < Math.round(k) || t > verbs[i] + 0.3;
          return (
            <div
              key={s.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10 * u,
                padding: `${10 * u}px ${20 * u}px`,
                borderRadius: 999,
                background: on ? (done ? GRAD : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.04)',
                border: `${1.5 * u}px solid ${on ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 22 * u,
                color: on ? '#fff' : 'rgba(255,255,255,0.35)',
                letterSpacing: '0.08em',
              }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {portrait ? null : <span>{s.title.toUpperCase()}</span>}
            </div>
          );
        })}
      </div>
      {/* track */}
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <div
          style={{
            position: 'absolute',
            left: w / 2,
            top: h / 2 + (portrait ? 40 : 40) * u,
            transform: portrait ? `translate(-50%, ${-k * step}px)` : `translate(${-k * step}px, 0)`,
          }}
        >
          {/* connector */}
          <div
            style={{
              position: 'absolute',
              left: portrait ? -2 * u : 0,
              top: portrait ? 0 : -2 * u,
              width: portrait ? 4 * u : step * 3,
              height: portrait ? step * 3 : 4 * u,
              background: 'rgba(255,255,255,0.1)',
            }}
          >
            <div style={{position: 'absolute', left: 0, top: 0, width: portrait ? '100%' : `${(k / 3) * 100}%`, height: portrait ? `${(k / 3) * 100}%` : '100%', background: GRAD, boxShadow: `0 0 ${20 * u}px ${C.violet}`}} />
          </div>
          {STEPS.map((s, i) => {
            const d = i - k;
            const ad = Math.abs(d);
            const appear = spr(t, cues[i] - 0.45, 160, 18);
            const vp = prog(t, verbs[i], 0.45, ease.outBackStrong);
            return (
              <div
                key={s.title}
                style={{
                  position: 'absolute',
                  left: portrait ? -cardW / 2 : i * step - cardW / 2,
                  top: portrait ? i * step - cardH / 2 : -cardH / 2,
                  width: cardW,
                  height: cardH,
                  borderRadius: 40 * u,
                  padding: 44 * u,
                  boxSizing: 'border-box',
                  background: 'linear-gradient(180deg, rgba(36,36,64,0.96), rgba(16,16,30,0.96))',
                  border: `${2 * u}px solid ${ad < 0.5 ? 'rgba(179,145,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: ad < 0.5 ? `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.6), 0 0 ${80 * u}px rgba(123,60,255,0.25)` : `0 ${30 * u}px ${60 * u}px rgba(0,0,0,0.5)`,
                  transform: `scale(${mix(1, 0.86, Math.min(1, ad)) * mix(0.7, 1, appear)})`,
                  opacity: Math.min(1, appear * 2) * mix(1, portrait ? 0.2 : 0.45, Math.min(1, ad)),
                  filter: ad > 0.5 ? `blur(${(ad - 0.5) * 3}px)` : undefined,
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 18 * u}}>
                    <div style={{width: 72 * u, height: 72 * u, borderRadius: 20 * u, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Icon name={s.icon} size={40 * u} color="#fff" stroke={2} draw={cues[i] - 0.2} />
                    </div>
                    <div>
                      <Label size={20} color="rgba(255,255,255,0.5)">{`step ${String(i + 1).padStart(2, '0')}`}</Label>
                      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56 * u, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1}}>
                        <W t={cues[i]} dark>
                          {s.title}
                        </W>
                      </div>
                    </div>
                  </div>
                  <div style={{transform: `scale(${vp})`, transformOrigin: 'right center'}}>
                    <Pill size={24} grad>
                      <Icon name="check" size={22 * u} color="#fff" stroke={3} /> {s.verb}
                    </Pill>
                  </div>
                </div>
                {appear > 0.05 ? <StepBody i={i} t0={cues[i]} /> : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
