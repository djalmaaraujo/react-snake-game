import { describe, it, expect } from "vitest";
import {
  calculateSnakeMovement,
  handleFoodConsumption,
  buildNextSnake,
  updateGameState,
} from "./updateGameState";

import { config } from "./game";

import type { GameState, SnakeSegment, Food, Game, Direction } from "../types";

describe("calculateSnakeMovement", () => {
  it("moves snake right by one slot", () => {
    const head: SnakeSegment = { x: 100, y: 100 };
    const direction: Direction = { x: 1, y: 0 };

    const result = calculateSnakeMovement(head, direction, config);

    expect(result).toEqual({ x: 120, y: 100 });
  });

  it("moves snake left by one slot", () => {
    const head: SnakeSegment = { x: 100, y: 100 };
    const direction: Direction = { x: -1, y: 0 };

    const result = calculateSnakeMovement(head, direction, config);

    expect(result).toEqual({ x: 80, y: 100 });
  });

  it("moves snake up by one slot", () => {
    const head: SnakeSegment = { x: 100, y: 100 };
    const direction: Direction = { x: 0, y: -1 };

    const result = calculateSnakeMovement(head, direction, config);

    expect(result).toEqual({ x: 100, y: 80 });
  });

  it("moves snake down by one slot", () => {
    const head: SnakeSegment = { x: 100, y: 100 };
    const direction: Direction = { x: 0, y: 1 };

    const result = calculateSnakeMovement(head, direction, config);

    expect(result).toEqual({ x: 100, y: 120 });
  });
});

describe("handleFoodConsumption", () => {
  it("returns unchanged game when snake does not eat food", () => {
    const newHead: SnakeSegment = { x: 100, y: 100 };
    const food: Food = { x: 200, y: 200 };
    const game: Game = { score: 0, result: null, direction: { x: 1, y: 0 } };

    const result = handleFoodConsumption(newHead, food, game, config);

    expect(result).toEqual({ newGame: game });
  });

  it("increases score when snake eats food", () => {
    const newHead: SnakeSegment = { x: 100, y: 100 };
    const food: Food = { x: 100, y: 100 };
    const game: Game = { score: 6, result: null, direction: { x: 1, y: 0 } };

    const result = handleFoodConsumption(newHead, food, game, config);

    expect(result.newGame.score).toBe(9);
    expect(result.newGame.result).toBeNull();
    expect(result.newFood).toBeDefined();
  });

  it("sets game result to win when score reaches win threshold", () => {
    const newHead: SnakeSegment = { x: 100, y: 100 };
    const food: Food = { x: 100, y: 100 };
    const game: Game = { score: 27, result: null, direction: { x: 1, y: 0 } };

    const result = handleFoodConsumption(newHead, food, game, config);

    expect(result.newGame.score).toBe(30);
    expect(result.newGame.result).toBe("win");
    expect(result.newFood).toBeUndefined();
  });

  it("generates new food when snake eats food and game continues", () => {
    const newHead: SnakeSegment = { x: 100, y: 100 };
    const food: Food = { x: 100, y: 100 };
    const game: Game = { score: 0, result: null, direction: { x: 1, y: 0 } };

    const result = handleFoodConsumption(newHead, food, game, config);

    expect(result.newFood).toBeDefined();
    expect(result.newFood?.x).toBeGreaterThanOrEqual(0);
    expect(result.newFood?.y).toBeGreaterThanOrEqual(0);
  });
});

describe("buildNextSnake", () => {
  it("adds new head and removes tail when snake does not grow", () => {
    const currentSnake: SnakeSegment[] = [
      { x: 100, y: 100 },
      { x: 80, y: 100 },
      { x: 60, y: 100 },
    ];
    const newHead: SnakeSegment = { x: 120, y: 100 };
    const grew = false;

    const result = buildNextSnake(currentSnake, newHead, grew);

    expect(result).toEqual([
      { x: 120, y: 100 },
      { x: 100, y: 100 },
      { x: 80, y: 100 },
    ]);
    expect(result.length).toBe(3);
  });

  it("adds new head and keeps tail when snake grows", () => {
    const currentSnake: SnakeSegment[] = [
      { x: 100, y: 100 },
      { x: 80, y: 100 },
    ];
    const newHead: SnakeSegment = { x: 120, y: 100 };
    const grew = true;

    const result = buildNextSnake(currentSnake, newHead, grew);

    expect(result).toEqual([
      { x: 120, y: 100 },
      { x: 100, y: 100 },
      { x: 80, y: 100 },
    ]);
    expect(result.length).toBe(3);
  });

  it("handles single segment snake growing", () => {
    const currentSnake: SnakeSegment[] = [{ x: 100, y: 100 }];
    const newHead: SnakeSegment = { x: 120, y: 100 };
    const grew = true;

    const result = buildNextSnake(currentSnake, newHead, grew);

    expect(result).toEqual([
      { x: 120, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("handles single segment snake not growing", () => {
    const currentSnake: SnakeSegment[] = [{ x: 100, y: 100 }];
    const newHead: SnakeSegment = { x: 120, y: 100 };
    const grew = false;

    const result = buildNextSnake(currentSnake, newHead, grew);

    expect(result).toEqual([{ x: 120, y: 100 }]);
  });
});

describe("updateGameState", () => {
  const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
    snake: [{ x: 100, y: 100 }],
    food: { x: 200, y: 200 },
    direction: { x: 1, y: 0 },
    game: { score: 0, result: null, direction: { x: 1, y: 0 } },
    config,
    ...overrides,
  });

  it("returns empty object when game is already finished", () => {
    const gameState = createGameState({
      game: { score: 0, result: "lose", direction: { x: 1, y: 0 } },
    });

    const result = updateGameState(gameState);

    expect(result).toEqual({});
  });

  it("returns empty object when game is won", () => {
    const gameState = createGameState({
      game: { score: 30, result: "win", direction: { x: 1, y: 0 } },
    });

    const result = updateGameState(gameState);

    expect(result).toEqual({});
  });

  it("handles wall collision and sets game to lose", () => {
    const gameState = createGameState({
      snake: [{ x: 0, y: 100 }],
      direction: { x: -1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate).toEqual([{ x: -20, y: 100 }]);
    expect(result.gameUpdate?.result).toBe("lose");
    expect(result.foodUpdate).toBeUndefined();
  });

  it("handles self collision and sets game to lose", () => {
    const gameState = createGameState({
      snake: [
        { x: 100, y: 100 },
        { x: 120, y: 100 },
        { x: 100, y: 100 },
      ],
      direction: { x: 0, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.gameUpdate?.result).toBe("lose");
  });

  it("moves snake normally when no collisions occur", () => {
    const gameState = createGameState({
      snake: [{ x: 100, y: 100 }],
      direction: { x: 1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate).toEqual([{ x: 120, y: 100 }]);
    expect(result.gameUpdate).toEqual({
      score: 0,
      result: null,
      direction: { x: 1, y: 0 },
    });
    expect(result.foodUpdate).toBeUndefined();
  });

  it("handles food consumption and updates score", () => {
    const gameState = createGameState({
      snake: [{ x: 100, y: 100 }],
      food: { x: 120, y: 100 },
      direction: { x: 1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate).toEqual([
      { x: 120, y: 100 },
      { x: 100, y: 100 },
    ]);
    expect(result.gameUpdate?.score).toBe(3);
    expect(result.gameUpdate?.result).toBeNull();
    expect(result.foodUpdate).toBeDefined();
  });

  it("handles winning condition when score reaches threshold", () => {
    const gameState = createGameState({
      snake: [{ x: 100, y: 100 }],
      food: { x: 120, y: 100 },
      direction: { x: 1, y: 0 },
      game: { score: 27, result: null, direction: { x: 1, y: 0 } },
    });

    const result = updateGameState(gameState);

    expect(result.gameUpdate?.score).toBe(30);
    expect(result.gameUpdate?.result).toBe("win");
    expect(result.foodUpdate).toBeUndefined();
  });

  it("handles snake growing when eating food", () => {
    const gameState = createGameState({
      snake: [{ x: 100, y: 100 }],
      food: { x: 120, y: 100 },
      direction: { x: 1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate?.length).toBe(2);
    expect(result.snakeUpdate?.[0]).toEqual({ x: 120, y: 100 });
    expect(result.snakeUpdate?.[1]).toEqual({ x: 100, y: 100 });
  });

  it("handles snake not growing when not eating food", () => {
    const gameState = createGameState({
      snake: [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
      ],
      food: { x: 200, y: 200 },
      direction: { x: 1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate?.length).toBe(2);
    expect(result.snakeUpdate?.[0]).toEqual({ x: 120, y: 100 });
    expect(result.snakeUpdate?.[1]).toEqual({ x: 100, y: 100 });
  });

  it("handles multiple snake segments correctly", () => {
    const gameState = createGameState({
      snake: [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 },
      ],
      direction: { x: 1, y: 0 },
    });

    const result = updateGameState(gameState);

    expect(result.snakeUpdate).toEqual([
      { x: 120, y: 100 },
      { x: 100, y: 100 },
      { x: 80, y: 100 },
    ]);
  });
});
