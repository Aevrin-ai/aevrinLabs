import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { capability } from "@/data/capabilities";
import { BentoCard, CtaBand, FeatureColumns, HEADING, SectionIntro } from "@/components/ui/blocks";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { PatternPanel } from "@/components/ui/scene";
import { AltArrowDown } from "@/components/ui/solar-icons";
import AuditTrail from "@/components/mockups/audit-trail";
import Everywhere from "@/components/mockups/everywhere";
import Spend from "@/components/mockups/spend";
import { useWaitlist } from "@/components/waitlist/context";

/* ── Call to action ───────────────────────────────────────── */

// The card between sections that asks for the next step.
export function WaitlistBand({ title, text }: { title: string; text: string }) {
  const { openWaitlist } = useWaitlist();
  return (
    <CtaBand title={title} text={text}>
      <Pill size="lg" onClick={openWaitlist}>
        Join the waitlist
        <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </Pill>
      <Pill size="lg" variant="outline" to="/contact">
        Talk to us
      </Pill>
    </CtaBand>
  );
}

/* ── Everywhere work happens ──────────────────────────────── */

// Where Activepieces shows its wall of apps, Aevrinlabs shows where it sits.
export function EverywhereSection() {
  return (
    <section id="everywhere" aria-labelledby="everywhere-heading" className="max-w-container mx-auto py-16 md:py-24">
      <SectionIntro
        id="everywhere-heading"
        eyebrow="Where it works"
        title="Right where the work happens."
        lead={`Agents and people work in chat apps and code editors. ${BRAND} sits right there, so it sees each step as it happens.`}
      />
      <Reveal delay={0.05} className="mt-10 md:mt-12">
        <PatternPanel name="low" className="px-3 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
          <Everywhere />
        </PatternPanel>
      </Reveal>
      <FeatureColumns
        className="mt-10 md:mt-12"
        items={[
          { title: "In the path", text: "It sees each move as it happens, not after." },
          { title: "One place to look", text: "Every agent, from every team, shows up in one list." },
          { title: "Work keeps moving", text: "Agents and people just get their work done, on your company's terms." },
        ]}
      />
    </section>
  );
}

/* ── Prove it ─────────────────────────────────────────────── */

// Two cards side by side, the way Activepieces sets its bento rows.
export function ProveSection() {
  const audit = capability("audit");
  const spend = capability("spend");
  return (
    <section aria-labelledby="prove-heading" className="max-w-container mx-auto py-16 md:py-24">
      <Reveal>
        <h2 id="prove-heading" className={cn(HEADING, "max-w-[18ch] text-3xl leading-[1.08] md:text-4xl")}>
          Know what happened, and what it cost.
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
        <div id="audit" className="scroll-mt-24">
          <BentoCard title={audit.name} description="Every AI action, from every agent, in one record." pattern="right" fit>
            <AuditTrail />
          </BentoCard>
        </div>
        <div id="spend" className="scroll-mt-24">
          <BentoCard title={spend.name} description={spend.lead} pattern="left" fit delay={0.06}>
            <Spend />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ── Questions ────────────────────────────────────────────── */

// Answers taken only from what Aevrinlabs does; nothing here goes past it.
const FAQS = [
  {
    q: "What is an AI agent?",
    a: "A program that does a job on its own, like answering tickets or reading invoices. It uses your apps and data to get it done.",
  },
  { q: "What is an MCP server?", a: "A plug that lets an AI agent use another app, like email or a database." },
  {
    q: "What is a skill?",
    a: "A new trick an agent can learn, like writing a report. Agents can pick skills up on their own, so it helps to know which ones are in use.",
  },
  {
    q: `Does ${BRAND} find agents nobody approved?`,
    a: "Yes. It shows every agent, MCP server and skill in use across your company, including the ones nobody approved.",
  },
  {
    q: `Who is ${BRAND} for?`,
    a: "Companies that use AI agents, and the security, IT and engineering leaders who answer for them.",
  },
  { q: "How do I get access?", a: "Join the waitlist. We will reach out when there is a spot for your team." },
];

function Question({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const id = useId();
  return (
    <div className="border-border bg-card rounded-2xl border">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="text-foreground flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-[17px] font-semibold"
        >
          {q}
          <AltArrowDown className={cn("text-muted-foreground size-5 shrink-0 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="text-muted-foreground px-6 pb-5 text-base leading-relaxed">
        {a}
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="max-w-container mx-auto py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 id="faq-heading" className={cn(HEADING, "text-3xl leading-[1.08] md:text-4xl")}>
            Questions, answered
          </h2>
        </Reveal>
        <Reveal delay={0.05} className="mt-8 space-y-3">
          {FAQS.map((item, i) => (
            <Question key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
