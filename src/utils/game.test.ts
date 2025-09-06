import { hasEatenFood, isWallCollision, isSelfCollision } from "./game";
import { config } from "./game";
import { describe, it, expect } from "vitest";

describe("isWallCollision", () => {
  it("returns true if the snake is colliding with the wall", () => {
    expect(isWallCollision({ x: -1, y: -1 }, config)).toBe(true);
  });

  // The snake is inside the grid if x and y are >= 0 and < cols*slotSize and rows*slotSize.
  it("returns false if the snake is not colliding with the wall", () => {
    const insideX = (config.cols - 1) * config.slotSize; // 380 is valid; 400 is out
    const insideY = (config.rows - 1) * config.slotSize;
    expect(isWallCollision({ x: insideX, y: insideY }, config)).toBe(false);
  });
});

describe("hasEatenFood", () => {
  it("returns true if the snake has eaten the food", () => {
    expect(hasEatenFood({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
  });

  it("returns false if the snake has not eaten the food", () => {
    expect(hasEatenFood({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false);
  });
});

describe("isSelfCollision", () => {
  it("returns false for single-segment snake", () => {
    expect(isSelfCollision([{ x: 0, y: 0 }])).toBe(false);
  });

  it("returns true when head overlaps a body segment", () => {
    const snake = [
      { x: 20, y: 0 },
      { x: 20, y: 20 },
      { x: 0, y: 20 },
      { x: 0, y: 0 },
      { x: 20, y: 0 }, // body segment with same position as new head
    ];
    expect(isSelfCollision(snake)).toBe(true);
  });
});
