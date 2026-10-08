import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { CAPABILITIES } from "@/data/capabilities";
import { CheckItem, Eyebrow, HEADING, SectionIntro } from "@/components/ui/blocks";
import { PageMeta } from "@/components/ui/page-meta";
import { Reveal } from "@/components/ui/reveal";
import { WaitlistBand } from "@/components/sections/home-sections";

/*
  The product, kept simple: what Aevrinlabs does, in six cards, each with a
  short line and three ticks. The menu links straight to each card.
*/
export default function ProductPage() {
  return (
    <main className="pt-32 sm:pt-40">
      <PageMeta
        path="/product"
        title="Product"
        description={`${BRAND} sees every AI agent, scores its risk, controls its access, stops bad moves live, keeps one audit trail and tracks AI spend.`}
      />

      <div className="max-w-container mx-auto">
        <SectionIntro
          as="h1"
          layout="stacked"
          eyebrow="Product"
          title="Six ways to see and guide your AI agents."
          titleClassName="max-w-[18ch] md:text-6xl"
          lead={`${BRAND} does six things. Here they are, in plain words.`}
        />

        <Reveal delay={0.05} className="border-border bg-card text-muted-foreground mt-10 max-w-3xl rounded-2xl border px-6 py-5 text-[15px] leading-relaxed">
          <span className="text-foreground font-semibold">Two words you will see. </span>
          An MCP server is a plug that lets an AI agent use another app. A skill is a new trick an agent can learn.
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal as="article" key={c.id} id={c.id} delay={(i % 2) * 0.06} className="border-border bg-card scroll-mt-28 rounded-[24px] border p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="bg-signal/15 grid size-11 place-items-center rounded-xl">
                    <Icon className="text-signal-text size-6" />
                  </span>
                  <Eyebrow>{c.group}</Eyebrow>
                </div>
                <h2 className={cn(HEADING, "mt-5 text-2xl md:text-[28px]")}>{c.name}</h2>
                <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty md:text-[17px]">{c.summary}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.ticks.map((tick) => (
                    <CheckItem key={tick}>{tick}</CheckItem>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>

      <WaitlistBand title="See it with your own agents." text="Join the waitlist. We will reach out when there is a spot for your team." />
    </main>
  );
}
