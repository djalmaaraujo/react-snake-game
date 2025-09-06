import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: "jsdom",
    globals: true, // Makes global APIs like 'describe', 'it', 'expect' available
    setupFiles: "./vitest.setup.ts", // Optional: for global setup, e.g., extending expect
  },
});
