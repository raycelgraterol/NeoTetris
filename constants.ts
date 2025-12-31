
import { Shape, Piece } from './types';

export const COLS = 10;
export const ROWS = 20;

export const TETROMINOS: Record<string, { shape: Shape; color: string }> = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '0, 240, 240',
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '0, 0, 240',
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '240, 160, 0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '240, 240, 0',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '0, 240, 0',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '160, 0, 240',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '240, 0, 0',
  },
};

export const getRandomTetromino = (): Piece => {
  const keys = Object.keys(TETROMINOS).filter(k => k !== '0');
  const type = keys[Math.floor(Math.random() * keys.length)];
  return {
    pos: { x: 3, y: 0 },
    shape: TETROMINOS[type].shape,
    type,
    collided: false,
  };
};

export const LEVEL_SPEEDS = [
  800, 700, 600, 500, 400, 300, 250, 200, 150, 100
];
