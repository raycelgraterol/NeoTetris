
import { Shape, Piece, Theme } from './types';

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

export const THEMES: Record<string, Theme> = {
  earth: {
    id: 'earth',
    name: 'Tierra',
    description: 'Colores orgánicos y naturales de nuestro planeta.',
    colors: {
      I: '#2D5A27', // Bosque profundo
      J: '#1A4D64', // Océano
      L: '#8B4513', // Tierra/Madera
      O: '#F4A460', // Arena
      S: '#556B2F', // Musgo
      T: '#808080', // Piedra
      Z: '#A52A2A', // Arcilla
    }
  },
  pink: {
    id: 'pink',
    name: 'Mujeres (Pink)',
    description: 'Tonos rosados y vibrantes con elegancia.',
    colors: {
      I: '#FF1493',
      J: '#FF69B4',
      L: '#FFB6C1',
      O: '#FFC0CB',
      S: '#DB7093',
      T: '#C71585',
      Z: '#E0115F',
    }
  },
  metallic: {
    id: 'metallic',
    name: 'Metálico',
    description: 'Brillo industrial y materiales preciosos.',
    colors: {
      I: '#D4AF37', // Oro
      J: '#C0C0C0', // Plata
      L: '#CD7F32', // Bronce
      O: '#E5E4E2', // Platino
      S: '#A5A9B4', // Acero
      T: '#43464B', // Hierro
      Z: '#B87333', // Cobre
    }
  },
  space: {
    id: 'space',
    name: 'Espacio',
    description: 'Nebulosas, estrellas y el vacío profundo.',
    colors: {
      I: '#4B0082', // Indigo
      J: '#000080', // Marina
      L: '#9400D3', // Violeta
      O: '#000033', // Espacio profundo
      S: '#8A2BE2', // Azul violeta
      T: '#9932CC', // Orquídea oscuro
      Z: '#483D8B', // Azul pizarra oscuro
    }
  },
  planets: {
    id: 'planets',
    name: 'Planetas',
    description: 'Los gigantes de nuestro sistema solar.',
    colors: {
      I: '#A5A5A5', // Mercurio
      J: '#E3BB76', // Venus
      L: '#2271B3', // Tierra
      O: '#E27B58', // Marte
      S: '#D39C7E', // Júpiter
      T: '#C5AB6E', // Saturno
      Z: '#BBE1E4', // Urano
    }
  }
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
