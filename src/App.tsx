import { useState, useEffect } from "react";

// Custom hooks
import { useCanvasAnimation } from "./hooks/useCanvas";
import { useKeyPress } from "./hooks/useKeyPress";

// Elements drawing
import { drawBoard, resizeCanvas } from "./utils/elements/board";
import { drawSnake } from "./utils/elements/snake";
import { drawFood, genFoodCoords } from "./utils/elements/food";

// Game configuration
import { config as config } from "./utils/game";

// Game logic
import { updateGameState } from "./utils/updateGameState";

// Types
import type { Food, Game, GameState } from "./types";
import type { SnakeSegment } from "./types";

// Components
import { YouWin } from "./components/YouWin";
import { YouLose } from "./components/YouLose";

function App() {
  const [lastUpdate, setLastUpdate] = useState(0);
  const [game, setGame] = useState<Game>({
    score: 0,
    result: null,
    direction: { x: 1, y: 0 },
  });
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: config.snakeStartPosition.x, y: config.snakeStartPosition.y },
  ]);

  const direction = game.direction;
  const [food, setFood] = useState<Food>(genFoodCoords(config));

  const boardRef = useCanvasAnimation(() => {
    return (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return;

      // Game finished, stop repainting
      if (game.result !== null) {
        return;
      }

      resizeCanvas(boardRef, ctx);

      // Game timing - only update snake position at intervals of speed
      const now = Date.now();
      const shouldUpdate = now - lastUpdate > config.speed;

      // Frame-local values ensure we draw the latest computed state in this frame
      let frameSnake = snake;
      let frameFood = food;
      let frameGame = game;

      if (shouldUpdate) {
        const gameState: GameState = {
          snake,
          food,
          direction,
          game,
          config,
        };

        const gameUpdateResult = updateGameState(gameState);

        if (gameUpdateResult.snakeUpdate) {
          frameSnake = gameUpdateResult.snakeUpdate;
          setSnake(frameSnake);
        }
        if (gameUpdateResult.foodUpdate) {
          frameFood = gameUpdateResult.foodUpdate;
          setFood(frameFood);
        }
        if (gameUpdateResult.gameUpdate) {
          frameGame = gameUpdateResult.gameUpdate;
          setGame(frameGame);
        }

        setLastUpdate(now);
      }

      drawBoard(ctx, config);
      drawFood(ctx, frameFood, config);
      drawSnake(ctx, frameSnake, config);
    };
  });

  // Key press detection - single hook for all arrow keys with direction validation
  const keyPressResult = useKeyPress(direction);

  // Only allow direction changes that don't reverse the snake
  useEffect(() => {
    if (keyPressResult.valid) {
      setGame({ ...game, direction: keyPressResult.direction });
    }
  }, [keyPressResult, game]);

  const won = game.result === "win";
  const lose = game.result === "lose";

  return (
    <div className="min-h-screen min-w-screen text-white">
      <div className="bg-gray-800 p-4 text-center mb-6">
        <div className="text-2xl font-bold text-green-400">
          Score: {game.score}
        </div>
      </div>

      <div
        className="flex items-center justify-center mx-auto relative"
        style={config.containerDimensions}
      >
        <canvas
          id="board"
          ref={boardRef}
          className="w-full h-full border-2 border-gray-600 rounded-lg shadow-lg"
        />

        {won && <YouWin />}
        {lose && <YouLose />}
      </div>
    </div>
  );
}

export default App;
