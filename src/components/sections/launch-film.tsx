import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { LAUNCH_FILM, onPlayLaunchFilm, VIDEO_TYPE } from "@/lib/launch-film";
import { SectionIntro } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { PatternPanel } from "@/components/ui/scene";
import { Play } from "@/components/ui/solar-icons";

/*
  The launch film, set the way Activepieces sets a product shot: a window
  standing on the brand pattern. Until someone presses play it is only the
  poster, so the page loads none of the film; pressing play swaps in the
  video, with sound and its own controls. The hero's "Watch the launch" pill
  scrolls here and presses play for you.
*/

function Poster() {
  return (
    <img
      src={LAUNCH_FILM.poster}
      srcSet={`${LAUNCH_FILM.posterSmall} 960w, ${LAUNCH_FILM.poster} 1920w`}
      sizes="(min-width: 1280px) 1024px, 100vw"
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 size-full object-cover"
    />
  );
}

export default function LaunchFilm() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // The hero pill: bring the film into view, then start it.
  useEffect(
    () =>
      onPlayLaunchFilm(() => {
        section.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setPlaying(true);
        video.current?.play().catch(() => {});
      }),
    []
  );

  // The video mounts on the press that asked for it, so it may start with
  // sound; focus moves to it so its controls are one key away.
  useEffect(() => {
    if (!playing || !video.current) return;
    video.current.focus({ preventScroll: true });
    video.current.play().catch(() => {});
  }, [playing]);

  return (
    <section ref={section} id="launch" aria-labelledby="launch-heading" className="max-w-container mx-auto scroll-mt-24 py-16 md:py-24">
      <SectionIntro
        id="launch-heading"
        eyebrow="Launch film"
        title={`Meet ${BRAND} in a minute.`}
        lead={`A short film about AI agents at work, and how ${BRAND} keeps them on your terms.`}
      />

      <Reveal delay={0.05} className="mt-10 md:mt-12">
        <PatternPanel name="left" className="px-3 py-6 sm:px-10 sm:py-12 lg:px-20 lg:py-16">
          <div className="ring-foreground/10 shadow-float relative mx-auto aspect-video w-full max-w-[1024px] overflow-hidden rounded-[20px] bg-black ring-1 md:rounded-[24px]">
            {playing ? (
              <video
                ref={video}
                controls
                tabIndex={0}
                playsInline
                preload="auto"
                poster={LAUNCH_FILM.poster}
                aria-label={`${BRAND} launch film, ${LAUNCH_FILM.lengthLabel}`}
                className="absolute inset-0 size-full bg-black object-contain"
                onEnded={() => setPlaying(false)}
              >
                <source src={LAUNCH_FILM.src} type={VIDEO_TYPE} />
              </video>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play the ${BRAND} launch film, ${LAUNCH_FILM.lengthLabel}`}
                className="group absolute inset-0 size-full cursor-pointer"
              >
                <Poster />
                <span aria-hidden="true" className="bg-ink/0 group-hover:bg-ink/[0.06] absolute inset-0 transition-colors duration-300" />
                {/* The play button: a white pill with a dark circle, the label
                    and the length, in the corner so the poster's logo stays
                    clear. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-ink absolute bottom-3 left-3 flex origin-bottom-left items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_8px_24px_-8px_rgba(18,19,22,0.45)] transition-transform duration-300 group-hover:scale-[1.03] sm:bottom-6 sm:left-6 sm:gap-3 sm:py-2 sm:pr-5 sm:pl-2",
                    "md:bottom-8 md:left-8 md:py-2.5 md:pr-6 md:pl-2.5"
                  )}
                >
                  <span className="bg-ink grid size-8 place-items-center rounded-full text-white sm:size-9 md:size-11">
                    <Play className="ml-0.5 size-4 md:size-5" />
                  </span>
                  <span className="text-[15px] font-semibold max-sm:hidden md:text-[17px]">Watch the launch</span>
                  <span className="text-ink/55 text-[14px] tabular-nums md:text-[15px]">{LAUNCH_FILM.length}</span>
                </span>
              </button>
            )}
          </div>
        </PatternPanel>
      </Reveal>
    </section>
  );
}
