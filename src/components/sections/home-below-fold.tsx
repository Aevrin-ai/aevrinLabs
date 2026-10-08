import Journey from "@/components/sections/journey";
import { CapabilitySection } from "@/components/sections/capabilities";
import { EverywhereSection, FaqSection, ProveSection, WaitlistBand } from "@/components/sections/home-sections";

// Everything on the home page below the hero. It loads as its own chunk: it
// is out of view on arrival, so it can land a moment later unseen.
export default function HomeBelowFold() {
  return (
    <>
      <Journey />
      <WaitlistBand title="Start with the agents you already have." text="Join the waitlist. We will reach out when there is a spot for your team." />
      <CapabilitySection id="inventory" />
      <CapabilitySection id="risk" />
      <CapabilitySection id="access" />
      <CapabilitySection id="guardrails" />
      <WaitlistBand title="Let your teams keep using AI, on your terms." text="Join the waitlist to try Aevrinlabs with your own agents." />
      <EverywhereSection />
      <ProveSection />
      <FaqSection />
    </>
  );
}
