import { useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { useAutoplay } from "@/hooks/use-autoplay";
import { useTyping } from "@/hooks/use-typing";
import { Export, Magnifer } from "@/components/ui/solar-icons";
import { Cursor, Done, Tag, Typed, type TagTone } from "./kit";
import { useAnchorPoint } from "./use-anchor-point";

/*
  5 · Audit trail. One record of AI actions from many agents. A filter is
  typed and the list narrows to one agent, one entry opens to show who, what,
  when and how it ended, and the record is exported.
*/

type Entry = { id: string; time: string; agent: string; action: string; result: string; tone: TagTone };

const ENTRIES: Entry[] = [
  { id: "a", time: "09:12", agent: "Support helper", action: "Replied to ticket #4821", result: "Done", tone: "good" },
  { id: "b", time: "09:15", agent: "Sales agent", action: "Send customer list outside", result: "Stopped", tone: "bad" },
  { id: "c", time: "09:18", agent: "Code reviewer", action: "Left a note on change 312", result: "Done", tone: "good" },
  { id: "d", time: "09:21", agent: "Sales agent", action: "Updated a deal", result: "Done", tone: "good" },
];
const FILTER = "Sales agent";

// 0 the whole record, 1 the filter types, 2 the list narrows, 3 one entry
// opens, 4 the cursor goes to Export, 5 the press, 6 exported, 7 hold.
const DURATIONS = [1.4, 1.3, 0.9, 1.3, 0.9, 0.35, 0.9, 3.0];
const TYPING = 1;
const NARROW = 2;
const OPEN = 3;
const TO_EXPORT = 4;
const PRESS = 5;
const EXPORTED = 6;

export default function AuditTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { phase } = useAutoplay(ref, DURATIONS);
  const typed = useTyping(phase === TYPING, 1.1);
  const point = useAnchorPoint(ref, exportRef);
  const narrowed = phase >= NARROW;
  const shown = narrowed ? ENTRIES.filter((e) => e.agent === FILTER) : ENTRIES;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="An audit trail of AI actions is filtered to one agent, a stopped action opens to show who, what, when and the result, and the record is exported."
      className="border-foreground/10 bg-window text-foreground relative h-full overflow-hidden rounded-xl border"
    >
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <span className="border-border flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 text-[15px]">
          <Magnifer className="text-muted-foreground size-4 shrink-0" />
          {phase >= TYPING ? (
            <span className="bg-signal/15 text-signal-text truncate rounded px-1.5 py-0.5 font-mono text-[13px]">
              <Typed text={FILTER} shown={phase > TYPING ? 1 : typed} />
            </span>
          ) : (
            <span className="text-muted-foreground truncate">Search the record</span>
          )}
        </span>
        <span
          ref={exportRef}
          className={cn(
            "flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[15px] font-medium transition-[background-color,transform] duration-300",
            phase >= EXPORTED ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-foreground text-background",
            phase === PRESS && "scale-95"
          )}
        >
          {phase >= EXPORTED ? <Done className="size-4" /> : <Export className="size-4" />}
          {phase >= EXPORTED ? "Exported" : "Export"}
        </span>
      </div>

      <ul className="border-foreground/[0.08] border-t">
        <AnimatePresence initial={false}>
          {shown.map((entry, i) => {
            const open = phase >= OPEN && i === 0 && narrowed;
            return (
              <m.li
                key={entry.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                className={cn("border-foreground/[0.06] border-b px-3 py-2 last:border-b-0 sm:px-4 sm:py-2.5", open && "bg-foreground/[0.03]")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-11 shrink-0 font-mono text-[13px]">{entry.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="text-muted-foreground block truncate text-[13px]">{entry.agent}</span>
                    <span className="block text-[15px] leading-snug sm:truncate">{entry.action}</span>
                  </span>
                  <Tag tone={entry.tone}>{entry.result}</Tag>
                </div>
                {open && (
                  <m.dl
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    className="grid grid-cols-2 gap-x-4 gap-y-1.5 overflow-hidden pt-2 pl-14 text-[14px] sm:gap-y-2 sm:pt-3"
                  >
                    {[
                      ["Who", "Sales agent"],
                      ["When", "Today, 09:15"],
                      ["What", "Send customer list outside"],
                      ["Result", "Stopped by a rule"],
                    ].map(([term, value]) => (
                      // On a phone the row above already says what happened.
                      <div key={term} className={cn("min-w-0", term === "What" && "max-sm:hidden")}>
                        <dt className="text-muted-foreground text-[12px]">{term}</dt>
                        <dd className="leading-snug sm:truncate">{value}</dd>
                      </div>
                    ))}
                  </m.dl>
                )}
              </m.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {point && (
        <Cursor
          x={phase >= TO_EXPORT ? point.x : 55}
          y={phase >= TO_EXPORT ? point.y : 60}
          pressed={phase === PRESS}
          visible={phase >= TO_EXPORT - 1 && phase <= EXPORTED}
        />
      )}
    </div>
  );
}
