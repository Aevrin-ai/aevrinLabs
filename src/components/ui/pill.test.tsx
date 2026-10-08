import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { Pill } from "./pill";

describe("Pill", () => {
  it("is a plain button by default, so it never submits a form by accident", () => {
    render(<Pill>Join</Pill>);
    expect(screen.getByRole("button", { name: "Join" })).toHaveAttribute("type", "button");
  });

  it("can be a submit button", () => {
    render(<Pill type="submit">Send</Pill>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
  });

  it("calls its click handler", async () => {
    const onClick = vi.fn();
    render(<Pill onClick={onClick}>Join</Pill>);
    await userEvent.click(screen.getByRole("button", { name: "Join" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does nothing while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Pill onClick={onClick} disabled>
        Join
      </Pill>
    );
    await userEvent.click(screen.getByRole("button", { name: "Join" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("links to a page of the site with `to`", () => {
    render(
      <MemoryRouter>
        <Pill to="/contact">Talk to us</Pill>
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Talk to us" })).toHaveAttribute("href", "/contact");
  });

  it("links off the site with `href`", () => {
    render(<Pill href="mailto:hello@example.com">Email</Pill>);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:hello@example.com");
  });

  it("keeps its variant and any extra classes", () => {
    render(
      <Pill variant="outline" className="w-full">
        Wide
      </Pill>
    );
    const button = screen.getByRole("button", { name: "Wide" });
    expect(button.className).toContain("border");
    expect(button.className).toContain("w-full");
  });
});
