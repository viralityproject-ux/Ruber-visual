import React from 'react';
import {useT} from '../lib/scene';
import {ease, prog} from '../lib/anim';

// 24x24 line icons. Each entry is a list of path `d` strings (drawn with stroke).
export const ICONS: Record<string, string[]> = {
  camera: ['M3 8.5A2.5 2.5 0 0 1 5.5 6H7l1.6-2.2h6.8L17 6h1.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z', 'M12 9.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6z'],
  bolt: ['M13 2 4 14h7l-1 8 9-12h-7z'],
  ruler: ['M3 16.5 16.5 3 21 7.5 7.5 21z', 'M7 12.5l2 2', 'M10 9.5l2 2', 'M13 6.5l2 2', 'M8.5 11l1 1', 'M11.5 8l1 1'],
  target: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z', 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z', 'M12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'],
  bulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z'],
  play: ['M7 4.5v15l12-7.5z'],
  building: ['M4 21V5l8-3v19', 'M12 8h8v13', 'M2 21h20', 'M7 8h2', 'M7 12h2', 'M7 16h2', 'M15 12h2', 'M15 16h2'],
  rocket: ['M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2', 'M9 13l2 2', 'M14.5 3.5C18 3 21 3 21 3s0 3-.5 6.5c-.6 3.9-4 7-8 8.5L9 14.5C10.5 10.5 13.6 7.1 14.5 3.5z', 'M15.5 8.5a1 1 0 1 1 0 .01'],
  heart: ['M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z'],
  tag: ['M3 12.2V4a1 1 0 0 1 1-1h8.2a1 1 0 0 1 .7.3l8.4 8.4a1 1 0 0 1 0 1.4l-8.2 8.2a1 1 0 0 1-1.4 0L3.3 12.9a1 1 0 0 1-.3-.7z', 'M8 7.5a.5.5 0 1 1 0 .01'],
  chat: ['M4 5h16v11H9l-5 4z', 'M8 9.5h8', 'M8 12.5h5'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21c.8-4 4-6 8-6s7.2 2 8 6'],
  users: ['M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5', 'M16 4.3a3.5 3.5 0 0 1 0 6.4', 'M18 14.8c2 .7 3.2 2.5 3.5 5.2'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z'],
  check: ['M4.5 12.5l5 5L20 7'],
  calendar: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v5', 'M16 3v5'],
  clapper: ['M3 10h18v10H3z', 'M3 10l1.5-5.5 17-1.5L21 6', 'M7.5 5l2.5 4.6', 'M13 4.5l2.5 4.8'],
  doc: ['M6 2.5h8l5 5V21a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 6 21z', 'M14 2.5V7.5h5', 'M9 12h7', 'M9 15.5h7', 'M9 19h4'],
  film: ['M3 4h18v16H3z', 'M7 4v16', 'M17 4v16', 'M3 8h4', 'M3 12h4', 'M3 16h4', 'M17 8h4', 'M17 12h4', 'M17 16h4'],
  phone: ['M7 2.5h10a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V4A1.5 1.5 0 0 1 7 2.5z', 'M10.5 18.5h3'],
  image: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M15.5 8.5a1 1 0 1 1 0 .01'],
  sparkle: ['M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z'],
  arrow: ['M4 12h16', 'M14 6l6 6-6 6'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'],
  globe: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z', 'M3 12h18', 'M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z'],
  megaphone: ['M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1z', 'M19 9a4 4 0 0 1 0 6'],
  mic: ['M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z', 'M5.5 11.5a6.5 6.5 0 0 0 13 0', 'M12 18v3'],
  light: ['M9 3h6l3 7H6z', 'M12 10v11', 'M8 21h8'],
  pin: ['M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z', 'M12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z'],
  shirt: ['M8 3l-5 3 2 4 2.5-1V21h9V9l2.5 1 2-4-5-3c-.5 1.6-2 2.5-4 2.5S8.5 4.6 8 3z'],
  clock: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z', 'M12 7v5l3 2'],
  comment: ['M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z'],
  share: ['M21 3 10 14', 'M21 3l-7 18-4-7-7-4z'],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  move: ['M12 2v20', 'M2 12h20', 'M9 5l3-3 3 3', 'M9 19l3 3 3-3', 'M5 9l-3 3 3 3', 'M19 9l3 3-3 3'],
};

export const Icon: React.FC<{
  name: keyof typeof ICONS | string;
  size: number;
  color?: string;
  stroke?: number;
  draw?: number; // start time for a stroke draw-on animation
  drawDur?: number;
  fill?: string;
  style?: React.CSSProperties;
}> = ({name, size, color = 'currentColor', stroke = 1.8, draw, drawDur = 0.6, fill = 'none', style}) => {
  const t = useT();
  const p = draw === undefined ? 1 : prog(t, draw, drawDur, ease.outCubic);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible', ...style}}>
      {(ICONS[name] ?? []).map((d, i) => (
        <path
          key={i}
          d={d}
          fill={fill}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      ))}
    </svg>
  );
};
