import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { useAutoplay } from "@/hooks/use-autoplay";
import { Cpu, LockKeyhole, UserRounded } from "@/components/ui/solar-icons";
import { AppCard, Appear, Cursor, Tag, Tile } from "./kit";
import { useAnchorPoint } from "./use-anchor-point";

/*
  3 · Identities and access. An agent's card shows it is signed in with a
  person's own account. Its access dial slides from "Full access" to "Ask
  first", and a private internal app it could not reach opens as read only.
*/

const LEVELS = ["Full access", "Ask first", "No access"];

// 0 the card, 1 the borrowed login is marked, 2 the cursor goes to the dial,
// 3 the press and slide, 4 the cursor goes to the private app, 5 the press,
// 6 read only, 7 hold.
const DURATIONS = [0.9, 1.1, 0.9, 1.0, 0.9, 0.35, 0.9, 3.0];
const BORROWED = 1;
const TO_DIAL = 2;
const SLIDE = 3;
const TO_APP = 4;
const PRESS_APP = 5;
const OPENED = 6;

export default function Access({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const dialTarget = useRef<HTMLSpanElement>(null);
  const appTarget = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { phase } = useAutoplay(ref, DURATIONS);
  const dialPoint = useAnchorPoint(ref, dialTarget);
  const appPoint = useAnchorPoint(ref, appTarget);
  const level = phase >= SLIDE ? 1 : 0;
  const opened = phase >= OPENED;

  const cursor = phase >= TO_APP ? appPoint : phase >= TO_DIAL ? dialPoint : null;

  return (
    <AppCard
      className={cn("mx-auto w-full max-w-[620px]", className)}
      label="An agent is found using a person's login. Its access is turned down from full access to ask first, and a private app opens to it as read only."
    >
      <div ref={ref} className="relative">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <Tile icon={Cpu} />
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-semibold">Report bot</span>
            <span className="text-muted-foreground block truncate text-[14px]">Agent · Sales team</span>
          </span>
        </div>

        {/* The login it is using. */}
        <div className="border-foreground/[0.08] border-t px-5 py-4 sm:px-6">
          <p className="text-muted-foreground text-[14px] font-medium">Signed in as</p>
          <div
            className={cn(
              "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-500",
              phase >= BORROWED ? "bg-amber-50 dark:bg-amber-500/10" : "bg-foreground/[0.04]"
            )}
          >
            <span className="bg-foreground/10 grid size-9 shrink-0 place-items-center rounded-full">
              <UserRounded className="text-foreground/70 size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-medium">Maya Ross</span>
              <span className="text-muted-foreground block truncate text-[14px]">Used to read sales reports</span>
            </span>
            <Appear show={phase >= BORROWED} as="span">
              <Tag tone="warn">A person's login</Tag>
            </Appear>
          </div>
        </div>

        {/* The dial: three steps, one thumb. */}
        <div className="border-foreground/[0.08] border-t px-5 py-4 sm:px-6">
          <p className="text-muted-foreground text-[14px] font-medium">Access</p>
          <div className="bg-foreground/[0.06] relative mt-2 grid grid-cols-3 rounded-full p-1">
            <m.span
              aria-hidden="true"
              className="bg-window ring-foreground/10 absolute top-1 bottom-1 left-1 rounded-full shadow-sm ring-1"
              style={{ width: "calc((100% - 8px) / 3)" }}
              initial={false}
              animate={{ x: `${level * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
            />
            {LEVELS.map((name, i) => (
              <span
                key={name}
                ref={i === 1 ? dialTarget : undefined}
                className={cn(
                  "relative py-2 text-center text-[14px] transition-colors duration-300 sm:text-[15px]",
                  i === level ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* A private app it could not reach before. */}
        <div className="border-foreground/[0.08] flex items-center gap-3 border-t px-5 py-4 sm:px-6">
          <Tile icon={LockKeyhole} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] font-medium">Pricing tool</span>
            <span className="text-muted-foreground block truncate text-[14px]">Private, internal app</span>
          </span>
          <span ref={appTarget} className={cn("transition-transform duration-200", phase === PRESS_APP && "scale-95")}>
            <Tag tone={opened ? "good" : "bad"} className="px-2.5 py-1 text-[13px]">
              {opened ? "Read only" : "Off limits"}
            </Tag>
          </span>
        </div>

        {cursor && <Cursor x={cursor.x} y={cursor.y} pressed={phase === SLIDE || phase === PRESS_APP} visible={phase < OPENED + 1} />}
      </div>
    </AppCard>
  );
}
