import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Link, useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Pill } from "@/components/ui/pill";
import { AltArrowDown, AltArrowRight, HamburgerMenu } from "@/components/ui/solar-icons";
import { useWaitlist } from "@/components/waitlist/context";
import { menus, type MenuColumn, type MenuItem as Item } from "./nav-links";

/*
  The navigation bar: one floating island. A menu opens inside the island,
  below a hairline, so the bar and its panel read as one surface that grows
  rather than a dropdown hanging off it. Panels open on hover with a mouse,
  and on click or Enter otherwise. Moving from one menu straight to another
  morphs the panel to the new height instead of closing and reopening it.
*/

const TRIGGER =
  "group text-foreground flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition-[background-color,transform] duration-200 hover:bg-foreground/[0.06] active:scale-[0.97]";

// One entry in a panel: an icon in a soft square, a name, and a line about it.
function MenuItem({ item, onDone, onHover }: { item: Item; onDone: () => void; onHover: (el: HTMLElement) => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onDone}
      onPointerEnter={(e) => onHover(e.currentTarget)}
      onFocus={(e) => onHover(e.currentTarget)}
      className="relative z-10 flex items-center gap-3.5 rounded-xl px-3 py-2.5"
    >
      <span className="bg-foreground/[0.06] grid size-10 shrink-0 place-items-center rounded-lg">
        <Icon className="text-foreground/80 size-[22px]" />
      </span>
      <span className="flex flex-col gap-0.5 text-left">
        <span className="text-foreground text-[15px] font-semibold">{item.title}</span>
        <span className="text-muted-foreground text-[13px]">{item.description}</span>
      </span>
    </Link>
  );
}

type Spot = { left: number; top: number; width: number; height: number; hidden?: boolean };

/*
  The columns of a panel, with one soft highlight behind them that slides to
  whichever item the pointer or keyboard is on.
*/
function Columns({ columns, onDone, stacked = false }: { columns: MenuColumn[]; onDone: () => void; stacked?: boolean }) {
  const surface = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<Spot | null>(null);

  const hover = (el: HTMLElement) => {
    if (!surface.current) return;
    const box = surface.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setSpot({ left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height });
  };
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      ref={surface}
      onPointerLeave={() => setSpot((s) => s && { ...s, hidden: true })}
      className={cn("relative -mx-3 flex gap-5", stacked && "flex-col gap-4")}
    >
      <span
        aria-hidden="true"
        className="bg-foreground/[0.05] pointer-events-none absolute rounded-xl"
        style={{
          left: spot?.left ?? 0,
          top: spot?.top ?? 0,
          width: spot?.width ?? 0,
          height: spot?.height ?? 0,
          opacity: spot && !spot.hidden ? 1 : 0,
          scale: spot && !spot.hidden ? 1 : 0.96,
          transition: `opacity 130ms ease, scale 130ms ease, left 220ms ${ease}, top 220ms ${ease}, width 220ms ${ease}, height 220ms ${ease}`,
        }}
      />
      {columns.map((column) => (
        <div key={column.heading} className="min-w-0 flex-1">
          <p className="text-muted-foreground px-3 pb-2 text-[11px] font-semibold tracking-[0.08em] uppercase">{column.heading}</p>
          <ul className="flex flex-col gap-1">
            {column.items.map((item) => (
              <li key={item.title}>
                <MenuItem item={item} onDone={onDone} onHover={hover} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { openWaitlist } = useWaitlist();
  const reduce = useReducedMotion();
  const location = useLocation();
  const island = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Anything that moves to another page closes the menu behind it.
  const here = location.pathname + location.hash;
  const [lastPath, setLastPath] = useState(here);
  if (here !== lastPath) {
    setLastPath(here);
    setOpen(null);
  }

  const close = useCallback(() => setOpen(null), []);

  // Escape and a press anywhere outside the island close it too. Escape
  // hands focus back to the button that opened the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = document.querySelector<HTMLElement>(`[data-menu="${open}"]`);
      setOpen(null);
      trigger?.focus();
    };
    const onDown = (event: globalThis.PointerEvent) => {
      if (!island.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Hovering opens a panel at once; leaving the island waits a moment, so a
  // pointer cutting a corner on its way into the panel does not shut it.
  // The menu a hover just opened is remembered, so the click that usually
  // follows keeps it open instead of toggling it straight back shut.
  const hoverOpened = useRef<string | null>(null);
  const hoverOpen = (id: string) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    hoverOpened.current = id;
    setOpen(id);
  };
  const hoverLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || open === "mobile") return;
    closeTimer.current = setTimeout(() => {
      hoverOpened.current = null;
      setOpen(null);
    }, 160);
  };
  const toggle = (id: string) => {
    if (hoverOpened.current === id) {
      hoverOpened.current = null;
      setOpen(id);
      return;
    }
    setOpen((current) => (current === id ? null : id));
  };
  const hoverStay = () => clearTimeout(closeTimer.current);

  // What the panel shows. It keeps the last menu while the panel closes, so
  // the contents fade out with it rather than vanishing before it shrinks.
  const [shown, setShown] = useState<string | null>(null);
  if (open && open !== shown) setShown(open);
  const menu = menus.find((m) => m.id === shown);
  const raised = scrolled || open;

  // The panel's height follows its contents, measured, so it eases between
  // menus of different sizes instead of jumping.
  const contents = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const el = contents.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
      <div className="max-w-container mx-auto">
        <div
          ref={island}
          onPointerLeave={hoverLeave}
          onPointerEnter={hoverStay}
          className={cn(
            "overflow-hidden rounded-2xl ring-1 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ease-out",
            raised
              ? "bg-window/95 ring-foreground/[0.07] shadow-[0_1px_2px_rgba(18,19,22,0.05),0_12px_32px_-14px_rgba(18,19,22,0.22)]"
              : "bg-window/60 ring-foreground/[0.05]"
          )}
        >
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-3 px-4 md:h-[68px] md:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <Link to="/" className="text-foreground flex min-h-11 items-center justify-self-start">
              <Logo className="h-[26px] w-auto md:h-7" />
            </Link>

            <ul className="hidden items-center gap-1 justify-self-center lg:flex">
              {menus.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    data-menu={m.id}
                    aria-expanded={open === m.id}
                    aria-controls="nav-panel"
                    onPointerEnter={hoverOpen(m.id)}
                    onClick={() => toggle(m.id)}
                    className={cn(TRIGGER, open === m.id && "bg-foreground/[0.06]")}
                  >
                    {m.label}
                    <AltArrowDown className={cn("-mr-0.5 size-4 transition-transform duration-200 ease-out", open === m.id && "rotate-180")} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 justify-self-end">
              <Pill variant="soft" size="sm" to="/contact" className="hidden md:inline-flex">
                Talk to us
              </Pill>
              <Pill size="sm" onClick={openWaitlist} className="pr-3">
                <span className="max-[359px]:hidden">Join the waitlist</span>
                <span className="min-[360px]:hidden">Join</span>
                <AltArrowRight className="-mr-1 transition-transform group-hover:translate-x-0.5" />
              </Pill>
              <button
                type="button"
                data-menu="mobile"
                aria-expanded={open === "mobile"}
                aria-controls="nav-panel"
                aria-label={open === "mobile" ? "Close menu" : "Open menu"}
                onClick={() => setOpen((current) => (current === "mobile" ? null : "mobile"))}
                className="text-foreground hover:bg-foreground/[0.06] flex size-10 items-center justify-center rounded-full lg:hidden"
              >
                {open === "mobile" ? <X aria-hidden="true" className="size-5" /> : <HamburgerMenu className="size-5" />}
              </button>
            </div>
          </nav>

          {/* The panel grows out of the bar. Its height eases to fit whatever
              it holds; the contents fade and settle in as it opens. */}
          <div
            id="nav-panel"
            inert={!open}
            className="overflow-hidden"
            style={{
              height: open ? height : 0,
              opacity: open ? 1 : 0,
              transition: reduce ? "none" : "height 380ms cubic-bezier(0.22,1,0.36,1), opacity 240ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div ref={contents}>
              {shown && (
                <div key={shown} className="nav-panel-in border-border mx-4 border-t pt-4 pb-6 md:mx-6">
                  {shown === "mobile" ? (
                    <div className="-mx-3 max-h-[calc(100svh-120px)] space-y-6 overflow-x-hidden overflow-y-auto px-3">
                      {menus.map((m) => (
                        <Columns key={m.id} columns={m.columns} onDone={close} stacked />
                      ))}
                      <div className="border-border flex flex-col gap-2 border-t pt-5 sm:flex-row">
                        <Pill variant="soft" to="/contact">
                          Talk to us
                        </Pill>
                        <Pill
                          onClick={() => {
                            close();
                            openWaitlist();
                          }}
                        >
                          Join the waitlist
                        </Pill>
                      </div>
                    </div>
                  ) : (
                    menu && <Columns columns={menu.columns} onDone={close} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
