import type { Config, Food } from "../types";
import type { SnakeSegment, CanonicalSnake } from "../types";

export const slotSize = 20;
export const snakeSize = 5;
export const speed = 200;
export const rows = 20;
export const cols = 20;

export const config: Config = {
  scorePerFood: 3,
  scoreWin: 30,
  containerDimensions: {
    width: cols * slotSize,
    height: rows * slotSize,
  },
  snakeStartPosition: {
    x: 5 * slotSize,
    y: 5 * slotSize,
  },
  slotSize,
  snakeSize,
  speed,
  rows,
  cols,
};

// Check if the head is at the food position
export const hasEatenFood = (head: SnakeSegment, food: Food) => {
  return head.x === food.x && head.y === food.y;
};

// Check if a head is outside of the playable area
export const isWallCollision = (head: SnakeSegment, config: Config) => {
  return (
    head.x < 0 ||
    head.x >= config.cols * config.slotSize ||
    head.y < 0 ||
    head.y >= config.rows * config.slotSize
  );
};

// Check if head collides with any body segment
export const isSelfCollision = (snake: CanonicalSnake) => {
  if (!snake.length) return false;

  const [head, ...body] = snake;

  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};
