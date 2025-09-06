import type { Food } from "../../types";
import type { Config } from "../../types";

export const genFoodCoords = (config: Config) => {
  return {
    x: Math.floor(Math.random() * config.cols) * config.slotSize,
    y: Math.floor(Math.random() * config.rows) * config.slotSize,
  };
};

export const drawFood = (
  ctx: CanvasRenderingContext2D,
  food: Food,
  config: Config
) => {
  ctx.fillStyle = "#4493f8";
  ctx.fillRect(food.x, food.y, config.slotSize, config.slotSize);
};
