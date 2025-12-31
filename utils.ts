
import { COLS, ROWS } from './constants';
import { Piece, GameState } from './types';

export const createGrid = () =>
  Array.from(Array(ROWS), () => Array(COLS).fill(0));

export const checkCollision = (
  piece: Piece,
  grid: (string | 0)[][],
  move: { x: number; y: number }
) => {
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      if (piece.shape[y][x] !== 0) {
        if (
          !grid[y + piece.pos.y + move.y] ||
          grid[y + piece.pos.y + move.y][x + piece.pos.x + move.x] === undefined ||
          grid[y + piece.pos.y + move.y][x + piece.pos.x + move.x] !== 0
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const rotate = (matrix: number[][], dir: number) => {
  const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
  if (dir > 0) return rotated.map(row => row.reverse());
  return rotated.reverse();
};
