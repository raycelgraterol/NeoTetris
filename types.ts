
export type Shape = number[][];

export interface Piece {
  pos: { x: number; y: number };
  shape: Shape;
  type: string;
  collided: boolean;
}

export interface Theme {
  id: string;
  name: string;
  colors: Record<string, string>;
  description: string;
}

export interface GameState {
  grid: (string | 0)[][];
  activePiece: Piece;
  nextPiece: Piece;
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  aiHint: string;
  theme: string;
}

export type MoveDirection = { x: number; y: number };
