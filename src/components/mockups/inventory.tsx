import { useRef } from "react";

import { cn } from "@/lib/utils";
import { useAutoplay } from "@/hooks/use-autoplay";
import { Count } from "@/components/ui/count";
import { Cpu, MagicStick, PlugCircle, Radar, type IconComponent } from "@/components/ui/solar-icons";
import { AppCard, Appear, Status, Tag, Tile } from "./kit";

/*
  1 · Agent inventory. The list fills row by row with agents, MCP servers and
  skills from across the company, each with the team it belongs to. Two land
  as not approved and light up, and the count at the top ticks up as it goes.
*/

type Kind = "Agent" | "MCP server" | "Skill";
const KIND_ICON: Record<Kind, IconComponent> = { Agent: Cpu, "MCP server": PlugCircle, Skill: MagicStick };

const ROWS: { name: string; kind: Kind; owner: string; ok: boolean }[] = [
  { name: "Support helper", kind: "Agent", owner: "Support team", ok: true },
  { name: "Invoice reader", kind: "Agent", owner: "Finance team", ok: true },
  { name: "files-sync", kind: "MCP server", owner: "Owner unknown", ok: false },
  { name: "Code reviewer", kind: "Agent", owner: "Engineering", ok: true },
  { name: "CRM connector", kind: "MCP server", owner: "Sales team", ok: true },
  { name: "Bulk email sender", kind: "Skill", owner: "Marketing", ok: false },
];

// What the count reads as each row lands.
const FOUND = [0, 7, 14, 21, 28, 35, 42];

// 0 the header, 1-6 each row, 7 the two strangers light up, 8 hold.
const DURATIONS = [0.7, 0.45, 0.45, 0.5, 0.45, 0.45, 0.6, 1.2, 3.2];
const FLAG = 7;

export default function Inventory({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { phase } = useAutoplay(ref, DURATIONS);
  const flagged = phase >= FLAG;

  return (
    <AppCard
      className={cn("mx-auto w-full max-w-[620px]", className)}
      label="An inventory fills with the agents, MCP servers and skills a company uses, and two that nobody approved are marked in red."
    >
      <div ref={ref}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <Tile icon={Radar} className="bg-signal/15" iconClassName="text-signal-text" />
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-semibold">Inventory</span>
            <span className="text-muted-foreground block truncate text-[14px]">Agents, MCP servers and skills</span>
          </span>
          <span className="text-right">
            <span className="block text-[26px] leading-none font-semibold tabular-nums">
              <Count value={FOUND[Math.min(phase, 6)]} duration={0.4} />
            </span>
            <span className="text-muted-foreground block text-[13px]">found</span>
          </span>
        </div>

        <ul className="border-foreground/[0.08] border-t">
          {ROWS.map((row, i) => {
            const stranger = !row.ok && flagged;
            return (
              <Appear
                key={row.name}
                as="li"
                show={phase >= 1 + i}
                className={cn(
                  "border-foreground/[0.06] flex items-center gap-3 border-b px-5 py-3 transition-colors duration-500 last:border-b-0 sm:gap-3.5 sm:px-6",
                  stranger && "bg-red-50 dark:bg-red-500/10"
                )}
              >
                <Tile icon={KIND_ICON[row.kind]} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-medium">{row.name}</span>
                    <Tag className="max-sm:hidden">{row.kind}</Tag>
                  </span>
                  <span className="text-muted-foreground block truncate text-[14px]">{row.owner}</span>
                </span>
                {row.ok ? (
                  <Status tone="good">Approved</Status>
                ) : (
                  <Status tone={flagged ? "bad" : "idle"} className={cn(flagged && "font-medium text-red-700 dark:text-red-300")}>
                    Not approved
                  </Status>
                )}
              </Appear>
            );
          })}
        </ul>
      </div>
    </AppCard>
  );
}
