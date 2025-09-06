import { useRef, useEffect, type RefObject } from "react";

export const useCanvasAnimation = (
  renderer: () => (ctx: CanvasRenderingContext2D | null) => void
): RefObject<HTMLCanvasElement> => {
  // Ref for the canvas element
  const canvas = useRef<HTMLCanvasElement>(null!);
  // Ref for the animation frame id
  const frameId = useRef<number>(0);

  useEffect(() => {
    // Get the render function from the renderer
    const render = renderer();

    // Animation update loop
    const update = () => {
      frameId.current = requestAnimationFrame(() => {
        const ctx = canvas.current ? canvas.current.getContext("2d") : null;
        render(ctx);
        update();
      });
    };

    update();

    // Cleanup to avoid memory leaks
    return () => cancelAnimationFrame(frameId.current);
  }, [renderer]);

  return canvas;
};
