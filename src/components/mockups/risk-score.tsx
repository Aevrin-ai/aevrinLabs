import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { useAutoplay } from "@/hooks/use-autoplay";
import { Count } from "@/components/ui/count";
import { DangerTriangle, PauseCircle, PlugCircle } from "@/components/ui/solar-icons";
import { AppCard, Appear, Cursor, Tag, Tile } from "./kit";
import { useAnchorPoint } from "./use-anchor-point";

/*
  2 · Risk scores. A new MCP server is about to be used. Before it does any
  work, its risk ring counts up to a high score and the reasons land one by
  one. A cursor clicks "Hold for review", and it waits for a person.
*/

const SCORE = 86;
const REASONS = ["Reads email", "Sends data outside the company", "Unknown publisher"];

// 0 the request, 1 the ring counts, 2-4 each reason, 5 the cursor travels,
// 6 the press, 7 held, 8 hold.
const DURATIONS = [0.8, 1.5, 0.5, 0.5, 0.7, 0.9, 0.35, 1.0, 3.0];
const SCORED = 1;
const MOVE = 5;
const PRESS = 6;
const HELD = 7;

const R = 44;
const CIRC = 2 * Math.PI * R;

export default function RiskScore({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { phase } = useAutoplay(ref, DURATIONS);
  const point = useAnchorPoint(ref, button);
  const scored = phase >= SCORED;
  const held = phase >= HELD;

  return (
    <AppCard
      className={cn("mx-auto w-full max-w-[620px]", className)}
      label="A new MCP server gets a high risk score of 86 with three reasons, and someone holds it for review before it can work."
    >
      <div ref={ref} className="relative">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <Tile icon={PlugCircle} />
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-semibold">New MCP server: files-sync</span>
            <span className="text-muted-foreground block truncate text-[14px]">Wants to plug into Support helper</span>
          </span>
          <Tag tone={held ? "warn" : "plain"} className="max-sm:hidden">
            {held ? "On hold" : "Not used yet"}
          </Tag>
        </div>

        <div className="border-foreground/[0.08] flex flex-col items-center gap-6 border-t px-5 py-6 sm:flex-row sm:items-start sm:gap-8 sm:px-6">
          {/* The ring fills as the score counts up. */}
          <div className="relative size-[132px] shrink-0">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r={R} fill="none" strokeWidth="8" className="stroke-foreground/[0.08]" />
              <m.circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-red-500"
                strokeDasharray={CIRC}
                initial={false}
                animate={{ strokeDashoffset: scored ? CIRC * (1 - SCORE / 100) : CIRC }}
                transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[34px] leading-none font-semibold tabular-nums">
                <Count value={scored ? SCORE : 0} duration={1.2} />
              </span>
              <span className="mt-1 text-[13px] font-medium text-red-600 dark:text-red-400">{scored ? "High risk" : "Scoring"}</span>
            </span>
          </div>

          <div className="w-full min-w-0 flex-1">
            <p className="text-muted-foreground text-[14px] font-medium">Why</p>
            <ul className="mt-2 space-y-2">
              {REASONS.map((reason, i) => (
                <Appear
                  key={reason}
                  as="li"
                  show={phase >= 2 + i}
                  className="flex items-center gap-2.5 rounded-lg bg-red-50 px-3 py-2.5 text-[15px] dark:bg-red-500/10"
                >
                  <DangerTriangle className="size-4 shrink-0 text-red-500" />
                  {reason}
                </Appear>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-foreground/[0.08] flex items-center justify-end gap-2 border-t px-5 py-4 sm:px-6">
          <span className="border-border text-foreground/70 rounded-full border px-4 py-2 text-[15px]">Allow</span>
          <span
            ref={button}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium transition-[background-color,transform] duration-300",
              held ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200" : "bg-foreground text-background",
              phase === PRESS && "scale-95"
            )}
          >
            {held && <PauseCircle className="size-4" />}
            {held ? "Held for review" : "Hold for review"}
          </span>
        </div>

        {point && (
          <Cursor
            x={phase >= MOVE ? point.x : 70}
            y={phase >= MOVE ? point.y : 60}
            pressed={phase === PRESS}
            visible={phase >= MOVE - 1 && phase < HELD + 1}
          />
        )}
      </div>
    </AppCard>
  );
}
