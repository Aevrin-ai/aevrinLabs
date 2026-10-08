import { lazy, Suspense, useMemo, useRef, useState, type ReactNode } from "react";

import { WaitlistContext } from "./context";

const WaitlistDialog = lazy(() => import("./dialog"));

/*
  The waitlist, mounted once for the whole site. Any button opens it through
  useWaitlist, so the navbar, the hero and every closing band lead to the same
  form. The dialog loads the first time someone opens it.
*/
export default function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Bumped on every open, so each visit to the form starts fresh.
  const [session, setSession] = useState(0);
  const opener = useRef<HTMLElement | null>(null);
  const value = useMemo(
    () => ({
      openWaitlist: () => {
        opener.current = document.activeElement as HTMLElement | null;
        setSession((s) => s + 1);
        setOpen(true);
      },
    }),
    []
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      {session > 0 && (
        <Suspense fallback={null}>
          <WaitlistDialog open={open} onOpenChange={setOpen} session={session} opener={opener} />
        </Suspense>
      )}
    </WaitlistContext.Provider>
  );
}
