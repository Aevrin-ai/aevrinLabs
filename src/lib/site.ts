// The name, written exactly like this everywhere: titles, meta, alt text,
// the footer and the copyright line.
export const BRAND = "Aevrinlabs";
export const SITE_URL = "https://aevrinlabs.com";

/*
  One Formspree form takes both the waitlist and the contact form; each sends
  its own subject line so the two are easy to tell apart in the inbox. Set
  VITE_FORMSPREE_ID in .env (see .env.example).
*/
export const FORM_ID: string = import.meta.env.VITE_FORMSPREE_ID ?? "";

// How every form field and its label look, on the contact page and in the
// waitlist dialog alike.
export const FIELD =
  "border-border bg-window text-foreground placeholder:text-muted-foreground/70 w-full rounded-xl border px-4 py-3 text-[15px] transition-[border-color,box-shadow] outline-none focus:border-foreground/40 focus:ring-4 focus:ring-signal/25";
export const LABEL = "text-foreground text-sm font-medium";
