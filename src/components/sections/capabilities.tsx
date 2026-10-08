import type { ComponentType } from "react";

import { capability, type CapabilityId } from "@/data/capabilities";
import { FeatureColumns, SectionIntro } from "@/components/ui/blocks";
import { Reveal } from "@/components/ui/reveal";
import { PatternPanel, type PatternName } from "@/components/ui/scene";
import Access from "@/components/mockups/access";
import Guardrails from "@/components/mockups/guardrails";
import Inventory from "@/components/mockups/inventory";
import RiskScore from "@/components/mockups/risk-score";

/*
  One capability, laid out the way Activepieces lays out "Agents that get the
  job done": a heading with its lead beside it, the product playing out on
  the brand pattern, and three short points split by thin rules.
*/

const STORIES: Partial<Record<CapabilityId, { Mockup: ComponentType; pattern: PatternName }>> = {
  inventory: { Mockup: Inventory, pattern: "right" },
  risk: { Mockup: RiskScore, pattern: "left" },
  access: { Mockup: Access, pattern: "low" },
  guardrails: { Mockup: Guardrails, pattern: "right" },
};

export function CapabilitySection({ id }: { id: CapabilityId }) {
  const c = capability(id);
  const story = STORIES[id];
  if (!story) return null;
  const { Mockup, pattern } = story;
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="max-w-container mx-auto scroll-mt-24 py-16 md:py-24">
      <SectionIntro id={headingId} eyebrow={c.name} title={c.title} lead={c.lead} />
      <Reveal delay={0.05} className="mt-10 md:mt-12">
        <PatternPanel name={pattern} className="px-3 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16 lg:pt-14 lg:pb-14">
          <Mockup />
        </PatternPanel>
      </Reveal>
      <FeatureColumns items={c.points} className="mt-10 md:mt-12" />
    </section>
  );
}
