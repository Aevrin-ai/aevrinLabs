import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/ease";
import { LAUNCH_FILM, playLaunchFilm } from "@/lib/launch-film";
import { HEADING } from "@/components/ui/blocks";
import { LogoMark } from "@/components/ui/logo";
import { Pill } from "@/components/ui/pill";
import { Play } from "@/components/ui/solar-icons";
import Console from "@/components/mockups/console";
import { useWaitlist } from "@/components/waitlist/context";

/*
  The hero, laid out the way Activepieces lays out theirs: a centred headline,
  a line under it, a pair of buttons, then the app itself rising out of the
  brand pattern and running off the bottom of the section. The pattern is
  clipped to the hero and the window fades into the page, so nothing ends in
  a hard line under the next section.
*/

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

function HeroArt() {
  return (
    <div aria-hidden="true" className="pattern pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Blocks bleeding off the sides below the bar, as in the brand
          banners, so none of them sits behind the navigation. */}
      <span className="absolute top-[120px] left-[-24px] hidden h-[220px] w-[112px] rounded-[14px] bg-[var(--pat-quiet)] lg:block" />
      <span className="absolute top-[356px] left-[24px] hidden gap-2 lg:flex">
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-dot)]" />
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-dot)]" />
        <span className="size-3.5 rounded-[4px] bg-[var(--pat-solid)]" />
      </span>
      <span className="absolute top-[120px] right-[150px] hidden h-[260px] w-[72px] rounded-[14px] bg-[var(--pat-solid)] xl:block" />
      <span className="absolute top-[120px] right-[-24px] hidden h-[150px] w-[150px] rounded-[14px] bg-[var(--pat-quiet)] lg:block" />
      <span className="bg-signal absolute top-[286px] right-[-24px] hidden h-[64px] w-[150px] rounded-[14px] lg:block" />
      {/* The ground the app stands on, with the loop drawn large and quiet. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[58%] lg:h-[560px]"
        style={{ background: "linear-gradient(to bottom, transparent, var(--pat-ground) 160px)" }}
      >
        <LogoMark className="absolute top-[-12%] left-1/2 hidden w-[min(1100px,140vw)] -translate-x-1/2 text-[var(--pat-loop)] sm:block" />
      </div>
    </div>
  );
}

export default function Hero() {
  const { openWaitlist } = useWaitlist();
  const reduce = useReducedMotion();
  const motionProps = (delay: number) => (reduce ? {} : rise(delay));

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <HeroArt />

      <div className="max-w-container mx-auto pt-32 text-center sm:pt-40">
        {/* The headline is the largest thing on arrival, so it is painted at
            once rather than faded in; everything after it rises into place. */}
        <h1 className={cn(HEADING, "mx-auto max-w-[15ch] text-[40px] leading-[1.02] sm:text-6xl lg:max-w-[18ch] lg:text-[76px]")}>
          Your AI agents, working on your rules.
        </h1>

        <m.p
          {...motionProps(0.12)}
          className="text-muted-foreground mx-auto mt-6 max-w-[48ch] text-lg leading-snug text-pretty sm:text-2xl sm:leading-[1.35]"
        >
          Aevrinlabs shows you every AI agent at work, what it can reach and what it costs, and stops it before it goes too far.
        </m.p>

        <m.div {...motionProps(0.2)} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Pill size="lg" onClick={openWaitlist}>
            Join the waitlist
            <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Pill>
          {/* A white pill with a dark play circle, the label and the length.
              It scrolls to the launch film below and starts it. */}
          <button
            type="button"
            onClick={playLaunchFilm}
            className="group border-border bg-window text-foreground hover:bg-muted inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full border pr-6 pl-1.5 transition-colors md:h-[50px]"
          >
            <span className="bg-foreground text-background grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105">
              <Play aria-hidden="true" className="ml-0.5 size-4" />
            </span>
            <span className="text-base font-medium md:text-[17px]">Watch the launch</span>
            <span className="text-muted-foreground text-[15px] tabular-nums">{LAUNCH_FILM.length}</span>
          </button>
        </m.div>

        {/* The app, cut off by the bottom of the section like a screenshot
            that keeps going. */}
        <m.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.3, ease: EASE } })}
          className="relative mt-14 h-[460px] overflow-hidden sm:mt-16 sm:h-[540px] lg:h-[600px]"
        >
          <div className="bg-window/50 ring-window/70 rounded-[34px] p-2.5 ring-1 backdrop-blur-sm sm:p-3">
            <Console />
          </div>
        </m.div>
      </div>
      <div aria-hidden="true" className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent" />
    </section>
  );
}
