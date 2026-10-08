import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { useAutoplay } from "@/hooks/use-autoplay";
import { LogoMark } from "@/components/ui/logo";
import { ChatRoundDots, CodeSquare, Cpu, UserRounded, type IconComponent } from "@/components/ui/solar-icons";
import { AppCard, Appear, Done } from "./kit";

/*
  Where Aevrinlabs sits: in the chat app and in the code editor, the two
  places agents and people do the work. In each, an agent takes a step and
  Aevrinlabs checks it right there, in the same window.
*/

// 0 the work, 1 the agent's step, 2 checked, 3 hold.
const DURATIONS = [0.9, 1.2, 1.0, 3.2];
const STEP = 1;
const CHECKED = 2;

function Place({ icon: Icon, title, children, checked }: { icon: IconComponent; title: string; children: ReactNode; checked: boolean }) {
  return (
    <AppCard className="flex flex-col">
      <div className="border-foreground/[0.08] flex items-center gap-2.5 border-b px-5 py-4">
        <Icon className="text-foreground/70 size-5" />
        <span className="text-[16px] font-semibold">{title}</span>
      </div>
      <div className="flex-1 space-y-3 px-5 py-5">{children}</div>
      <div className="px-4 pb-4">
        <Appear
          show={checked}
          className="flex items-center gap-2.5 rounded-xl border border-emerald-300/60 bg-emerald-50 px-3.5 py-2.5 dark:border-emerald-400/30 dark:bg-emerald-500/10"
        >
          <LogoMark className="text-foreground size-5" />
          <span className="flex-1 text-[14px] font-medium">{BRAND} checked this step</span>
          <Done />
        </Appear>
      </div>
    </AppCard>
  );
}

function Line({ who, icon: Icon, children, mine }: { who: string; icon: IconComponent; children: ReactNode; mine?: boolean }) {
  return (
    <div className={cn("flex items-start gap-2.5", mine && "flex-row-reverse")}>
      <span className="bg-foreground/[0.07] grid size-8 shrink-0 place-items-center rounded-full">
        <Icon className="text-foreground/70 size-4" />
      </span>
      <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px]", mine ? "bg-foreground/[0.07] rounded-tr-md" : "border-border rounded-tl-md border")}>
        <span className="text-muted-foreground block text-[12px]">{who}</span>
        {children}
      </div>
    </div>
  );
}

export default function Everywhere() {
  const ref = useRef<HTMLDivElement>(null);
  const { phase } = useAutoplay(ref, DURATIONS);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`A chat app and a code editor side by side. In each, an agent takes a step and ${BRAND} checks it in the same window.`}
      className="mx-auto grid max-w-[900px] gap-5 md:grid-cols-2"
    >
      <Place icon={ChatRoundDots} title="Chat app" checked={phase >= CHECKED}>
        <Line who="Maya" icon={UserRounded} mine>
          Sum up last week&apos;s tickets, please.
        </Line>
        <Appear show={phase >= STEP}>
          <Line who="Support helper" icon={Cpu}>
            Done. 212 tickets, most about signing in.
          </Line>
        </Appear>
      </Place>

      <Place icon={CodeSquare} title="Code editor" checked={phase >= CHECKED}>
        <div className="border-border overflow-hidden rounded-xl border font-mono text-[13px] leading-6 whitespace-pre">
          <p className="text-muted-foreground px-3 pt-2">billing.ts</p>
          <p className="px-3">
            <span className="text-signal-text">export</span> function total(items) {"{"}
          </p>
          <Appear show={phase >= STEP} className="bg-emerald-50 px-3 dark:bg-emerald-500/10">
            {"  "}return items.reduce(add, 0);
          </Appear>
          <p className="px-3 pb-2">{"}"}</p>
        </div>
        <Appear show={phase >= STEP} className="text-muted-foreground flex items-center gap-2 text-[14px]">
          <Cpu className="size-4" />
          Code reviewer suggested a change
        </Appear>
      </Place>
    </div>
  );
}
