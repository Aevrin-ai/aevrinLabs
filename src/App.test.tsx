import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

// The whole site, routed for real. Reduced motion keeps the scroll story to
// its still version, which is all jsdom can lay out.
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

// Pages and the lower half of the home page load as their own chunks, which
// can take a moment while the rest of the suite runs alongside.
const LOAD = { timeout: 5000 };

function visit(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("the site", () => {
  beforeEach(() => {
    document.head.innerHTML = '<title>x</title><meta name="description" content="x" /><link rel="canonical" href="x" />';
  });

  it("opens on the home page with the hero, then the rest of the page", async () => {
    visit("/");
    expect(screen.getByRole("heading", { level: 1, name: "Your AI agents, working on your rules." })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "AI agents are doing real work now." }, LOAD)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "See every agent at work." }, LOAD)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Questions, answered" })).toBeInTheDocument();
  });

  it("shows the nine places under the still story", async () => {
    visit("/");
    for (const place of ["Private apps", "MCP servers", "Audit trail", "Agents", "Skills", "Logins", "Models", "Data", "Spend"]) {
      expect((await screen.findAllByText(place, { exact: true }, LOAD)).length).toBeGreaterThan(0);
    }
  });

  it.each([
    ["/product", "Six ways to see and guide your AI agents.", "Product | Aevrinlabs"],
    ["/about", "Why we are building Aevrinlabs.", "About us | Aevrinlabs"],
    ["/contact", "Talk to us.", "Contact us | Aevrinlabs"],
    ["/no-such-page", "This page is not here.", "Page not found | Aevrinlabs"],
  ])("routes %s to its page and title", async (path, heading, title) => {
    visit(path);
    expect(await screen.findByRole("heading", { level: 1, name: heading }, LOAD)).toBeInTheDocument();
    expect(document.title).toBe(title);
  });

  it("puts all six capabilities on the product page, each with an anchor", async () => {
    visit("/product");
    await screen.findByRole("heading", { level: 1, name: /Six ways/ }, LOAD);
    for (const id of ["inventory", "risk", "access", "guardrails", "audit", "spend"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("opens and closes the waitlist dialog from the hero", async () => {
    visit("/");
    const user = userEvent.setup();
    const [heroButton] = screen.getAllByRole("button", { name: /Join the waitlist/ }).filter((b) => b.closest("main"));
    await user.click(heroButton);
    expect(await screen.findByRole("dialog", { name: "Join the Aevrinlabs waitlist" }, LOAD)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("ends every page with the footer and a copyright line", async () => {
    visit("/about");
    await screen.findByRole("heading", { level: 1 }, LOAD);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} Aevrinlabs. All rights reserved.`);
  });
});
