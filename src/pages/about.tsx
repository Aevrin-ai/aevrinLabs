import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { FeatureColumns, HEADING, SectionIntro } from "@/components/ui/blocks";
import { Logo } from "@/components/ui/logo";
import { PageMeta } from "@/components/ui/page-meta";
import { Reveal } from "@/components/ui/reveal";
import { PatternPanel } from "@/components/ui/scene";
import { WaitlistBand } from "@/components/sections/home-sections";

/*
  Why Aevrinlabs exists, told as a short story in four parts. No team page and
  no dates: just the problem, and what we are doing about it.
*/

const STORY = [
  {
    title: "Agents started doing real work.",
    text: "AI used to help people write. Now AI agents do whole jobs on their own. They answer customers, read invoices, review code and move data from one app to another.",
  },
  {
    title: "But nobody taught them the rules.",
    text: "A new person at a company learns the rules on day one. Agents never do. So they pick up any tool or skill they find. They use other people's logins. They reach data they should not see, and they spend money without asking.",
  },
  {
    title: "So we are building a way to see and guide them.",
    text: `${BRAND} shows every agent at work. It checks the risk before the work starts, gives each agent the right access, and steps in when something goes too far. Every action is written down, and every cost is counted.`,
  },
  {
    title: "What we want.",
    text: "We want agents and people to just get their work done, on their company's terms, with rules everyone can see.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-32 sm:pt-40">
      <PageMeta
        path="/about"
        title="About us"
        description={`Why we are building ${BRAND}: AI agents now do real work, and nobody taught them the rules.`}
      />

      <div className="max-w-container mx-auto">
        <SectionIntro
          as="h1"
          layout="stacked"
          eyebrow="About us"
          title={`Why we are building ${BRAND}.`}
          titleClassName="max-w-[16ch] md:text-6xl"
          lead="A short story about AI agents, and the rules they never got."
        />

        {/* The brand banner: the name on plain ground, blocks off the edges. */}
        <Reveal delay={0.05} className="mt-10 md:mt-14">
          <PatternPanel name="banner" className="h-[240px] sm:h-[320px] lg:h-[380px]">
            <div className="flex h-full items-end p-6 sm:p-10">
              <Logo className="text-foreground h-10 w-auto sm:h-14 lg:h-16" />
            </div>
          </PatternPanel>
        </Reveal>

        <ol className="mx-auto mt-16 max-w-3xl space-y-14 md:mt-24 md:space-y-20">
          {STORY.map((part, i) => (
            <Reveal as="li" key={part.title}>
              <span className="text-signal-text font-mono text-sm font-medium">0{i + 1}</span>
              <h2 className={cn(HEADING, "mt-2 text-3xl leading-[1.1] md:text-[40px]")}>{part.title}</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed text-pretty md:text-xl">{part.text}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 md:mt-28">
          <Reveal>
            <h2 className={cn(HEADING, "text-3xl md:text-4xl")}>What we believe</h2>
          </Reveal>
          <FeatureColumns
            className="mt-8"
            items={[
              { title: "See it first", text: "You cannot guide what you cannot see." },
              { title: "Plain rules", text: "Rules should be clear enough for anyone to read." },
              { title: "Help, not fear", text: "Good rules let people and agents get on with the work." },
            ]}
          />
        </div>
      </div>

      <WaitlistBand title="Come along for the start." text="Join the waitlist. We will reach out when there is a spot for your team." />
    </main>
  );
}
