
export type Shape = number[][];

export interface Piece {
  pos: { x: number; y: number };
  shape: Shape;
  type: string;
  collided: boolean;
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
}

export type MoveDirection = { x: number; y: number };
