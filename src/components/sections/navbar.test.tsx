import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderPage } from "@/test/helpers";
import Navbar from "./navbar";

const panel = () => document.getElementById("nav-panel")!;

describe("the navbar", () => {
  it("opens the Product menu with its six items", async () => {
    renderPage(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Product" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const links = within(panel()).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      expect.stringContaining("Agent inventory"),
      expect.stringContaining("Risk scores"),
      expect.stringContaining("Identities and access"),
      expect.stringContaining("Live guardrails"),
      expect.stringContaining("Audit trail"),
      expect.stringContaining("Usage and spend"),
    ]);
  });

  it("swaps one menu for another without closing in between", async () => {
    renderPage(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "Product" }));
    await userEvent.click(screen.getByRole("button", { name: "Company" }));
    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "true");
    expect(within(panel()).getByRole("link", { name: /About us/ })).toHaveAttribute("href", "/about");
  });

  it("closes on Escape and hands focus back to the menu button", async () => {
    renderPage(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Product" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(panel()).toHaveAttribute("inert");
  });

  it("closes when a menu item is chosen", async () => {
    renderPage(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "Company" }));
    await userEvent.click(within(panel()).getByRole("link", { name: /Contact us/ }));
    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the phone menu with both menus and both buttons", async () => {
    renderPage(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(within(panel()).getByRole("link", { name: /Agent inventory/ })).toBeInTheDocument();
    expect(within(panel()).getByRole("link", { name: /About us/ })).toBeInTheDocument();
    expect(within(panel()).getByRole("link", { name: "Talk to us" })).toHaveAttribute("href", "/contact");
  });

  it("opens the waitlist from the bar", async () => {
    const { openWaitlist } = renderPage(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: /Join the waitlist/ }));
    expect(openWaitlist).toHaveBeenCalledOnce();
  });

  it("names the home link after the brand", () => {
    renderPage(<Navbar />);
    expect(screen.getByRole("link", { name: "Aevrinlabs" })).toHaveAttribute("href", "/");
  });
});
