import { describe, it, expect, vi } from "vitest";
import { drawBoard, resizeCanvas } from "./board";

describe("drawBoard", () => {
  it("draws the board", () => {
    const ctx = {
      fillStyle: "#0d1117",
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    drawBoard(ctx, {
      cols: 10,
      rows: 10,
      slotSize: 20,
      scorePerFood: 10,
      scoreWin: 100,
      containerDimensions: { width: 200, height: 200 },
      snakeStartPosition: { x: 0, y: 0 },
      snakeSize: 20,
      speed: 100,
    });
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 200, 200);
  });
});

describe("resizeCanvas", () => {
  it("resizes the canvas", () => {
    // mock
    const canvas = {
      current: {
        parentElement: {
          getBoundingClientRect: () => ({
            width: 200,
            height: 200,
          }),
        },
      },
    } as unknown as React.RefObject<HTMLCanvasElement>;

    // mock
    const ctx = {
      canvas: { width: 0, height: 0 },
    } as unknown as {
      canvas: { width: number; height: number };
    } as CanvasRenderingContext2D;

    resizeCanvas(canvas, ctx);

    // ctx.canvas.width is not set by resizeCanvas, so we can't test it
    expect(ctx.canvas.width).toBe(200);
    expect(ctx.canvas.height).toBe(200);
  });
});
