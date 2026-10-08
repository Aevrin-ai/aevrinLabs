import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { LogoMark } from "@/components/ui/logo";
import {
  AltArrowDown,
  ChatRoundDots,
  CodeSquare,
  Cpu,
  Database,
  History,
  Key,
  MagicStick,
  Magnifer,
  PlugCircle,
  WalletMoney,
  type IconComponent,
} from "@/components/ui/solar-icons";
import { Status, Tag, type TagTone, type Tone } from "./kit";

/*
  The hero window: the Aevrinlabs app, open on its list of agents. Each card
  is one agent, with what it does, how risky it is, whether it is working
  right now, and the tools it has reached for.
*/

const NAV: { label: string; icon: IconComponent }[] = [
  { label: "Agents", icon: Cpu },
  { label: "MCP servers", icon: PlugCircle },
  { label: "Skills", icon: MagicStick },
  { label: "Logins", icon: Key },
  { label: "Audit trail", icon: History },
  { label: "Spend", icon: WalletMoney },
];

type Agent = {
  name: string;
  job: string;
  team: string;
  risk: string;
  riskTone: TagTone;
  status: string;
  tone: Tone;
  tools: IconComponent[];
  more: number;
};

const AGENTS: Agent[] = [
  {
    name: "Support helper",
    job: "Answers tickets and hands the hard ones to a person.",
    team: "Support",
    risk: "Low risk",
    riskTone: "good",
    status: "Working now",
    tone: "good",
    tools: [ChatRoundDots, Database, PlugCircle],
    more: 2,
  },
  {
    name: "Sales agent",
    job: "Updates deals and writes follow-up emails.",
    team: "Sales",
    risk: "High risk",
    riskTone: "bad",
    status: "1 step stopped",
    tone: "bad",
    tools: [Database, PlugCircle, MagicStick],
    more: 4,
  },
  {
    name: "Code reviewer",
    job: "Reads each change and leaves notes before it ships.",
    team: "Engineering",
    risk: "Low risk",
    riskTone: "good",
    status: "Ran 4 min ago",
    tone: "idle",
    tools: [CodeSquare, PlugCircle],
    more: 1,
  },
  {
    name: "Invoice reader",
    job: "Reads invoices from the inbox and files them for approval.",
    team: "Finance",
    risk: "Asks first",
    riskTone: "warn",
    status: "Waiting on a person",
    tone: "warn",
    tools: [Database, MagicStick],
    more: 1,
  },
];

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="border-border bg-window rounded-[18px] border p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <span className="bg-foreground/[0.06] grid size-12 shrink-0 place-items-center rounded-xl">
          <Cpu className="text-foreground/75 size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[18px] font-semibold lg:text-[20px]">{agent.name}</span>
          <span className="text-muted-foreground block text-[14px]">{agent.team} team</span>
        </span>
        <Tag tone={agent.riskTone} className="max-sm:hidden">
          {agent.risk}
        </Tag>
      </div>
      <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed lg:text-[16px]">{agent.job}</p>
      <div className="border-border mt-4 flex items-center gap-2 border-t pt-4">
        {agent.tools.map((Icon, i) => (
          <span key={i} className="border-border grid size-10 place-items-center rounded-lg border">
            <Icon className="text-foreground/70 size-5" />
          </span>
        ))}
        <span className="border-border text-muted-foreground grid size-10 place-items-center rounded-lg border text-[13px]">
          +{agent.more}
        </span>
        <Status tone={agent.tone} className="ml-auto text-[14px] max-sm:hidden">
          {agent.status}
        </Status>
        {/* On a phone the risk moves down here, so the name keeps its room. */}
        <Tag tone={agent.riskTone} className="ml-auto sm:hidden">
          {agent.risk}
        </Tag>
      </div>
    </div>
  );
}

export default function Console({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`The ${BRAND} app showing a company's AI agents, each with its team, its risk, what it is doing now and the tools it uses.`}
      className={cn("bg-window text-foreground ring-foreground/10 shadow-float flex overflow-hidden rounded-[28px] text-left ring-1", className)}
    >
      <aside className="border-border hidden w-[250px] shrink-0 border-r p-5 md:block">
        <div className="flex items-center gap-2 px-2 pb-6">
          <LogoMark className="size-7" />
          <span className="text-[20px] font-bold tracking-tight">{BRAND}</span>
        </div>
        <ul className="space-y-1">
          {NAV.map(({ label, icon: Icon }, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[16px]",
                i === 0 ? "border-border bg-background text-foreground border font-medium" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 flex-1 p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="text-[28px] font-bold tracking-[-0.02em] md:text-[34px]">Agents</span>
          <Tag tone="bad" className="ml-auto px-2.5 py-1 text-[13px]">
            2 not approved
          </Tag>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span className="border-border text-muted-foreground flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border px-4 text-[16px]">
            <Magnifer className="size-5 shrink-0" />
            <span className="truncate">Search agents</span>
          </span>
          <span className="border-border hidden h-12 items-center gap-2 rounded-full border px-4 text-[16px] sm:flex">
            All teams
            <AltArrowDown className="text-muted-foreground size-4" />
          </span>
          <span className="text-muted-foreground hidden text-[16px] lg:block">42 agents</span>
        </div>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
