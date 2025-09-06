import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useKeyPress } from "./useKeyPress";
import type { Direction } from "../types";

describe("useKeyPress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns invalid result initially", () => {
    const { result } = renderHook(() =>
      useKeyPress({ x: 1, y: 0 } as Direction)
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.direction).toEqual({ x: 0, y: 0 });
  });

  it("returns valid direction when arrow key is pressed and movement is allowed", () => {
    const { result } = renderHook(() =>
      useKeyPress({ x: 1, y: 0 } as Direction)
    ); // Moving right

    fireEvent.keyDown(document, { key: "ArrowUp" });

    expect(result.current.valid).toBe(true);
    expect(result.current.direction).toEqual({ x: 0, y: -1 });
  });

  it("returns invalid result when trying to reverse direction", () => {
    const { result } = renderHook(() => useKeyPress({ x: 1, y: 0 })); // Moving right

    fireEvent.keyDown(document, { key: "ArrowLeft" }); // Try to go left (reverse)

    expect(result.current.valid).toBe(false);
    expect(result.current.direction).toEqual({ x: 0, y: 0 });
  });

  it("returns invalid result when trying to reverse vertical direction", () => {
    const { result } = renderHook(() => useKeyPress({ x: 0, y: 1 })); // Moving down

    fireEvent.keyDown(document, { key: "ArrowUp" }); // Try to go up (reverse)

    expect(result.current.valid).toBe(false);
    expect(result.current.direction).toEqual({ x: 0, y: 0 });
  });

  it("returns invalid result when key is released", () => {
    const { result } = renderHook(() => useKeyPress({ x: 1, y: 0 }));

    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(result.current.valid).toBe(true);

    fireEvent.keyUp(document, { key: "ArrowUp" });
    expect(result.current.valid).toBe(false);
  });

  it("ignores non-arrow keys", () => {
    const { result } = renderHook(() => useKeyPress({ x: 1, y: 0 }));

    fireEvent.keyDown(document, { key: "Space" });

    expect(result.current.valid).toBe(false);
    expect(result.current.direction).toEqual({ x: 0, y: 0 });
  });

  it("allows all valid direction changes", () => {
    // Test moving right -> up
    const { result: rightToUp } = renderHook(() => useKeyPress({ x: 1, y: 0 }));
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(rightToUp.current.valid).toBe(true);
    expect(rightToUp.current.direction).toEqual({ x: 0, y: -1 });

    // Test moving up -> left
    const { result: upToLeft } = renderHook(() => useKeyPress({ x: 0, y: -1 }));
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(upToLeft.current.valid).toBe(true);
    expect(upToLeft.current.direction).toEqual({ x: -1, y: 0 });

    // Test moving left -> down
    const { result: leftToDown } = renderHook(() =>
      useKeyPress({ x: -1, y: 0 })
    );
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(leftToDown.current.valid).toBe(true);
    expect(leftToDown.current.direction).toEqual({ x: 0, y: 1 });

    // Test moving down -> right
    const { result: downToRight } = renderHook(() =>
      useKeyPress({ x: 0, y: 1 })
    );
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(downToRight.current.valid).toBe(true);
    expect(downToRight.current.direction).toEqual({ x: 1, y: 0 });
  });

  it("adds and removes event listeners", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useKeyPress({ x: 1, y: 0 }));

    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("keyup", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("keyup", expect.any(Function));
  });
});
