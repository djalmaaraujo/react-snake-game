export interface Food {
  x: number;
  y: number;
}

export interface Game {
  score: number;
  result: "win" | "lose" | null;
  direction: Direction;
}

export interface Direction {
  x: number;
  y: number;
}

export type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export type KeyPressResult = {
  valid: boolean;
  direction: Direction;
};

export interface Config {
  scorePerFood: number;
  scoreWin: number;
  containerDimensions: {
    width: number;
    height: number;
  };
  snakeStartPosition: {
    x: number;
    y: number;
  };
  slotSize: number;
  snakeSize: number;
  speed: number;
  rows: number;
  cols: number;
}

export interface GameState {
  // Snake an array of segments (head is index 0)
  snake: SnakeSegment[];
  food: Food;
  direction: Direction;
  game: Game;
  config: Config;
}

export interface GameStateOutput {
  snakeUpdate?: SnakeSegment[];
  foodUpdate?: Food;
  gameUpdate?: Game;
}

export interface SnakeSegment {
  x: number;
  y: number;
}

export type CanonicalSnake = SnakeSegment[];
