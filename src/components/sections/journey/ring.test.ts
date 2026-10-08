import { describe, expect, it } from "vitest";

import { GAP, layoutWires, NODES, rounded, route, WIRES, type Box } from "./ring";

const WIDTH = 1440;
const HEIGHT = 720;

// Lays the places out the way the component does, with every box the same
// size, so mirrored places get mirrored wires.
function boxesFor(size = { w: 160, h: 48 }): Record<string, Box> {
  return Object.fromEntries(
    NODES.map((node) => {
      const cx = (node.at[0] / 100) * WIDTH;
      const cy = (node.at[1] / 100) * HEIGHT;
      return [node.id, { x: cx - size.w / 2, y: cy - size.h / 2, w: size.w, h: size.h, cx, cy }];
    })
  );
}

// The distance from a point to the nearest edge of a box, measured outside it.
function gapTo(box: Box, [x, y]: [number, number]) {
  const dx = Math.max(box.x - x, 0, x - (box.x + box.w));
  const dy = Math.max(box.y - y, 0, y - (box.y + box.h));
  return Math.hypot(dx, dy);
}

describe("the ring", () => {
  it("has nine places, each with its own id", () => {
    expect(NODES).toHaveLength(9);
    expect(new Set(NODES.map((n) => n.id)).size).toBe(9);
  });

  it("only wires places that exist", () => {
    const ids = new Set(NODES.map((n) => n.id));
    for (const wire of WIRES) {
      expect(ids.has(wire.from), wire.from).toBe(true);
      expect(ids.has(wire.to), wire.to).toBe(true);
    }
  });

  it("puts every place opposite a mirror image of itself", () => {
    for (const node of NODES) {
      const mirror = NODES.find((n) => Math.abs(n.at[0] - (100 - node.at[0])) < 0.01 && n.at[1] === node.at[1]);
      expect(mirror, node.id).toBeDefined();
    }
  });

  it("stops every wire exactly one gap short of the boxes it joins", () => {
    const boxes = boxesFor();
    for (const wire of layoutWires(boxes, WIDTH)) {
      expect(gapTo(boxes[wire.from], wire.ends[0])).toBeCloseTo(GAP, 6);
      expect(gapTo(boxes[wire.to], wire.ends[1])).toBeCloseTo(GAP, 6);
    }
  });

  it("starts and ends each path where its dots are drawn", () => {
    for (const wire of layoutWires(boxesFor(), WIDTH)) {
      const numbers = wire.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
      expect([numbers[0], numbers[1]]).toEqual(wire.ends[0]);
      expect(numbers.slice(-2)).toEqual(wire.ends[1]);
    }
  });

  it("routes the left side as a mirror of the right", () => {
    const wires = layoutWires(boxesFor(), WIDTH);
    const pairs: [string, string][] = [
      ["mcp", "audit"],
      ["agents", "skills"],
      ["logins", "models"],
    ];
    for (const [left, right] of pairs) {
      const a = wires.find((w) => w.to === left)!;
      const b = wires.find((w) => w.to === right)!;
      expect(a.ends[1][0]).toBeCloseTo(WIDTH - b.ends[1][0], 6);
      expect(a.ends[1][1]).toBeCloseTo(b.ends[1][1], 6);
    }
  });

  it("rounds each corner without overshooting short segments", () => {
    const points: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 100],
    ];
    // The corner radius is capped at half the shorter leg, 5 here.
    expect(rounded(points)).toBe("M 0 0 L 5 0 Q 10 0 10 5 L 10 100");
  });

  it("draws a straight wire as two points", () => {
    const boxes = boxesFor();
    const straight = WIRES.find((w) => w.kind === "straight")!;
    expect(route(straight, boxes[straight.from], boxes[straight.to], WIDTH)).toHaveLength(2);
  });
});
