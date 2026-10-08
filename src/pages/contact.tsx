import { ValidationError } from "@formspree/react";
import { ArrowRight } from "lucide-react";

import { BRAND, FIELD, LABEL } from "@/lib/site";
import { useSiteForm } from "@/lib/use-site-form";
import { HEADING, SectionIntro } from "@/components/ui/blocks";
import { FormDone, FormFailed } from "@/components/ui/form-status";
import { PageMeta } from "@/components/ui/page-meta";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { useWaitlist } from "@/components/waitlist/context";

function ContactForm() {
  const { state, handleSubmit, reset, failed } = useSiteForm();

  if (state.succeeded) {
    return (
      <FormDone title="Thanks, we got it." text="We will write back to the email you gave us.">
        <button
          type="button"
          onClick={reset}
          className="border-border text-foreground hover:bg-muted mt-6 h-10 rounded-full border px-5 text-sm font-medium transition-colors"
        >
          Send another
        </button>
      </FormDone>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="_subject" value="Contact form" />
      <input type="hidden" name="form" value="contact" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className={LABEL}>
            Name <span className="text-signal-text">*</span>
          </label>
          <input id="contact-name" name="name" required autoComplete="name" className={FIELD} />
          <ValidationError field="name" errors={state.errors} className="text-xs text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className={LABEL}>
            Work email <span className="text-signal-text">*</span>
          </label>
          <input id="contact-email" type="email" name="email" required autoComplete="email" placeholder="you@company.com" className={FIELD} />
          <ValidationError field="email" errors={state.errors} className="text-xs text-red-600 dark:text-red-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-company" className={LABEL}>
          Company
        </label>
        <input id="contact-company" name="company" autoComplete="organization" className={FIELD} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className={LABEL}>
          Message <span className="text-signal-text">*</span>
        </label>
        <textarea id="contact-message" name="message" required rows={6} className={cn(FIELD, "resize-y")} />
        <ValidationError field="message" errors={state.errors} className="text-xs text-red-600 dark:text-red-400" />
      </div>

      {failed && <FormFailed />}

      <Pill type="submit" size="lg" disabled={state.submitting} className="w-full sm:w-auto">
        {state.submitting ? "Sending" : "Send message"}
        {!state.submitting && <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />}
      </Pill>
    </form>
  );
}

export default function ContactPage() {
  const { openWaitlist } = useWaitlist();
  return (
    <main className="pt-32 pb-16 sm:pt-40 md:pb-24">
      <PageMeta path="/contact" title="Contact us" description={`Questions, ideas or working together: send ${BRAND} a note and we will write back.`} />

      <div className="max-w-container mx-auto grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionIntro
            as="h1"
            layout="stacked"
            eyebrow="Contact us"
            title="Talk to us."
            titleClassName="md:text-6xl"
            lead="Questions, ideas, or want to work together? Send us a note and we will write back."
          />
          <Reveal delay={0.1} className="border-border bg-card mt-10 rounded-[24px] border p-6 sm:p-7">
            <h2 className={cn(HEADING, "text-xl")}>Want early access?</h2>
            <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">Join the waitlist. We will reach out when there is a spot for your team.</p>
            <Pill variant="ink" size="sm" onClick={openWaitlist} className="mt-5">
              Join the waitlist
            </Pill>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="border-border bg-card rounded-[28px] border p-6 sm:p-10">
          <ContactForm />
        </Reveal>
      </div>
    </main>
  );
}
