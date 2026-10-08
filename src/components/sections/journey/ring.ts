/*
  The ring at the end of the scroll story, as plain data and geometry: where
  each place sits, which wires join them, and how each wire is routed from the
  measured size of the boxes it joins. Kept apart from the component so the
  routing can be tested on its own.
*/

export type RingNode = { id: string; at: [number, number]; tilt: number; show: number; enter: ["scale", number] | ["blur"] };

// Fixed places on the screen, mirrored left to right, with labels of about
// the same length facing each other so the ring reads as balanced. `show` is
// when each appears and `enter` how: popping up from smaller, or rising out
// of a blur.
export const NODES: RingNode[] = [
  { id: "private", at: [50, 7.5], tilt: 0, show: 0.685, enter: ["scale", 0.8] },
  { id: "mcp", at: [12, 17.5], tilt: -2, show: 0.7, enter: ["scale", 0.96] },
  { id: "audit", at: [88, 17.5], tilt: 2, show: 0.7, enter: ["scale", 0.96] },
  { id: "agents", at: [8.8, 50], tilt: 1.5, show: 0.73, enter: ["blur"] },
  { id: "skills", at: [91.2, 50], tilt: -1.5, show: 0.73, enter: ["blur"] },
  { id: "logins", at: [13, 82.5], tilt: 2, show: 0.77, enter: ["scale", 0.62] },
  { id: "models", at: [87, 82.5], tilt: -2, show: 0.77, enter: ["scale", 0.62] },
  { id: "data", at: [38.5, 92.5], tilt: -1, show: 0.795, enter: ["blur"] },
  { id: "spend", at: [61.5, 92.5], tilt: 1, show: 0.795, enter: ["blur"] },
];

export type WireKind = "top" | "down" | "across" | "straight";
export type Wire = { from: string; to: string; kind: WireKind; draw: [number, number]; accent?: boolean };

// The wires, in the order they grow: out from the top, down both sides, and
// meeting along the bottom.
export const WIRES: Wire[] = [
  { from: "private", to: "mcp", kind: "top", draw: [0.655, 0.7] },
  { from: "private", to: "audit", kind: "top", draw: [0.655, 0.7] },
  { from: "mcp", to: "agents", kind: "down", draw: [0.685, 0.745], accent: true },
  { from: "audit", to: "skills", kind: "down", draw: [0.685, 0.745], accent: true },
  { from: "agents", to: "logins", kind: "down", draw: [0.72, 0.765] },
  { from: "skills", to: "models", kind: "down", draw: [0.72, 0.765] },
  { from: "logins", to: "data", kind: "across", draw: [0.745, 0.8] },
  { from: "models", to: "spend", kind: "across", draw: [0.745, 0.8] },
  { from: "data", to: "spend", kind: "straight", draw: [0.795, 0.84] },
];

// How far a wire stops short of the box it joins, and the radius of its corners.
export const GAP = 6;
export const RADIUS = 16;

export type Pt = [number, number];
export type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

// A path through right-angled points, with each corner rounded.
export function rounded(points: Pt[]) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const r = Math.min(RADIUS, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
    const inX = cx - Math.sign(cx - px) * r;
    const inY = cy - Math.sign(cy - py) * r;
    const outX = cx + Math.sign(nx - cx) * r;
    const outY = cy + Math.sign(ny - cy) * r;
    d += ` L ${inX} ${inY} Q ${cx} ${cy} ${outX} ${outY}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L ${lx} ${ly}`;
}

// The points for one wire, from the boxes of the two places it joins.
export function route(wire: Wire, a: Box, b: Box, width: number): Pt[] {
  const toRight = b.cx > a.cx;
  const side = (box: Box, right: boolean) => (right ? box.x + box.w + GAP : box.x - GAP);
  if (wire.kind === "top") {
    const start: Pt = [side(a, toRight), a.cy];
    const end: Pt = [side(b, !toRight), b.cy];
    const bend = toRight ? width * 0.668 : width * 0.332;
    return [start, [bend, a.cy], [bend, b.cy], end];
  }
  if (wire.kind === "down") {
    const start: Pt = [a.cx, a.y + a.h + GAP];
    const end: Pt = [b.cx, b.y - GAP];
    const mid = (start[1] + end[1]) / 2;
    return [start, [a.cx, mid], [b.cx, mid], end];
  }
  if (wire.kind === "across") {
    const start: Pt = [side(a, toRight), a.cy];
    const end: Pt = [side(b, !toRight), b.cy];
    const mid = (start[0] + end[0]) / 2;
    return [start, [mid, a.cy], [mid, b.cy], end];
  }
  return [
    [side(a, toRight), a.cy],
    [side(b, !toRight), b.cy],
  ];
}

export type RoutedWire = Wire & { d: string; ends: [Pt, Pt] };

// Every wire, routed between the measured boxes, with the two points where it
// ends: that is where its dots are drawn.
export function layoutWires(boxes: Record<string, Box>, width: number): RoutedWire[] {
  return WIRES.map((wire) => {
    const points = route(wire, boxes[wire.from], boxes[wire.to], width);
    return { ...wire, d: rounded(points), ends: [points[0], points[points.length - 1]] };
  });
}
