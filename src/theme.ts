export const C = {
  ink: '#07070F',
  ink2: '#11111F',
  paper: '#F4F5FB',
  white: '#FFFFFF',
  blue: '#2B59FF',
  blueLight: '#7C97FF',
  blueSoft: '#C9D4FF',
  violet: '#7B3CFF',
  violetLight: '#B391FF',
  violetSoft: '#E1D4FF',
  indigo: '#1B1450',
  muted: '#8A8CA6',
  line: 'rgba(20, 20, 40, 0.10)',
  lineDark: 'rgba(255, 255, 255, 0.10)',
} as const;

export const GRAD = `linear-gradient(100deg, ${C.blue} 0%, ${C.violet} 100%)`;
export const GRAD_V = `linear-gradient(180deg, ${C.blue} 0%, ${C.violet} 100%)`;
export const GRAD_SOFT = `linear-gradient(120deg, ${C.blueLight} 0%, ${C.violetLight} 100%)`;

export const F = {
  display: '"Jakarta", sans-serif',
  serif: '"Instrument", serif',
  mono: '"JBMono", monospace',
} as const;
