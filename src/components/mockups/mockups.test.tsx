import type { ComponentType } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderPage } from "@/test/helpers";
import Access from "./access";
import AuditTrail from "./audit-trail";
import Console from "./console";
import Everywhere from "./everywhere";
import Guardrails from "./guardrails";
import Inventory from "./inventory";
import RiskScore from "./risk-score";
import Spend from "./spend";

// Under reduced motion every mockup opens on its last step, which is the one
// that tells the story. That is the still picture a visitor gets, so it is
// what these tests check.
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => true,
}));

type Case = { name: string; Mockup: ComponentType; label: RegExp; final: string[] };

const CASES: Case[] = [
  {
    name: "agent inventory",
    Mockup: Inventory,
    label: /nobody approved are marked/,
    final: ["42", "Bulk email sender", "files-sync"],
  },
  { name: "risk score", Mockup: RiskScore, label: /high risk score of 86/, final: ["86", "High risk", "Held for review", "Unknown publisher"] },
  { name: "identities and access", Mockup: Access, label: /person's login/, final: ["Ask first", "Read only", "A person's login"] },
  { name: "live guardrails", Mockup: Guardrails, label: /is stopped with a reason/, final: ["Stopped", "Why: Customer data stays inside the company"] },
  { name: "audit trail", Mockup: AuditTrail, label: /record is exported/, final: ["Exported", "Stopped by a rule"] },
  { name: "usage and spend", Mockup: Spend, label: /smaller model/, final: ["Switched", "Saves $2,140 a month"] },
  { name: "where it works", Mockup: Everywhere, label: /chat app and a code editor/, final: ["Chat app", "Code editor"] },
];

describe.each(CASES)("the $name mockup", ({ Mockup, label, final }) => {
  it("is one picture, described in a sentence", () => {
    renderPage(<Mockup />);
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });

  it("shows its final step as a still", () => {
    renderPage(<Mockup />);
    const picture = screen.getByRole("img", { name: label });
    for (const text of final) expect(picture).toHaveTextContent(text);
  });
});

describe("the inventory mockup", () => {
  it("marks exactly two items as not approved", () => {
    renderPage(<Inventory />);
    expect(screen.getAllByText("Not approved")).toHaveLength(2);
  });
});

describe("the hero app window", () => {
  it("shows four agents, each with its risk", () => {
    renderPage(<Console />);
    const picture = screen.getByRole("img", { name: /AI agents, each with its team, its risk/ });
    for (const name of ["Support helper", "Sales agent", "Code reviewer", "Invoice reader"]) expect(picture).toHaveTextContent(name);
    expect(picture).toHaveTextContent("High risk");
  });
});
