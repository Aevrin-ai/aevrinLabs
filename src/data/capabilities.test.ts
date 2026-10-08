import { describe, expect, it } from "vitest";

import { CAPABILITIES, capability } from "./capabilities";

describe("the six capabilities", () => {
  it("lists all six, once each", () => {
    expect(CAPABILITIES.map((c) => c.id)).toEqual(["inventory", "risk", "access", "guardrails", "audit", "spend"]);
  });

  it("splits them two each into See, Control and Prove", () => {
    for (const group of ["See", "Control", "Prove"] as const) {
      expect(CAPABILITIES.filter((c) => c.group === group)).toHaveLength(2);
    }
  });

  it("gives every capability a name, a menu line, a summary and three ticks", () => {
    for (const c of CAPABILITIES) {
      expect(c.name, c.id).not.toBe("");
      expect(c.blurb, c.id).not.toBe("");
      expect(c.summary, c.id).not.toBe("");
      expect(c.ticks, c.id).toHaveLength(3);
    }
  });

  it("gives each home page section three points", () => {
    for (const id of ["inventory", "risk", "access", "guardrails"] as const) {
      expect(capability(id).points, id).toHaveLength(3);
    }
  });

  it("explains what an MCP server is where the home page first names one", () => {
    const text = capability("inventory").points.map((p) => p.text).join(" ");
    expect(text).toMatch(/An MCP server is a plug/);
  });

  it("keeps menu lines short enough to sit on one line", () => {
    for (const c of CAPABILITIES) {
      expect(c.blurb.length, c.id).toBeLessThanOrEqual(52);
    }
  });
});
