import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { YouWin } from "./YouWin";
import { describe, it, expect } from "vitest";

describe("YouWin", () => {
  it("renders the winner message", () => {
    render(<YouWin />);

    expect(screen.getByText("🎉 You Win! 🎉")).toBeInTheDocument();
  });
});
