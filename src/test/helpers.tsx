import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { LazyMotion, domMax } from "motion/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import { WaitlistContext } from "@/components/waitlist/context";

// Renders inside what every page has around it: the router, Motion's features
// and the waitlist. `openWaitlist` is returned so a test can check it was used.
export function renderPage(ui: ReactElement, { path = "/" }: { path?: string } = {}) {
  const openWaitlist = vi.fn();
  const result = render(
    <LazyMotion features={domMax} strict>
      <MemoryRouter initialEntries={[path]}>
        <WaitlistContext.Provider value={{ openWaitlist }}>{ui}</WaitlistContext.Provider>
      </MemoryRouter>
    </LazyMotion>
  );
  return { ...result, openWaitlist };
}

// Answers FormSubmit in place of the network, and records what was sent.
export function stubFormSubmit({ ok = true }: { ok?: boolean } = {}) {
  const sent: { url: string; body: Record<string, string> }[] = [];
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    sent.push({ url, body: JSON.parse(String(init?.body ?? "{}")) });
    const payload = ok ? { success: "true", message: "The form was submitted successfully." } : { success: "false", message: "Something went wrong" };
    return new Response(JSON.stringify(payload), { status: ok ? 200 : 500, headers: { "Content-Type": "application/json" } });
  });
  return { fetch, sent };
}
