import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { CAPABILITIES } from "@/data/capabilities";
import { HEADING } from "@/components/ui/blocks";
import { Logo } from "@/components/ui/logo";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/scene";
import { useWaitlist } from "@/components/waitlist/context";

const linkClass = "text-muted-foreground hover:text-foreground text-[15px] transition-colors";

const COLUMNS = [
  { title: "Product", links: CAPABILITIES.map((c) => ({ text: c.name, to: `/product#${c.id}` })) },
  {
    title: "Company",
    links: [
      { text: "About us", to: "/about" },
      { text: "Contact us", to: "/contact" },
    ],
  },
];

/*
  The close of every page, built like Activepieces' own: the ask in one line
  on the brand pattern, the two ways to answer it, and the site's links on a
  card resting on the band.
*/
export default function Footer() {
  const { openWaitlist } = useWaitlist();

  return (
    <footer className="relative isolate overflow-hidden">
      <Pattern name="band" dark />

      <Reveal className="max-w-container relative mx-auto pt-24 text-center md:pt-32">
        <h2 className={cn(HEADING, "text-paper mx-auto max-w-[16ch] text-4xl leading-[1.05] md:text-6xl")}>
          Put your AI agents on your terms.
        </h2>
        <p className="text-paper/70 mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed text-pretty md:text-xl">
          Join the waitlist, and we will reach out when there is a spot for your team.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Pill size="lg" onClick={openWaitlist}>
            Join the waitlist
            <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Pill>
          <Pill size="lg" variant="soft" to="/contact" className="bg-paper/10 text-paper hover:bg-paper/15">
            Talk to us
          </Pill>
        </div>
      </Reveal>

      <div className="max-w-container relative mx-auto mt-20 md:mt-28">
        <div className="bg-background rounded-t-[28px] px-6 pt-10 pb-6 sm:px-10 md:pt-12">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="text-foreground inline-flex">
                <Logo className="h-7 w-auto" />
              </Link>
              <p className="text-muted-foreground mt-4 max-w-[30ch] text-[15px] leading-relaxed">
                See, check and guide every AI agent at work in your company.
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-foreground text-[15px] font-semibold">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.text}>
                      <Link to={link.to} className={linkClass}>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                  {col.title === "Company" && (
                    <li>
                      <button type="button" onClick={openWaitlist} className={cn(linkClass, "text-left")}>
                        Join the waitlist
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-border text-muted-foreground mt-12 border-t pt-5 text-sm">
            <p>
              &copy; {new Date().getFullYear()} {BRAND}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
