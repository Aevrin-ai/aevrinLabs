import { cn } from "@/lib/utils";
import { HEADING, OnwardLink } from "@/components/ui/blocks";
import { PageMeta } from "@/components/ui/page-meta";

export default function NotFoundPage() {
  return (
    <main className="max-w-container mx-auto flex min-h-[70svh] flex-col items-start justify-center pt-32 pb-24">
      <PageMeta path="/404" title="Page not found" description="This page is not here." />
      <span className="text-signal-text font-mono text-sm font-medium">404</span>
      <h1 className={cn(HEADING, "mt-3 text-5xl md:text-6xl")}>This page is not here.</h1>
      <p className="text-muted-foreground mt-4 max-w-[40ch] text-lg leading-relaxed">It may have moved, or the link may be wrong.</p>
      <OnwardLink to="/" className="mt-8 text-lg">
        Go to the home page
      </OnwardLink>
    </main>
  );
}
