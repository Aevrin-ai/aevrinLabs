import { useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { useAutoplay } from "@/hooks/use-autoplay";
import { ForbiddenCircle, ShieldCheck } from "@/components/ui/solar-icons";
import { AppCard, Done, Spinner, Tag, Tile } from "./kit";

/*
  4 · Live guardrails. A live feed of what agents are doing right now. One
  step, sending the customer list to an outside address, turns red and is
  stopped with a one-line reason, and the rest of the feed carries on.
*/

type Step = { agent: string; action: string; stop?: string };

const STEPS: Step[] = [
  { agent: "Support helper", action: "Replied to ticket #4821" },
  { agent: "Invoice reader", action: "Read an invoice from Maple Co" },
  { agent: "Code reviewer", action: "Left a note on change 312" },
  { agent: "Sales agent", action: "Send customer list to an outside address", stop: "Customer data stays inside the company" },
  { agent: "Report bot", action: "Built the weekly sales chart" },
  { agent: "Support helper", action: "Closed ticket #4822" },
];
const STOP_AT = 3;
const VISIBLE = 4;

// How many steps are in the feed at each phase, and whether the risky one has
// been stopped yet. 0-1 the feed fills, 2 the risky step arrives and is
// checked, 3 it is stopped, 4-5 the feed carries on, 6 hold.
const SHOWN = [2, 3, 4, 4, 5, 6, 6];
const DURATIONS = [1.0, 0.9, 0.9, 1.8, 0.9, 0.9, 3.0];
const STOPPED = 3;

export default function Guardrails({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { phase } = useAutoplay(ref, DURATIONS);
  const count = SHOWN[phase];
  const stopped = phase >= STOPPED;
  // Newest on top, a few at a time, like a live log.
  const feed = STEPS.slice(0, count)
    .map((step, i) => ({ step, i }))
    .reverse()
    .slice(0, VISIBLE);

  return (
    <AppCard
      className={cn("mx-auto w-full max-w-[620px]", className)}
      label="A live feed of agent actions. Sending a customer list to an outside address is stopped with a reason, and the other actions carry on."
    >
      <div ref={ref}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <Tile icon={ShieldCheck} />
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-semibold">Live activity</span>
            <span className="text-muted-foreground block truncate text-[14px]">Every agent, step by step</span>
          </span>
          <span className="flex items-center gap-2 text-[14px] font-medium text-emerald-700 dark:text-emerald-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>

        <ul className="border-foreground/[0.08] relative h-[360px] overflow-hidden border-t [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:h-[340px]">
          <AnimatePresence initial={false}>
            {feed.map(({ step, i }) => {
              const risky = i === STOP_AT;
              const red = risky && stopped;
              return (
                <m.li
                  key={i}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                  className={cn(
                    "border-foreground/[0.06] border-b px-5 py-3.5 transition-colors duration-500 sm:px-6",
                    red && "bg-red-50 dark:bg-red-500/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="text-muted-foreground block text-[14px]">{step.agent}</span>
                      <span className={cn("block text-[16px] leading-snug", red && "font-medium text-red-700 dark:text-red-300")}>
                        {step.action}
                      </span>
                    </span>
                    {risky ? (
                      red ? (
                        <Tag tone="bad" className="gap-1.5 px-2.5 py-1 text-[13px]">
                          <ForbiddenCircle className="size-3.5" />
                          Stopped
                        </Tag>
                      ) : (
                        <Spinner />
                      )
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1.5 text-[14px]">
                        <span className="max-sm:hidden">Allowed</span>
                        <Done />
                      </span>
                    )}
                  </div>
                  {red && step.stop && (
                    <m.p
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      className="overflow-hidden text-[14px] text-red-700/90 dark:text-red-300/90"
                    >
                      <span className="block pt-1.5">Why: {step.stop}</span>
                    </m.p>
                  )}
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </AppCard>
  );
}
