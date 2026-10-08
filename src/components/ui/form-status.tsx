import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { DangerTriangle } from "@/components/ui/solar-icons";

// What a form shows once it has gone through.
export function FormDone({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status">
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
        <Check aria-hidden="true" className="size-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      </span>
      <p className="text-foreground mt-4 text-lg font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1.5 max-w-xs text-sm leading-relaxed">{text}</p>
      {children}
    </div>
  );
}

// What a form shows when sending did not work.
export function FormFailed() {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-200">
      <DangerTriangle className="mt-0.5 size-4 shrink-0" />
      That did not send. Please check the fields above and try again.
    </p>
  );
}
