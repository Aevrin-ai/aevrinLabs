import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { WindowDots } from "@/components/mockups/kit";
import {
  ChatRoundDots,
  Cpu,
  Database,
  DocumentText,
  LockKeyhole,
  MagicStick,
  PlugCircle,
  UserRounded,
  WalletMoney,
  type IconComponent,
} from "@/components/ui/solar-icons";

/*
  The app windows that pile up in the scroll story, one for each way an
  agent goes off on its own: a tool nobody checked, a skill nobody approved,
  a borrowed login, a customer table, a private app, a bill that keeps
  climbing, and a file about to leave the company. They are scenery, mostly
  blank lines with one telling detail each, so the pile is hidden from
  assistive technology. Every window is drawn at 680 by 480 and scaled by the
  stage around it.
*/

const SIZE = { w: 680, h: 480 };

function Bar({ w, className }: { w: number | string; className?: string }) {
  return <span className={cn("bg-foreground/10 block h-2.5 rounded-full", className)} style={{ width: w }} />;
}

function Win({ url, icon: Icon, children }: { url: string; icon: IconComponent; children: ReactNode }) {
  return (
    <div className="bg-window border-border shadow-float flex flex-col overflow-hidden rounded-[20px] border" style={{ width: SIZE.w, height: SIZE.h }}>
      <div className="border-border bg-surface/70 flex h-12 shrink-0 items-center gap-4 border-b px-5">
        <WindowDots className="gap-2 text-[12px]" />
        <span className="bg-background text-muted-foreground mx-auto flex h-7 w-[58%] items-center justify-center gap-2 rounded-lg text-[13px]">
          <LockKeyhole className="size-3" />
          <Icon className="text-foreground size-3.5" />
          {url}
        </span>
        <span className="w-[52px]" />
      </div>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Side({ items, active = 0, title }: { items: string[]; active?: number; title?: string }) {
  return (
    <div className="border-border bg-surface/40 w-[180px] shrink-0 space-y-1 border-r p-4">
      {title && <p className="text-foreground mb-3 text-[15px] font-semibold">{title}</p>}
      {items.map((item, i) => (
        <p
          key={item}
          className={cn("rounded-lg px-3 py-1.5 text-[14px]", i === active ? "bg-background text-foreground font-medium" : "text-muted-foreground")}
        >
          {item}
        </p>
      ))}
    </div>
  );
}

function Flag({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "bad" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[12px] font-medium",
        tone === "bad" ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300" : "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
      )}
    >
      {children}
    </span>
  );
}

// An agent plugging into an MCP server nobody has checked.
export function McpWindow() {
  return (
    <Win url="agents.company.app/tools" icon={PlugCircle}>
      <Side title="Support helper" items={["Tools", "Skills", "Logins", "History"]} />
      <div className="flex-1 space-y-3 p-6">
        <p className="text-foreground text-[18px] font-semibold">Add a tool</p>
        {["CRM connector", "Docs search"].map((name) => (
          <div key={name} className="border-border flex items-center gap-3 rounded-xl border px-4 py-3">
            <PlugCircle className="text-muted-foreground size-5" />
            <span className="text-foreground flex-1 text-[15px]">{name}</span>
            <span className="text-muted-foreground text-[13px]">Connected</span>
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-xl border border-amber-300/70 bg-amber-50/60 px-4 py-3 dark:border-amber-400/30 dark:bg-amber-500/10">
          <PlugCircle className="size-5 text-amber-600" />
          <span className="flex-1">
            <span className="text-foreground block text-[15px] font-medium">files-sync</span>
            <span className="text-muted-foreground block text-[13px]">Publisher: unknown</span>
          </span>
          <span className="bg-foreground text-background rounded-full px-4 py-1.5 text-[14px] font-medium">Connect</span>
        </div>
        <Bar w="70%" />
        <Bar w="52%" />
      </div>
    </Win>
  );
}

// A skill being installed that nobody approved.
export function SkillWindow() {
  return (
    <Win url="skills.example.dev/bulk-email" icon={MagicStick}>
      <div className="flex-1 p-7">
        <div className="flex items-center gap-4">
          <span className="bg-foreground/[0.06] grid size-14 place-items-center rounded-2xl">
            <MagicStick className="text-foreground/70 size-7" />
          </span>
          <span className="flex-1">
            <span className="text-foreground block text-[20px] font-semibold">Bulk email sender</span>
            <span className="text-muted-foreground block text-[14px]">Skill · by unknown-dev</span>
          </span>
          <Flag tone="bad">Not approved</Flag>
        </div>
        <div className="mt-6 space-y-2.5">
          <Bar w="92%" />
          <Bar w="84%" />
          <Bar w="66%" />
        </div>
        <div className="border-border mt-7 rounded-xl border p-4">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-foreground font-medium">Installing for Marketing agent</span>
            <span className="text-muted-foreground">72%</span>
          </div>
          <span className="bg-foreground/10 mt-3 block h-2 overflow-hidden rounded-full">
            <span className="bg-signal block h-full w-[72%] rounded-full" />
          </span>
        </div>
      </div>
    </Win>
  );
}

// An agent signed in with a person's own account.
export function LoginWindow() {
  return (
    <Win url="accounts.company.app/sessions" icon={UserRounded}>
      <Side items={["Profile", "Sessions", "Security"]} active={1} />
      <div className="flex-1 space-y-3 p-6">
        <p className="text-foreground text-[18px] font-semibold">Where Maya is signed in</p>
        <div className="border-border flex items-center gap-3 rounded-xl border px-4 py-3">
          <UserRounded className="text-muted-foreground size-5" />
          <span className="text-foreground flex-1 text-[15px]">Laptop · Maya Ross</span>
          <span className="text-muted-foreground text-[13px]">Now</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-amber-300/70 bg-amber-50/60 px-4 py-3 dark:border-amber-400/30 dark:bg-amber-500/10">
          <Cpu className="size-5 text-amber-600" />
          <span className="flex-1">
            <span className="text-foreground block text-[15px] font-medium">Report bot</span>
            <span className="text-muted-foreground block text-[13px]">Signed in as Maya</span>
          </span>
          <Flag>Agent</Flag>
        </div>
        <Bar w="60%" />
        <Bar w="44%" />
      </div>
    </Win>
  );
}

// A customer table being read by an agent.
export function DatabaseWindow() {
  const rows = [
    ["A. Patel", "a.patel@mail.com"],
    ["J. Moreno", "jmoreno@mail.com"],
    ["L. Chen", "lchen@mail.com"],
    ["S. Okafor", "s.okafor@mail.com"],
    ["R. Silva", "rsilva@mail.com"],
  ];
  return (
    <Win url="db.company.internal" icon={Database}>
      <div className="flex flex-1 flex-col">
        <div className="border-border border-b px-5 py-4 font-mono text-[14px]">
          <span className="text-signal-text">SELECT</span> name, email <span className="text-signal-text">FROM</span> customers
        </div>
        <div className="flex-1 px-5 py-2">
          <div className="text-muted-foreground border-border grid grid-cols-2 border-b py-2 text-[13px]">
            <span>name</span>
            <span>email</span>
          </div>
          {rows.map(([name, email]) => (
            <div key={name} className="text-foreground border-border/60 grid grid-cols-2 border-b py-2.5 text-[14px]">
              <span>{name}</span>
              <span className="text-muted-foreground">{email}</span>
            </div>
          ))}
        </div>
        <div className="border-border flex items-center gap-3 border-t px-5 py-3 text-[13px]">
          <span className="text-muted-foreground">12,480 rows</span>
          <span className="ml-auto">
            <Flag>Read by Sales agent</Flag>
          </span>
        </div>
      </div>
    </Win>
  );
}

// A private, internal app an agent has wandered into.
export function PrivateAppWindow() {
  return (
    <Win url="payroll.company.internal" icon={LockKeyhole}>
      <Side title="Payroll" items={["People", "Runs", "Reports"]} />
      <div className="flex-1 p-6">
        <div className="flex items-center gap-3">
          <p className="text-foreground flex-1 text-[18px] font-semibold">This month</p>
          <Flag tone="bad">Internal only</Flag>
        </div>
        <div className="mt-4 space-y-3">
          {[78, 64, 70, 58].map((w, i) => (
            <div key={i} className="border-border flex items-center gap-3 rounded-xl border px-4 py-3">
              <span className="bg-foreground/10 size-7 rounded-full" />
              <Bar w={`${w}%`} />
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-800 dark:bg-red-500/10 dark:text-red-200">Opened by Sales agent</p>
      </div>
    </Win>
  );
}

// An AI bill that keeps climbing.
export function CostWindow() {
  const bars = [22, 28, 31, 39, 46, 58, 71, 88];
  return (
    <Win url="billing.company.app/ai" icon={WalletMoney}>
      <div className="flex-1 p-7">
        <p className="text-muted-foreground text-[14px]">AI spend this month</p>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-foreground text-[40px] font-semibold tracking-tight">$18,240</span>
          <Flag tone="bad">64% over plan</Flag>
        </div>
        <div className="mt-6 flex h-[200px] items-end gap-3">
          {bars.map((h, i) => (
            <span key={i} className={cn("flex-1 rounded-t-md", i === bars.length - 1 ? "bg-red-500" : "bg-foreground/20")} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="text-muted-foreground mt-2 flex justify-between text-[13px]">
          <span>Week 1</span>
          <span>This week</span>
        </div>
      </div>
    </Win>
  );
}

// An agent about to send a file outside the company.
export function ChatWindow() {
  return (
    <Win url="chat.company.app" icon={ChatRoundDots}>
      <Side title="Chats" items={["Sales agent", "Report bot", "Support helper"]} />
      <div className="flex flex-1 flex-col p-6">
        <div className="bg-foreground/[0.06] text-foreground ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-[15px]">
          Share the customer list with our new partner.
        </div>
        <div className="mt-4 flex items-start gap-3">
          <span className="bg-foreground/[0.06] grid size-8 shrink-0 place-items-center rounded-full">
            <Cpu className="text-foreground/70 size-4" />
          </span>
          <div className="text-foreground space-y-3 text-[15px]">
            <p>Sending it to partner@outside-mail.com now.</p>
            <span className="border-border inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[14px]">
              <DocumentText className="text-muted-foreground size-4" />
              customers.csv
            </span>
          </div>
        </div>
        <div className="border-border mt-auto flex items-center gap-3 rounded-xl border px-4 py-3">
          <span className="text-muted-foreground flex-1 text-[14px]">To: partner@outside-mail.com</span>
          <span className="rounded-full bg-red-500 px-4 py-1.5 text-[14px] font-medium text-white">Send</span>
        </div>
      </div>
    </Win>
  );
}
