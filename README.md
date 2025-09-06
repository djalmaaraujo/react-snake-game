# Snake Game | React + TypeScript + Tailwind CSS

This is an experiment project that combines React, TypeScript and TailwindCSS.

<img width="512" alt="SCR-20250906-rhrv" src="https://github.com/user-attachments/assets/919fb918-5fe7-45f4-bb85-ae2d8ba3b3e5" />
<img width="512" alt="SCR-20250906-rhkx" src="https://github.com/user-attachments/assets/424a21e3-d95d-4dc4-acf6-3ab31aac4c2d" />
<img width="512" alt="SCR-20250906-rhjn" src="https://github.com/user-attachments/assets/b1c182fb-d1d7-448e-af94-54ab6eda93c0" />

## Live Demo

Go to: [https://react-snake-game-sigma.vercel.app/](https://react-snake-game-sigma.vercel.app/)

## Essential to have in this project

- React 18 or later.
- Functional components and hooks.
- Unit tests.
- Keyboard controls.
- No usage of A.I.

## Nice‑to‑Have

- TypeScript.
- Tailwind CSS for styling and layout.

## Gameplay Mechanics Checklist

- [x] _Movement_: The snake moves automatically one cell every tick (e.g., every X ms). Arrow keys do not move the snake, they only change its direction for the next tick. Hitting any wall immediately ends the game.

- [x] _Growth Rule_: The snake gains +1 segment each time the food is eaten.

- [x] _Items_: A single food item (blue) is always present on an empty cell. Eating it adds +3 points and immediately spawns new food elsewhere.

- [x] _Scoring_: Display the current score permanently on screen.

- [x] _Game Over_: The session ends when any of the following occurs:

1. Score ≥ 30
2. Snake collides with a wall
3. Snake collides with itself

## Files and Folders

```
react-snake-game/
├── 📄 Documentation & Assets
│ ├── README.md # Project documentation & game rules
│ ├── index.html # Main HTML entry point
│ └── public/
│
└── 📁 src/ (Source Code)
├── 📄 Core Application Files
│ ├── main.tsx # React app entry point
│ ├── App.tsx # Main game component & logic
│ ├── types.ts # TypeScript type definitions
│ └── index.css # Global styles & Tailwind imports
│
├── 📁 components/ (UI Components)
│ ├── YouWin.tsx # Win state overlay component
│ ├── YouLose.tsx # Lose state overlay component
│
├── 📁 hooks/ (Custom React Hooks)
│ ├── useCanvas.ts # Canvas animation & rendering hook
│ └── useKeyPress.ts # Keyboard input detection hook
│
└── 📁 utils/ (Game Logic & Utilities)
├── game.ts # Core game configuration & collision logic
└── elements/ (Canvas Drawing Functions)
├── board.ts # Game board drawing & canvas utilities
├── updateGamestate.ts # Handles the in-game updates and calculations
├── snake.ts # Snake rendering function
└── food.ts # Food generation & rendering
```

## General decisions

### Canvas vs. Regular react components, while, etc

- Using canvas for the snake game was a better choice due to its superior performance for real-time rendering. Unlike regular React components, which trigger re-renders for every change in state, canvas allows direct, low-level manipulation of pixels. This avoids the overhead of the React reconciliation process, making it ideal for games where frequent updates are necessary for smooth animation.

### Collisions

- _Wall Collision_: Checks if snake head moves outside the 20x20 grid boundaries (x < 0, x ≥ 400, y < 0, or y ≥ 400 pixels). Result: Game ends with "lose" state immediately.
- _Self Collision_: Checks if snake head overlaps any body segment by comparing head coordinates (x,y) with all body segment positions. Result: Game ends with "lose" state after the collision occurs.
- _Food Collision (eat)_: Checks if snake head position exactly matches food position (x === food.x && y === food.y). Result: Score increases by 3 points, snake grows by 1 segment (keeps old tail), new food spawns randomly, and game ends with "win" if score reaches 30 points. The collision system uses a priority order: wall collision is checked first, then food consumption, then self-collision is checked on the resulting snake state. This ensures proper game flow and prevents edge cases.

## Hooks explanation

- _useCanvas_: Custom hook managing canvas animation loop using requestAnimationFrame with proper cleanup. It encapsulates the request animation frame loop and reduces a lot of boilerplate.

- _useKeyPress_: Keyboard event listener hook that tracks individual key press states (Arrow keys).

## How to Run

- Clone the repository
- cd `react-snake-game`
- Install dependencies: `npm install`
- Run the development server: `npm run dev`

## How to run the tests

This project uses `vitest` + `react-testing-library`. Run the tests with:

```
npm run test
```

## How to play

After running the project, use the <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> arrow keys to control the snake.

## Available configuration:

- **Speed**: How fast the snake moves in milliseconds per step. (Default: `200`)
- **Snake size**: The initial number of segments in the snake. (Default: `5`)
- **Block size**: The size (in pixels) of each grid square. (Default: `20`)
- **Snake start position**: The starting x and y coordinates of the snake's head. (Default: `{ x: 100, y: 100 }`)
- **Score to win**: The score required to win the game. (Default: `30`)
- **Score per food**: The number of points gained for each food eaten. (Default: `3`)

You can change the configuration in `src/utils/game.ts`.
