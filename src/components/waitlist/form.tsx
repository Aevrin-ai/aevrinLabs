import { ValidationError } from "@formspree/react";
import { ArrowRight } from "lucide-react";

import { FIELD, LABEL } from "@/lib/site";
import { useSiteForm } from "@/lib/use-site-form";
import { CAPABILITIES } from "@/data/capabilities";
import { Pill } from "@/components/ui/pill";
import { FormDone, FormFailed } from "@/components/ui/form-status";

/*
  Four fields, two of them required. Short on purpose: this is a place in
  line, not a sales call, and every extra field is a reason to close the
  dialog.
*/
export default function WaitlistForm({ onDone }: { onDone: () => void }) {
  const { state, handleSubmit, failed } = useSiteForm();

  if (state.succeeded) {
    return (
      <FormDone title="You are on the list." text="We will write to the email you gave us when there is a spot for your team.">
        <button
          type="button"
          onClick={onDone}
          className="border-border text-foreground hover:bg-muted mt-6 h-10 rounded-full border px-5 text-sm font-medium transition-colors"
        >
          Close
        </button>
      </FormDone>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tells the inbox this came from the waitlist, not the contact form. */}
      <input type="hidden" name="_subject" value="Waitlist signup" />
      <input type="hidden" name="form" value="waitlist" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="waitlist-name" className={LABEL}>
            Full name <span className="text-signal-text">*</span>
          </label>
          <input id="waitlist-name" name="name" required autoComplete="name" className={FIELD} />
          <ValidationError field="name" errors={state.errors} className="text-xs text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="waitlist-company" className={LABEL}>
            Company
          </label>
          <input id="waitlist-company" name="company" autoComplete="organization" className={FIELD} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="waitlist-email" className={LABEL}>
          Work email <span className="text-signal-text">*</span>
        </label>
        <input id="waitlist-email" type="email" name="email" required autoComplete="email" placeholder="you@company.com" className={FIELD} />
        <ValidationError field="email" errors={state.errors} className="text-xs text-red-600 dark:text-red-400" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="waitlist-interest" className={LABEL}>
          What do you want to see first?
        </label>
        <select id="waitlist-interest" name="interest" defaultValue="" className={FIELD}>
          <option value="" disabled>
            Choose one
          </option>
          {CAPABILITIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
          <option value="All of it">All of it</option>
        </select>
      </div>

      {failed && <FormFailed />}

      <Pill type="submit" size="lg" disabled={state.submitting} className="w-full">
        {state.submitting ? "Joining" : "Join the waitlist"}
        {!state.submitting && <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />}
      </Pill>
    </form>
  );
}
