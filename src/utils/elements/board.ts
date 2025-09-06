import type { Config } from "../../types";

export const drawBoard = (ctx: CanvasRenderingContext2D, config: Config) => {
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(
    0,
    0,
    config.cols * config.slotSize,
    config.rows * config.slotSize
  );
};

export const resizeCanvas = (
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D
) => {
  if (!canvas?.current) {
    return;
  }

  const container = canvas.current.parentElement;

  if (!container) {
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const size = Math.min(containerRect.width, containerRect.height);

  ctx.canvas.width = size;
  ctx.canvas.height = size;
};
