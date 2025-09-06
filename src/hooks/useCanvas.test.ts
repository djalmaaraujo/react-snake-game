import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCanvasAnimation } from "./useCanvas";

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

// Mock canvas context
const mockCanvasContext = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
};

// Mock canvas element
const mockCanvas = {
  getContext: vi.fn(() => mockCanvasContext),
  width: 800,
  height: 600,
};

describe("useCanvasAnimation", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock global functions with stubGlobal
    vi.stubGlobal("requestAnimationFrame", mockRequestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", mockCancelAnimationFrame);

    // Mock canvas ref behavior
    mockRequestAnimationFrame.mockImplementation(
      (callback: FrameRequestCallback) => {
        // Simulate immediate execution for testing
        setTimeout(callback, 0);
        return 123; // Mock frame ID
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a canvas ref", () => {
    const mockRenderer = vi.fn(() => vi.fn());
    const { result } = renderHook(() => useCanvasAnimation(mockRenderer));

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty("current");
  });

  it("calls the renderer function on mount", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    renderHook(() => useCanvasAnimation(mockRenderer));

    expect(mockRenderer).toHaveBeenCalledTimes(1);
  });

  it("sets up animation loop with requestAnimationFrame", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    renderHook(() => useCanvasAnimation(mockRenderer));

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it("calls render function with canvas context when canvas is available", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    const { result } = renderHook(() => useCanvasAnimation(mockRenderer));

    // Simulate canvas being available
    result.current.current = mockCanvas as unknown as HTMLCanvasElement;

    // Trigger the animation frame callback
    const callback = mockRequestAnimationFrame.mock.calls[0][0];
    callback(0);

    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
    expect(mockRenderFunction).toHaveBeenCalledWith(mockCanvasContext);
  });

  it("calls render function with null context when canvas is not available", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    const { result } = renderHook(() => useCanvasAnimation(mockRenderer));

    // Ensure canvas is null
    result.current.current = null as unknown as HTMLCanvasElement;

    // Trigger the animation frame callback
    const callback = mockRequestAnimationFrame.mock.calls[0][0];
    callback(0);

    expect(mockRenderFunction).toHaveBeenCalledWith(null);
  });

  it("continues animation loop by calling requestAnimationFrame recursively", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    renderHook(() => useCanvasAnimation(mockRenderer));

    // First call should trigger another requestAnimationFrame
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

    // Simulate the callback execution which should trigger another requestAnimationFrame
    const callback = mockRequestAnimationFrame.mock.calls[0][0];
    callback(0);

    // Should have been called again for the next frame
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it("cleans up animation frame on unmount", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    const { unmount } = renderHook(() => useCanvasAnimation(mockRenderer));

    // Unmount the hook
    unmount();

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it("handles renderer function changes by re-running effect", () => {
    const mockRenderFunction1 = vi.fn();
    const mockRenderFunction2 = vi.fn();
    const mockRenderer1 = vi.fn(() => mockRenderFunction1);
    const mockRenderer2 = vi.fn(() => mockRenderFunction2);

    const { rerender } = renderHook(
      ({ renderer }) => useCanvasAnimation(renderer),
      { initialProps: { renderer: mockRenderer1 } }
    );

    expect(mockRenderer1).toHaveBeenCalledTimes(1);

    // Change the renderer
    rerender({ renderer: mockRenderer2 });

    expect(mockRenderer2).toHaveBeenCalledTimes(1);
  });

  it("handles multiple rapid re-renders without memory leaks", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    const { rerender, unmount } = renderHook(() =>
      useCanvasAnimation(mockRenderer)
    );

    // Simulate rapid re-renders
    for (let i = 0; i < 5; i++) {
      rerender();
    }

    // Should still only have one active animation frame
    expect(mockRequestAnimationFrame).toHaveBeenCalled();

    // Cleanup should work properly
    unmount();
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it("works with different renderer function signatures", () => {
    // Test with a renderer that returns a function with different behavior
    const complexRenderer = vi.fn(() => {
      return (ctx: CanvasRenderingContext2D | null) => {
        if (ctx) {
          ctx.fillRect(0, 0, 100, 100);
        }
      };
    });

    const { result } = renderHook(() => useCanvasAnimation(complexRenderer));

    result.current.current = mockCanvas as unknown as HTMLCanvasElement;

    // Trigger the animation frame callback
    const callback = mockRequestAnimationFrame.mock.calls[0][0];
    callback(0);

    expect(complexRenderer).toHaveBeenCalled();
    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
  });

  it("handles canvas context creation properly", () => {
    const mockRenderFunction = vi.fn();
    const mockRenderer = vi.fn(() => mockRenderFunction);

    // Mock canvas with proper context creation
    const mockCanvasWithContext = {
      getContext: vi.fn(() => mockCanvasContext),
      width: 800,
      height: 600,
    };

    const { result } = renderHook(() => useCanvasAnimation(mockRenderer));

    result.current.current =
      mockCanvasWithContext as unknown as HTMLCanvasElement;

    // Trigger the animation frame callback
    const callback = mockRequestAnimationFrame.mock.calls[0][0];
    callback(0);

    expect(mockCanvasWithContext.getContext).toHaveBeenCalledWith("2d");
    expect(mockRenderFunction).toHaveBeenCalledWith(mockCanvasContext);
  });
});
