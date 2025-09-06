import type { Config } from "../../types";
import type { SnakeSegment } from "../../types";

export const drawSnake = (
  ctx: CanvasRenderingContext2D,
  snake: SnakeSegment[],
  config: Config
) => {
  ctx.fillStyle = "#05df72";
  for (const segment of snake) {
    ctx.fillRect(segment.x, segment.y, config.slotSize, config.slotSize);
  }
};
