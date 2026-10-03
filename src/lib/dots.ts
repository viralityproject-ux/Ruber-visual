import {C} from '../theme';

/** The 32×18 grid of "pixels" that Act 8c's photo dissolves into and Act 9's globe is built from. */
export const DOT_COLS = 32;
export const DOT_ROWS = 18;
export const DOT_CELL = 60;
export const DOT_R = 7;

export const dotXY = (i: number): [number, number] => [(i % DOT_COLS) * DOT_CELL + DOT_CELL / 2, Math.floor(i / DOT_COLS) * DOT_CELL + DOT_CELL / 2];

export const dotColor = (i: number) => {
  const h = (i * 2654435761) % 997;
  return h % 5 === 0 ? C.violetLight : h % 7 === 0 ? '#FFFFFF' : C.blueLight;
};
