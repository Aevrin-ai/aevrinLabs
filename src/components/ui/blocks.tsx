import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import { Pattern, type PatternName } from "@/components/ui/scene";
import { Reveal } from "@/components/ui/reveal";

/*
  The repeating pieces of a page: the label and heading a section opens with,
  a card that names a feature above a window showing it, a row of short points
  split by thin rules, a ticked list, a link onward, and a band that asks for
  the next step.
*/

// The small label above a heading, marked with a Signal dot.
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-muted-foreground flex items-center gap-2 text-sm font-medium", className)}>
      <span aria-hidden="true" className="bg-signal size-2 rounded-full" />
      {children}
    </span>
  );
}

export const HEADING = "font-heading text-foreground font-bold tracking-[-0.02em] text-balance";

type SectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  layout?: "split" | "stacked";
  as?: "h1" | "h2";
  titleClassName?: string;
  leadClassName?: string;
  className?: string;
  children?: ReactNode;
};

/*
  How a section opens: a label, a bold heading, and a lead. `split` sets the
  lead beside the heading on a wide screen; `stacked` puts it beneath.
*/
export function SectionIntro({
  eyebrow,
  title,
  lead,
  id,
  layout = "split",
  as: Heading = "h2",
  titleClassName = "max-w-[16ch]",
  leadClassName = "max-w-[44ch]",
  className,
  children,
}: SectionIntroProps) {
  const split = layout === "split";
  return (
    <Reveal className={cn(split && "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16", className)}>
      <div>
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <Heading id={id} className={cn(HEADING, "text-4xl leading-[1.05] md:text-5xl", titleClassName)}>
          {title}
        </Heading>
      </div>
      {(lead || children) && (
        <div className={cn(!split && "mt-5", leadClassName)}>
          {lead && <p className="text-muted-foreground text-lg leading-relaxed text-pretty md:text-xl">{lead}</p>}
          {children}
        </div>
      )}
    </Reveal>
  );
}

// One line of a ticked list.
export function CheckItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <li className={cn("text-foreground flex items-start gap-2.5 text-[15px] leading-relaxed", className)}>
      <span className="bg-signal text-ink mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full">
        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

// A text link onward to another page of this site.
export function OnwardLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn("group text-foreground inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline", className)}
    >
      {children}
      <ArrowRight aria-hidden="true" className="size-[1em] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

type BentoCardProps = {
  title: string;
  description?: string;
  pattern?: PatternName;
  className?: string;
  children: ReactNode;
  delay?: number;
  // A grid that must sit wholly inside, rather than bleed off the edges.
  fit?: boolean;
};

export function BentoCard({ title, description, pattern = "right", className, children, delay = 0, fit = false }: BentoCardProps) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn("border-border bg-card flex h-[460px] flex-col overflow-hidden rounded-[24px] border md:h-[500px]", className)}
    >
      <div className="border-border border-b px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
        <h3 className="text-foreground text-xl leading-snug font-medium tracking-tight">{title}</h3>
        {description && <p className="text-muted-foreground mt-1.5 text-[15px] leading-relaxed text-pretty">{description}</p>}
      </div>
      <div className="relative isolate min-h-0 flex-1 overflow-hidden">
        <Pattern name={pattern} />
        {/* A list panel runs off the right and bottom edges, the way a window
            is cropped in a screenshot; a grid (`fit`) sits wholly inside,
            since cropping it would cut a column in half. */}
        <div className={cn("absolute", fit ? "inset-4 md:inset-7" : "top-6 -right-8 -bottom-10 left-5 md:top-8 md:-bottom-12 md:left-8")}>
          {children}
        </div>
      </div>
    </Reveal>
  );
}

export type Point = { title: string; text: string };

// Three (or four) short points side by side, each a title and a sentence.
export function FeatureColumns({ items, className }: { items: readonly Point[]; className?: string }) {
  return (
    <ul
      className={cn(
        "md:divide-border grid gap-8 md:gap-0 md:divide-x",
        items.length === 4 ? "sm:grid-cols-2 md:grid-cols-4" : "md:grid-cols-3",
        className
      )}
    >
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} delay={i * 0.06} y={16} className="md:px-6 md:first:pl-0 md:last:pr-0">
          <h3 className="text-foreground text-lg leading-snug font-semibold">{item.title}</h3>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed text-pretty">{item.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

type CtaBandProps = { title: string; text?: string; points?: readonly string[]; children: ReactNode; className?: string };

// A quiet band between sections that asks for the next step.
export function CtaBand({ title, text, points, children, className }: CtaBandProps) {
  return (
    <Reveal className={cn("max-w-container mx-auto py-10 md:py-14", className)}>
      <div className="border-border bg-card flex flex-col gap-8 rounded-[24px] border p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="min-w-0">
          <h2 className={cn(HEADING, "text-[26px] leading-tight md:text-[28px]")}>{title}</h2>
          {text && <p className="text-muted-foreground mt-3 max-w-[60ch] text-base leading-relaxed text-pretty md:text-[17px]">{text}</p>}
          {points && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {points.map((point) => (
                <CheckItem key={point} className="text-sm">
                  {point}
                </CheckItem>
              ))}
            </ul>
          )}
        </div>
        {/* On a phone the buttons stack at full width; wider, they keep to
            one row, and beside the text they never wrap under each other. */}
        <div className="flex flex-col gap-3 max-sm:*:w-full sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0 lg:flex-nowrap">
          {children}
        </div>
      </div>
    </Reveal>
  );
}
