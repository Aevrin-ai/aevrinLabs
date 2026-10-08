import { lazy, Suspense, type RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { BRAND } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Eyebrow, HEADING } from "@/components/ui/blocks";

// Formspree loads with the form, the first time the dialog opens.
const WaitlistForm = lazy(() => import("./form"));

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: number;
  opener: RefObject<HTMLElement | null>;
};

/*
  The waitlist dialog itself. Radix supplies the focus trap, Escape to close,
  scroll lock and the dialog semantics. It is its own chunk: nothing here is
  needed until someone asks to join.
*/
export default function WaitlistDialog({ open, onOpenChange, session, opener }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay bg-ink/45 fixed inset-0 z-[60] backdrop-blur-sm" />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            // Many buttons open this dialog and none is its Trigger, so focus
            // goes back to whichever one did.
            event.preventDefault();
            opener.current?.focus?.();
          }}
          className="dialog-content border-border bg-background fixed top-1/2 left-1/2 z-[61] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border p-6 shadow-[0_40px_80px_-30px_rgba(18,19,22,0.5)] sm:p-8"
        >
          <Eyebrow>Waitlist</Eyebrow>
          <Dialog.Title className={cn(HEADING, "mt-2 text-3xl leading-tight")}>Join the {BRAND} waitlist</Dialog.Title>
          <Dialog.Description className="text-muted-foreground mt-2 mb-6 text-[15px] leading-relaxed">
            Tell us who you are. We will reach out when there is a spot for your team.
          </Dialog.Description>

          <Suspense fallback={<div className="h-[340px]" />}>
            {/* Keyed on the session so it stays mounted through the closing
                fade and still starts fresh the next time. */}
            <WaitlistForm key={session} onDone={() => onOpenChange(false)} />
          </Suspense>

          <Dialog.Close className="text-muted-foreground hover:text-foreground hover:bg-muted absolute top-5 right-5 rounded-full p-1.5 transition-colors">
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
