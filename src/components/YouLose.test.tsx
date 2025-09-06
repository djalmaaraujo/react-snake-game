import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { YouLose } from "./YouLose";
import { describe, it, expect } from "vitest";

describe("YouLose", () => {
  it("renders the lose message", () => {
    render(<YouLose />);

    expect(screen.getByText("💀 You Lose! 💀")).toBeInTheDocument();
  });
});
