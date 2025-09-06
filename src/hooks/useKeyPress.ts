import { useEffect, useState, useCallback } from "react";
import type { ArrowKey, Direction, KeyPressResult } from "../types";

export const useKeyPress = (currentDirection: Direction): KeyPressResult => {
  const [pressedKey, setPressedKey] = useState<ArrowKey | null>(null);

  // Handle key down events - only respond to arrow keys
  const downHandler = useCallback(({ key }: KeyboardEvent): void => {
    // Check if the pressed key is one of our target arrow keys
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      setPressedKey(key as ArrowKey);
    }
  }, []);

  // Handle key up events - reset the pressed key when released
  const upHandler = useCallback(
    ({ key }: KeyboardEvent): void => {
      // Reset if the released key matches our current pressed key
      if (key === pressedKey) {
        setPressedKey(null);
      }
    },
    [pressedKey]
  );

  // Add event listeners for both keydown and keyup
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]);

  // Calculate if the pressed key is valid and what direction it should set
  const getKeyPressResult = (): KeyPressResult => {
    if (!pressedKey) {
      return { valid: false, direction: { x: 0, y: 0 } };
    }

    // Check if the key press is valid based on current direction
    // This prevents the snake from reversing into itself
    switch (pressedKey) {
      case "ArrowUp":
        // Only allow up if currently not moving vertically
        if (currentDirection.y === 0) {
          return { valid: true, direction: { x: 0, y: -1 } };
        }
        break;
      case "ArrowDown":
        // Only allow down if currently not moving vertically
        if (currentDirection.y === 0) {
          return { valid: true, direction: { x: 0, y: 1 } };
        }
        break;
      case "ArrowLeft":
        // Only allow left if currently not moving horizontally
        if (currentDirection.x === 0) {
          return { valid: true, direction: { x: -1, y: 0 } };
        }
        break;
      case "ArrowRight":
        // Only allow right if currently not moving horizontally
        if (currentDirection.x === 0) {
          return { valid: true, direction: { x: 1, y: 0 } };
        }
        break;
    }

    return { valid: false, direction: { x: 0, y: 0 } };
  };

  return getKeyPressResult();
};
