import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { CheckCircle, type IconComponent } from "@/components/ui/solar-icons";

/*
  The pieces every product mockup is built from: a floating app card, icon
  tiles, a status, tags, and a pointer that clicks. Big type, a lot of air,
  one idea per mockup, so each reads in a glance.
*/

// A floating app window, lifted off the pattern behind it. With a label it
// is one picture to assistive technology, described in a sentence.
export function AppCard({ className, children, label }: { className?: string; children: ReactNode; label?: string }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("bg-window text-foreground ring-foreground/10 shadow-float relative overflow-hidden rounded-[20px] ring-1", className)}
    >
      {children}
    </div>
  );
}

// An icon in a soft square, the way an app shows what a row is.
export function Tile({ icon: Icon, className, iconClassName }: { icon: IconComponent; className?: string; iconClassName?: string }) {
  return (
    <span className={cn("bg-foreground/[0.06] grid size-10 shrink-0 place-items-center rounded-lg", className)}>
      <Icon className={cn("text-foreground/75 size-5", iconClassName)} />
    </span>
  );
}

export type Tone = "good" | "warn" | "bad" | "info" | "idle";

const STATUS: Record<Tone, string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
  info: "bg-sky-500",
  idle: "bg-foreground/25",
};

// A coloured dot and a word: the status of a row at a glance.
export function Status({ tone = "good", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-foreground/80 inline-flex shrink-0 items-center gap-2 text-[15px]", className)}>
      <span className={cn("size-2 rounded-full", STATUS[tone])} />
      {children}
    </span>
  );
}

export function Done({ className }: { className?: string }) {
  return <CheckCircle className={cn("size-5 shrink-0 text-emerald-600 dark:text-emerald-400", className)} />;
}

// A small rounded label: what kind of thing, or how serious.
const TAG = {
  plain: "bg-foreground/[0.07] text-foreground/70",
  bad: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  warn: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  good: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  signal: "bg-signal/15 text-signal-text",
};
export type TagTone = keyof typeof TAG;

export function Tag({ tone = "plain", className, children }: { tone?: TagTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 font-mono text-[12px] font-medium tracking-wide whitespace-nowrap",
        TAG[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// Fades and rises into place whenever `show` turns true.
export function Appear({
  show,
  delay = 0,
  className,
  children,
  as = "div",
  y = 8,
}: {
  show: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "li" | "span";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={reduce ? { duration: 0 } : { duration: 0.45, delay: show ? delay : 0, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

// Text that types itself out, one letter at a time, with a caret.
export function Typed({ text, shown, caret = true }: { text: string; shown: number; caret?: boolean }) {
  const count = Math.round(Math.max(0, Math.min(1, shown)) * text.length);
  return (
    <>
      {text.slice(0, count)}
      {caret && shown < 1 && <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.15em] animate-pulse bg-current" />}
    </>
  );
}

/*
  The pointer that clicks through a mockup. Positions are percentages of the
  mockup, so it lands in the same place at any size. Decorative: it is not
  drawn at all for reduced motion.
*/
export function Cursor({ x, y, pressed = false, visible = true }: { x: number; y: number; pressed?: boolean; visible?: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-30"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, opacity: visible ? 1 : 0, scale: pressed ? 0.85 : 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
        <path d="M5 3.5 19 12l-6.6 1.7L9 20.5z" fill="#121316" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </m.div>
  );
}

// A small spinner for a step still running.
export function Spinner() {
  return (
    <span className="border-foreground/20 border-t-foreground/70 inline-block size-4 animate-spin rounded-full border-2 motion-reduce:animate-none" />
  );
}

// The three buttons at the top of an app window.
export function WindowDots({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex gap-1.5", className)}>
      <span className="size-[1em] rounded-full bg-[#ff5f57]" />
      <span className="size-[1em] rounded-full bg-[#febc2e]" />
      <span className="size-[1em] rounded-full bg-[#28c840]" />
    </span>
  );
}
