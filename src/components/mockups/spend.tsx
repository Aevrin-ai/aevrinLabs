import { useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { useAutoplay } from "@/hooks/use-autoplay";
import { Count } from "@/components/ui/count";
import { Lightbulb } from "@/components/ui/solar-icons";
import { Cursor, Done } from "./kit";
import { useAnchorPoint } from "./use-anchor-point";

/*
  6 · Usage and spend. AI spend grows week by week, split by team. Then the
  models doing the work line up with their cost, a tip says one task works
  on a smaller model, and a cursor switches it.
*/

const TEAMS = [
  { name: "Support", className: "bg-foreground" },
  { name: "Sales", className: "bg-foreground/60" },
  { name: "Engineering", className: "bg-signal" },
  { name: "Finance", className: "bg-foreground/25" },
];
// Spend per team, in thousands of dollars, for six weeks.
const WEEKS = [
  [1.2, 0.8, 1.0, 0.3],
  [1.4, 0.9, 1.3, 0.3],
  [1.5, 1.1, 1.6, 0.4],
  [1.8, 1.2, 1.9, 0.4],
  [2.1, 1.4, 2.3, 0.5],
  [2.4, 1.5, 2.8, 0.5],
];
const MAX = Math.max(...WEEKS.map((w) => w.reduce((a, b) => a + b, 0)));

const MODELS = [
  { name: "Large model", tasks: "12,400 tasks", cost: "$9,860" },
  { name: "Small model", tasks: "30,100 tasks", cost: "$1,210" },
];

// 0 empty, 1 the bars grow, 2 the models, 3 the tip, 4 the cursor goes to
// Switch, 5 the press, 6 switched, 7 hold.
const DURATIONS = [0.6, 1.8, 1.4, 1.2, 0.9, 0.35, 0.9, 3.0];
const GROW = 1;
const MODELS_AT = 2;
const TIP = 3;
const TO_SWITCH = 4;
const PRESS = 5;
const SWITCHED = 6;

export default function Spend({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { phase } = useAutoplay(ref, DURATIONS);
  const point = useAnchorPoint(ref, switchRef, phase >= TIP);
  const grown = phase >= GROW;
  const switched = phase >= SWITCHED;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="AI spend grows week by week for four teams, the models doing the work are listed with their cost, and one task is switched to a smaller model to save $2,140 a month."
      className={cn("border-foreground/10 bg-window text-foreground relative flex h-full flex-col overflow-hidden rounded-xl border p-4", className)}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[16px] font-semibold">AI spend</span>
        <span className="text-muted-foreground text-[13px]">this month</span>
        <span className="ml-auto text-[22px] leading-none font-semibold tabular-nums">
          <Count value={grown ? 24180 : 0} duration={1.4} prefix="$" />
        </span>
      </div>

      {/* The bars, then the models, in the same place. */}
      <div className="relative mt-3 h-[124px] shrink-0 sm:h-[132px]">
        <AnimatePresence initial={false} mode="wait">
          {phase < MODELS_AT ? (
            <m.div
              key="bars"
              className="absolute inset-0 flex flex-col"
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
            >
              <div className="flex flex-1 items-end gap-2">
                {WEEKS.map((week, w) => (
                  <m.div
                    key={w}
                    className="flex flex-1 flex-col-reverse overflow-hidden rounded-md"
                    initial={false}
                    animate={{ height: grown ? `${(week.reduce((a, b) => a + b, 0) / MAX) * 100}%` : "4%" }}
                    transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : w * 0.08, ease: EASE }}
                  >
                    {week.map((value, t) => (
                      <span key={t} className={TEAMS[t].className} style={{ flexGrow: value }} />
                    ))}
                  </m.div>
                ))}
              </div>
              <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                {TEAMS.map((team) => (
                  <span key={team.name} className="flex items-center gap-1.5">
                    <span className={cn("size-2 rounded-sm", team.className)} />
                    {team.name}
                  </span>
                ))}
              </div>
            </m.div>
          ) : (
            <m.ul
              key="models"
              className="border-border absolute inset-0 divide-y overflow-hidden rounded-lg border"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            >
              <li className="text-muted-foreground flex px-3 py-2 text-[12px]">
                <span className="flex-1">Model</span>
                <span className="w-24 text-right max-sm:hidden">Used for</span>
                <span className="w-16 text-right">Cost</span>
              </li>
              {MODELS.map((model) => (
                <li key={model.name} className="flex items-center px-3 py-2.5 text-[15px]">
                  <span className="flex-1 truncate">{model.name}</span>
                  <span className="text-muted-foreground w-24 text-right text-[13px] max-sm:hidden">{model.tasks}</span>
                  <span className="w-16 text-right tabular-nums">{model.cost}</span>
                </li>
              ))}
            </m.ul>
          )}
        </AnimatePresence>
      </div>

      {/* The tip. */}
      <m.div
        className={cn(
          "mt-3 flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-500 sm:py-2.5",
          switched ? "border-emerald-300/70 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/10" : "border-signal/40 bg-signal/10"
        )}
        initial={false}
        animate={{ opacity: phase >= TIP ? 1 : 0, y: phase >= TIP ? 0 : 8 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
      >
        {switched ? <Done /> : <Lightbulb className="text-signal-text size-5 shrink-0" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-snug font-medium sm:text-[14px]">
            {switched ? "Ticket sorting moved to a smaller model" : "Ticket sorting works on a smaller model"}
          </span>
          <span className="text-muted-foreground block text-[13px]">Saves $2,140 a month</span>
        </span>
        <span
          ref={switchRef}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-[14px] font-medium transition-[background-color,transform] duration-300",
            switched ? "text-emerald-800 dark:text-emerald-200" : "bg-foreground text-background",
            phase === PRESS && "scale-95"
          )}
        >
          {switched ? "Switched" : "Switch"}
        </span>
      </m.div>

      {point && (
        <Cursor
          x={phase >= TO_SWITCH ? point.x : 60}
          y={phase >= TO_SWITCH ? point.y : 55}
          pressed={phase === PRESS}
          visible={phase >= TO_SWITCH - 1 && phase <= SWITCHED}
        />
      )}
    </div>
  );
}
