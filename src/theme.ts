// "Midnight" palette (V2): deeper blue + violet, alternating paper / ink backgrounds.
export const C = {
  ink: '#070816',
  ink2: '#0D0E21',
  ink3: '#141041',
  paper: '#F4F5F9',
  white: '#FFFFFF',
  blue: '#172A86',
  blueMid: '#2F49C6',
  blueLight: '#90A1F4',
  blueSoft: '#DBE1FA',
  violet: '#431C91',
  violetMid: '#6D3ECC',
  violetLight: '#BFA4F4',
  violetSoft: '#E9E1FA',
  muted: '#7C7F98',
  mutedDark: 'rgba(255,255,255,0.55)',
  line: 'rgba(7, 8, 22, 0.08)',
  lineDark: 'rgba(255, 255, 255, 0.10)',
} as const;

/** Gradient for use on paper backgrounds (dark ends, high contrast). */
export const GRAD = `linear-gradient(100deg, ${C.blue} 0%, ${C.violet} 100%)`;
/** Vivid gradient for fills (buttons, bars, chips). */
export const GRAD_MID = `linear-gradient(100deg, ${C.blueMid} 0%, ${C.violetMid} 100%)`;
/** Light gradient for text / strokes on ink backgrounds. */
export const GRAD_LIGHT = `linear-gradient(100deg, ${C.blueLight} 0%, ${C.violetLight} 100%)`;
export const GRAD_V = `linear-gradient(180deg, ${C.blue} 0%, ${C.violet} 100%)`;

export const F = {
  display: '"Jakarta", sans-serif',
  serif: '"Instrument", serif',
  mono: '"JBMono", monospace',
} as const;
