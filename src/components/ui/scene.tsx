import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo";

/*
  The brand pattern from the kit, standing in for the painted scenes behind
  product shots: a big ink block, a quiet tint block, one Signal bar, three
  small squares, and the loop drawn large and quiet. Each preset puts the
  blocks somewhere else, so panels down a page read as separate places. It is
  scenery, so it is hidden from assistive technology and never takes a click.
*/

type Box = { l: number; t: number; w: number; h: number };
type Preset = { solid: Box; quiet: Box; signal: Box; loop: { l: number; t: number; w: number }; dots: { l: number; t: number } };

// Every number is a percentage of the panel. Blocks bleed off the edges.
const PRESETS = {
  right: {
    solid: { l: 79, t: -14, w: 9, h: 60 },
    quiet: { l: 90, t: -14, w: 13, h: 36 },
    signal: { l: 90, t: 26, w: 13, h: 14 },
    loop: { l: -9, t: 46, w: 34 },
    dots: { l: 90.5, t: 47 },
  },
  left: {
    solid: { l: 12, t: -14, w: 9, h: 60 },
    quiet: { l: -3, t: -14, w: 13, h: 36 },
    signal: { l: -3, t: 26, w: 13, h: 14 },
    loop: { l: 75, t: 46, w: 34 },
    dots: { l: 4, t: 47 },
  },
  low: {
    solid: { l: -4, t: 64, w: 20, h: 50 },
    quiet: { l: 84, t: -10, w: 22, h: 30 },
    signal: { l: 17, t: 80, w: 14, h: 30 },
    loop: { l: 66, t: 40, w: 40 },
    dots: { l: 86, t: 24 },
  },
  // The brand banner: the name sits bottom-left on plain ground, so the
  // loop keeps to the middle and the blocks to the top right.
  banner: {
    solid: { l: 74, t: -14, w: 8, h: 56 },
    quiet: { l: 84, t: -14, w: 18, h: 34 },
    signal: { l: 84, t: 26, w: 18, h: 16 },
    loop: { l: 46, t: 18, w: 24 },
    dots: { l: 84.5, t: 48 },
  },
  band: {
    solid: { l: 82, t: -20, w: 7, h: 62 },
    quiet: { l: 90.5, t: -20, w: 12, h: 40 },
    signal: { l: 90.5, t: 24, w: 12, h: 18 },
    loop: { l: -6, t: 30, w: 26 },
    dots: { l: 91, t: 48 },
  },
} satisfies Record<string, Preset>;

export type PatternName = keyof typeof PRESETS;

const pct = (b: Box): CSSProperties => ({ left: `${b.l}%`, top: `${b.t}%`, width: `${b.w}%`, height: `${b.h}%` });

export function Pattern({ name = "right", dark = false, className }: { name?: PatternName; dark?: boolean; className?: string }) {
  const p: Preset = PRESETS[name];
  return (
    <div
      aria-hidden="true"
      className={cn(dark ? "pattern-dark" : "pattern", "pointer-events-none absolute inset-0 overflow-hidden select-none", className)}
      style={{ background: "var(--pat-ground)" }}
    >
      <LogoMark
        className="absolute aspect-square h-auto text-[var(--pat-loop)]"
        style={{ left: `${p.loop.l}%`, top: `${p.loop.t}%`, width: `${p.loop.w}%` }}
      />
      <span className="absolute rounded-[14px] bg-[var(--pat-solid)]" style={pct(p.solid)} />
      <span className="absolute rounded-[14px] bg-[var(--pat-quiet)]" style={pct(p.quiet)} />
      <span className="bg-signal absolute rounded-[14px]" style={pct(p.signal)} />
      <span className="absolute flex gap-2" style={{ left: `${p.dots.l}%`, top: `${p.dots.t}%` }}>
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-dot)]" />
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-dot)]" />
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-solid)]" />
      </span>
    </div>
  );
}

/*
  A rounded window onto the pattern, with a piece of the product standing in
  front of it: the Activepieces way of setting a product shot on a scene.
*/
export function PatternPanel({ name, className, children }: { name?: PatternName; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "ring-foreground/[0.06] relative isolate overflow-hidden rounded-[28px] ring-1",
        "shadow-[0_1px_2px_rgba(18,19,22,0.04),0_12px_40px_-24px_rgba(18,19,22,0.25)]",
        className
      )}
    >
      <Pattern name={name} />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
