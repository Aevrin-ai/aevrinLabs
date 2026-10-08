// The name, written exactly like this everywhere: titles, meta, alt text,
// the footer and the copyright line.
export const BRAND = "Aevrinlabs";
export const SITE_URL = "https://aevrinlabs.com";

// Where both forms are delivered. Each sends its own subject line, so
// waitlist signups and contact messages are easy to tell apart in the inbox.
// FormSubmit is activated for this address on every page. Its private alias
// for the address would need activating again page by page, so the plain
// address stays.
export const CONTACT_EMAIL = "contact@aevrinlabs.com";
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

// How every form field and its label look, on the contact page and in the
// waitlist dialog alike.
export const FIELD =
  "border-border bg-window text-foreground placeholder:text-muted-foreground/70 w-full rounded-xl border px-4 py-3 text-[15px] transition-[border-color,box-shadow] outline-none focus:border-foreground/40 focus:ring-4 focus:ring-signal/25";
export const LABEL = "text-foreground text-sm font-medium";
