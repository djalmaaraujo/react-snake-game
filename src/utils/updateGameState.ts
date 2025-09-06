import type {
  Food,
  Game,
  Config,
  Direction,
  GameState,
  GameStateOutput,
} from "../types";
import { hasEatenFood, isWallCollision, isSelfCollision } from "./game";
import { genFoodCoords } from "./elements/food";
import type { SnakeSegment } from "../types";

/**
 * Calculates the new snake position based on current position and direction
 */
export const calculateSnakeMovement = (
  head: SnakeSegment,
  direction: Direction,
  config: Config
): SnakeSegment => {
  return {
    x: head.x + direction.x * config.slotSize,
    y: head.y + direction.y * config.slotSize,
  };
};

/**
 * Handles food consumption and scoring
 */
export const handleFoodConsumption = (
  newHead: SnakeSegment,
  food: Food,
  game: Game,
  config: Config
): { newGame: Game; newFood?: Food } => {
  if (!hasEatenFood(newHead, food)) {
    return { newGame: game };
  }

  // Snake ate food - update score
  const newScore = game.score + config.scorePerFood;
  const result = newScore >= config.scoreWin ? "win" : null;

  const newGame: Game = {
    score: newScore,
    result,
    direction: game.direction,
  };

  // If game is won, don't generate new food
  if (result === "win") {
    return { newGame };
  }

  // Generate new food for next round
  const newFood = genFoodCoords(config);
  return { newGame, newFood };
};

/**
 * Builds the next snake arrangement using tail-first semantics
 * - Always inserts the new head at index 0
 * - Pops the last tail segment unless the snake grew
 */
export const buildNextSnake = (
  currentSnake: SnakeSegment[],
  newHead: SnakeSegment,
  grew: boolean
): SnakeSegment[] => {
  return grew
    ? [newHead, ...currentSnake]
    : [newHead, ...currentSnake.slice(0, currentSnake.length - 1)];
};

/**
 * Main game state update function
 * Handles all game logic: movement, collisions, food consumption, scoring
 */
export const updateGameState = (gameState: GameState): GameStateOutput => {
  const { snake, food, direction, game, config } = gameState;

  // Game is already finished, no updates needed
  if (game.result !== null) {
    return {};
  }

  // Calculate new head position (tail-first semantics: push head, pop tail later if not growing)
  const currentHead = snake[0];
  const newHead = calculateSnakeMovement(currentHead, direction, config);

  // Check for wall collision
  if (isWallCollision(newHead, config)) {
    return {
      snakeUpdate: buildNextSnake(snake, newHead, false),
      gameUpdate: { ...game, result: "lose" },
    };
  }

  // Handle food consumption and scoring
  const foodResult = handleFoodConsumption(newHead, food, game, config);

  // Build next snake: always add new head; remove tail only if no growth
  const grew = !!foodResult.newFood || foodResult.newGame.result === "win";
  const nextSnake = buildNextSnake(snake, newHead, grew);

  // Self collision check (head overlapping any body)
  if (isSelfCollision(nextSnake)) {
    return {
      snakeUpdate: nextSnake,
      gameUpdate: { ...game, result: "lose" },
      foodUpdate: foodResult.newFood ?? undefined,
    };
  }

  // Return all updates needed
  return {
    snakeUpdate: nextSnake,
    gameUpdate: foodResult.newGame,
    foodUpdate: foodResult.newFood,
  };
};
