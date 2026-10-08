import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import { easeIn, easeOut, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { SCROLL_SPRING } from "@/lib/ease";
import { HEADING } from "@/components/ui/blocks";
import { Logo } from "@/components/ui/logo";
import {
  Atom,
  Cpu,
  Database,
  History,
  LockKeyhole,
  MagicStick,
  PlugCircle,
  UserId,
  WalletMoney,
  type IconComponent,
} from "@/components/ui/solar-icons";
import { layoutWires, NODES, type Box, type RingNode as Node, type RoutedWire } from "./ring";
import { ChatWindow, CostWindow, DatabaseWindow, LoginWindow, McpWindow, PrivateAppWindow, SkillWindow } from "./windows";

/*
  The scroll story, on Activepieces' sticky "dream stage".

  The page holds still while it plays: AI agents doing real work, then
  "nobody taught them the rules" as the windows fly in around the words, one
  for each way an agent goes off on its own, then everything drawn into one
  ring around Aevrinlabs. Scroll drives every frame, eased by a spring so it
  glides rather than ticks, and it plays backwards just as well. Anyone who
  prefers less motion gets the same three moments as plain sections.
*/

/* ── The windows ──────────────────────────────────────────── */

type Win = { Comp: ComponentType; at: [number, number]; tilt: number; from: [number, number, number]; start: number; front: boolean };

// Where each window rests (left and top of the screen, in percent), its tilt,
// where it flies in from (vw, vh, tilt), and when it sets off. The first three
// sit behind the words and the rest in front.
const WINDOWS: Win[] = [
  { Comp: McpWindow, at: [50, 30], tilt: 2, from: [0, -115, 4], start: 0.3, front: false },
  { Comp: DatabaseWindow, at: [21, 33], tilt: -4, from: [-115, -31, -8], start: 0.312, front: false },
  { Comp: SkillWindow, at: [79, 33], tilt: 3, from: [115, -42, 6], start: 0.33, front: false },
  { Comp: LoginWindow, at: [20, 72], tilt: 5, from: [-89, 63, 10], start: 0.345, front: true },
  { Comp: ChatWindow, at: [40, 70], tilt: -2, from: [-26, 100, -4], start: 0.37, front: true },
  { Comp: CostWindow, at: [64, 66], tilt: 6, from: [73, 13, 12], start: 0.35, front: true },
  { Comp: PrivateAppWindow, at: [81, 72], tilt: -5, from: [73, 58, -10], start: 0.385, front: true },
];
const FLY_IN = 0.14;
const LEAVE = 0.605;
const LEAVE_GAP = 0.009;
const LEAVE_FOR = 0.065;

function FlyingWindow({ win, index, progress, size }: { win: Win; index: number; progress: MotionValue<number>; size: number }) {
  const [ax, ay] = win.at;
  const [fx, fy, fr] = win.from;
  const a = win.start;
  const b = a + FLY_IN;
  const c = LEAVE + index * LEAVE_GAP;
  const d = c + LEAVE_FOR;
  const ease = [easeOut, (t: number) => t, easeIn];

  // In from off screen, rest, then drawn into the middle of the screen.
  const x = useTransform(progress, [a, b, c, d], [`${fx}vw`, "0vw", "0vw", `${50 - ax}vw`], { ease });
  const y = useTransform(progress, [a, b, c, d], [`${fy}vh`, "0vh", "0vh", `${50 - ay}vh`], { ease });
  const rotate = useTransform(progress, [a, b, c, d], [fr, win.tilt, win.tilt, 0], { ease });
  const scale = useTransform(progress, [c, d], [size, size * 0.05], { ease: easeIn });
  const opacity = useTransform(progress, [a, a + 0.004, c, d - 0.01], [0, 1, 1, 0]);

  const { Comp } = win;
  return (
    // A point with no size at the window's resting place, so it scales and
    // tilts about its own centre rather than about a corner.
    <m.div
      className="absolute size-0 will-change-transform"
      style={{ left: `${ax}%`, top: `${ay}%`, x, y, rotate, scale, opacity, zIndex: win.front ? 34 : 33 }}
    >
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <Comp />
      </div>
    </m.div>
  );
}

/* ── The ring ─────────────────────────────────────────────── */

type Place = { id: string; label: string; icon: IconComponent };

// The nine places Aevrinlabs watches over, in the order the ring reads.
const PLACES: Place[] = [
  { id: "private", label: "Private apps", icon: LockKeyhole },
  { id: "mcp", label: "MCP servers", icon: PlugCircle },
  { id: "audit", label: "Audit trail", icon: History },
  { id: "agents", label: "Agents", icon: Cpu },
  { id: "skills", label: "Skills", icon: MagicStick },
  { id: "logins", label: "Logins", icon: UserId },
  { id: "models", label: "Models", icon: Atom },
  { id: "data", label: "Data", icon: Database },
  { id: "spend", label: "Spend", icon: WalletMoney },
];
const place = (id: string) => PLACES.find((p) => p.id === id)!;

type Layout = { width: number; height: number; wires: RoutedWire[] };

function useRing(boxRef: RefObject<HTMLDivElement | null>, nodeRefs: RefObject<Record<string, HTMLDivElement | null>>) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const boxes: Record<string, Box> = {};
    for (const node of NODES) {
      const el = nodeRefs.current[node.id];
      if (!el) return;
      // Offsets, not bounding boxes: the places are scaled and tilted while
      // they enter, and the wires must meet where they come to rest.
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const cx = (node.at[0] / 100) * box.offsetWidth;
      const cy = (node.at[1] / 100) * box.offsetHeight;
      boxes[node.id] = { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
    }
    setLayout({
      width: box.offsetWidth,
      height: box.offsetHeight,
      wires: layoutWires(boxes, box.offsetWidth),
    });
  }, [boxRef, nodeRefs]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (boxRef.current) observer.observe(boxRef.current);
    // The font can change a place's width once it loads.
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [boxRef, measure]);

  return layout;
}

function WirePath({ wire, progress }: { wire: Layout["wires"][number]; progress: MotionValue<number> }) {
  const [a, b] = wire.draw;
  const length = useTransform(progress, [a, b], [0, 1]);
  const startDot = useTransform(progress, [a, a + 0.005], [0, 1]);
  const endDot = useTransform(progress, [b - 0.005, b], [0, 1]);
  return (
    <>
      <m.path
        d={wire.d}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={wire.accent ? "stroke-signal" : "stroke-foreground/20"}
        style={{ pathLength: length }}
      />
      <m.circle cx={wire.ends[0][0]} cy={wire.ends[0][1]} r="3" className="fill-foreground" style={{ opacity: startDot }} />
      <m.circle cx={wire.ends[1][0]} cy={wire.ends[1][1]} r="3" className="fill-foreground" style={{ opacity: endDot }} />
    </>
  );
}

function PlaceChip({ id, compact = false }: { id: string; compact?: boolean }) {
  const { label, icon: Icon } = place(id);
  return (
    <div
      className={cn(
        "bg-window border-border flex items-center gap-2.5 rounded-xl border whitespace-nowrap shadow-[0_1px_2px_rgba(18,19,22,0.05),0_6px_16px_-10px_rgba(18,19,22,0.25)]",
        compact ? "px-3 py-2.5" : "px-4 py-3"
      )}
    >
      <Icon aria-hidden="true" className={cn("text-foreground/75 shrink-0", compact ? "size-4" : "size-5")} />
      <span className={cn("text-foreground leading-none", compact ? "text-[15px]" : "text-[17px]")}>{label}</span>
    </div>
  );
}

function RingNode({ node, progress, nodeRef }: { node: Node; progress: MotionValue<number>; nodeRef: (el: HTMLDivElement | null) => void }) {
  const { show, enter } = node;
  const during = [show, show + 0.035];
  const opacity = useTransform(progress, during, [0, 1]);
  const scale = useTransform(progress, during, [enter[0] === "scale" ? enter[1] : 1, 1], { ease: easeOut });
  const y = useTransform(progress, during, [enter[0] === "blur" ? 20 : 0, 0], { ease: easeOut });
  const filter = useTransform(progress, during, [enter[0] === "blur" ? "blur(4px)" : "blur(0px)", "blur(0px)"]);
  return (
    <m.div className="absolute size-0" style={{ left: `${node.at[0]}%`, top: `${node.at[1]}%`, opacity, scale, y, filter, rotate: node.tilt }}>
      <div ref={nodeRef} className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <PlaceChip id={node.id} />
      </div>
    </m.div>
  );
}

function Ring({ progress }: { progress: MotionValue<number> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const layout = useRing(boxRef, nodeRefs);
  return (
    <div ref={boxRef} aria-hidden="true" className="absolute inset-x-0 top-[14%] bottom-[4.5%] hidden lg:block">
      {layout && (
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="absolute inset-0 size-full overflow-visible">
          {layout.wires.map((wire, i) => (
            <WirePath key={i} wire={wire} progress={progress} />
          ))}
        </svg>
      )}
      {NODES.map((node) => (
        <RingNode
          key={node.id}
          node={node}
          progress={progress}
          nodeRef={(el) => {
            nodeRefs.current[node.id] = el;
          }}
        />
      ))}
    </div>
  );
}

/* ── The words ────────────────────────────────────────────── */

const STATEMENT = cn(HEADING, "mx-auto max-w-[14ch] text-center text-5xl leading-[1.02] md:text-7xl xl:text-[84px]");

function Resolution() {
  return (
    <div className="mx-auto text-center">
      <Logo className="text-foreground mx-auto h-12 w-auto md:h-16" title={BRAND} />
      <h3 className={cn(HEADING, "mx-auto mt-6 max-w-[13ch] text-5xl leading-[1.02] md:text-7xl")}>Agents that work on your terms.</h3>
    </div>
  );
}

// Below the width the ring needs, the nine places sit under the words.
function PlaceGrid({ className }: { className?: string }) {
  return (
    <ul className={cn("mx-auto grid w-full max-w-md grid-cols-2 gap-2 max-sm:[&>li:last-child]:col-span-2", className)}>
      {PLACES.map((p) => (
        <li key={p.id}>
          <PlaceChip id={p.id} compact />
        </li>
      ))}
    </ul>
  );
}

function StillJourney() {
  return (
    <div className="max-w-container mx-auto space-y-24 py-24 md:py-32">
      <h2 id="journey-heading" className={STATEMENT}>
        AI agents are doing real work now.
      </h2>
      <p className={STATEMENT}>Nobody taught them the rules.</p>
      <div>
        <Resolution />
        <PlaceGrid className="mt-12 max-w-2xl sm:grid-cols-3" />
      </div>
    </div>
  );
}

// The windows are drawn at laptop size and scale with the screen, never below
// a size that still reads as a window on a phone.
function useWindowScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(1.12, Math.max(0.5, window.innerWidth / 1440)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function Beat({ opacity, filter, y, z, children }: { opacity: MotionValue<number>; filter: MotionValue<string>; y?: MotionValue<number>; z: number; children: ReactNode }) {
  return (
    <m.div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5" style={{ opacity, filter, y, zIndex: z }}>
      {children}
    </m.div>
  );
}

function MovingJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const size = useWindowScale();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // The spring keeps every value here on one clock; without it Motion hands
  // opacity and blur to the browser's own scroll timeline while the rest is
  // computed in JS, and the two drift apart.
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  const oneOpacity = useTransform(progress, [0.22, 0.3], [1, 0]);
  const oneBlur = useTransform(progress, [0.22, 0.3], ["blur(0px)", "blur(5px)"]);

  const twoOpacity = useTransform(progress, [0.24, 0.32, 0.56, 0.6], [0, 1, 1, 0]);
  const twoBlur = useTransform(progress, [0.24, 0.32, 0.56, 0.6], ["blur(5px)", "blur(0px)", "blur(0px)", "blur(5px)"]);

  const endOpacity = useTransform(progress, [0.62, 0.66], [0, 1]);
  const endBlur = useTransform(progress, [0.62, 0.66], ["blur(5px)", "blur(0px)"]);
  const endY = useTransform(progress, [0.62, 0.66], [14, 0], { ease: easeOut });

  return (
    <div ref={sectionRef} className="relative h-[420vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Ring progress={progress} />

        {/* A soft glow of the page colour behind the words, so neither a wire
            nor a window edge ever runs through a line of text. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35]"
          style={{
            background:
              "radial-gradient(40% 22% at 50% 50%, var(--background) 58%, color-mix(in oklab, var(--background) 62%, transparent) 78%, transparent 100%)",
          }}
        />

        <div aria-hidden="true">
          {WINDOWS.map((win, i) => (
            <FlyingWindow key={i} win={win} index={i} progress={progress} size={size} />
          ))}
        </div>

        <Beat opacity={oneOpacity} filter={oneBlur} z={36}>
          <h2 id="journey-heading" className={STATEMENT}>
            AI agents are doing real work now.
          </h2>
        </Beat>
        <Beat opacity={twoOpacity} filter={twoBlur} z={36}>
          <p className={STATEMENT}>Nobody taught them the rules.</p>
        </Beat>
        <Beat opacity={endOpacity} filter={endBlur} y={endY} z={50}>
          <div>
            <Resolution />
            <PlaceGrid className="mt-8 lg:hidden" />
          </div>
        </Beat>
      </div>
    </div>
  );
}

export default function Journey() {
  const reduce = useReducedMotion();
  return (
    <section id="story" aria-labelledby="journey-heading" className="bg-background relative">
      {reduce ? <StillJourney /> : <MovingJourney />}
    </section>
  );
}
