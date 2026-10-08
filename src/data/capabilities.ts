import {
  History,
  Key,
  Radar,
  ShieldCheck,
  ShieldWarning,
  WalletMoney,
  type IconComponent,
} from "@/components/ui/solar-icons";
import type { Point } from "@/components/ui/blocks";

/*
  The six things Aevrinlabs does, in one place. The navbar, the home page,
  the product page and the footer all read from here, so a name or a line
  never says one thing in one place and another somewhere else.
*/

export type CapabilityId = "inventory" | "risk" | "access" | "guardrails" | "audit" | "spend";

export type Capability = {
  id: CapabilityId;
  name: string;
  // One line, for the menu.
  blurb: string;
  icon: IconComponent;
  group: "See" | "Control" | "Prove";
  // The home page section.
  title: string;
  lead: string;
  points: readonly Point[];
  // The product page.
  summary: string;
  ticks: readonly string[];
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "inventory",
    name: "Agent inventory",
    blurb: "Every agent, MCP server and skill in one list",
    icon: Radar,
    group: "See",
    title: "See every agent at work.",
    lead: "Aevrinlabs finds every AI agent, MCP server and skill in use across your company. That includes the ones nobody said yes to.",
    points: [
      {
        title: "Agents, plugs and skills",
        text: "An MCP server is a plug that lets an agent use another app. A skill is a new trick an agent can learn. You see them all.",
      },
      { title: "Who owns what", text: "Each one shows the team it belongs to." },
      { title: "Spot the strangers", text: "Anything nobody approved stands out, so you can deal with it first." },
    ],
    summary:
      "One list of every AI agent, MCP server and skill in use across your company. The ones nobody approved are easy to spot.",
    ticks: ["Agents, MCP servers and skills in one place", "The team each one belongs to", "Ones nobody approved, marked"],
  },
  {
    id: "risk",
    name: "Risk scores",
    blurb: "A risk score before any work starts",
    icon: ShieldWarning,
    group: "See",
    title: "Know the risk before the work starts.",
    lead: "Each agent, MCP server and skill gets a risk score before it does anything. Risky ones can wait for a person to check.",
    points: [
      { title: "A score with reasons", text: "You see the score and why, in plain words." },
      { title: "Checked first", text: "The score comes before the first task, not after something goes wrong." },
      { title: "Hold for review", text: "Pause anything risky until someone on your team says yes." },
    ],
    summary: "Every agent, MCP server and skill gets a risk score before it does any work. You see the score and the reasons for it.",
    ticks: ["A score before the first task", "The reasons, in plain words", "Risky ones wait for a person"],
  },
  {
    id: "access",
    name: "Identities and access",
    blurb: "Which login each agent uses, and for what",
    icon: Key,
    group: "Control",
    title: "Give each agent the right keys.",
    lead: "See which login each agent uses and what it uses it for. Then turn its access up or down, one agent at a time.",
    points: [
      { title: "Whose login is it?", text: "Spot agents that work under a person's own account." },
      { title: "Turn access up or down", text: "Go from full access to ask first, for each agent." },
      {
        title: "Private apps, opened with care",
        text: "Let agents into internal apps that used to be off limits, with only the access they need.",
      },
    ],
    summary:
      "See which login each agent uses and what it uses it for. Turn each agent's access up or down, even for private apps that used to be off limits.",
    ticks: ["Agents using a person's login, found", "Access set for each agent", "Private internal apps, opened with care"],
  },
  {
    id: "guardrails",
    name: "Live guardrails",
    blurb: "Stop agents before they go too far",
    icon: ShieldCheck,
    group: "Control",
    title: "Stop a bad move while it happens.",
    lead: "Aevrinlabs sits where the work happens. It sees each step an agent takes, as it takes it, and stops the ones that go out of bounds.",
    points: [
      { title: "Live, not later", text: "You see each step as it happens, not in a report next week." },
      { title: "Stopped with a reason", text: "Every stop comes with one line that says why." },
      { title: "Your lines", text: "Agents stay inside the edges your company sets." },
    ],
    summary:
      "Aevrinlabs sits where the work happens, in chat apps and code editors. It sees each move an agent makes as it makes it, and stops it before it goes too far.",
    ticks: ["In chat apps and code editors", "Each step, as it happens", "Stopped before it goes too far"],
  },
  {
    id: "audit",
    name: "Audit trail",
    blurb: "Every AI action in one record",
    icon: History,
    group: "Prove",
    title: "Every AI action, in one record.",
    lead: "Each thing an agent does is written down in one place, for the whole company.",
    points: [],
    summary: "Every AI action across your company is kept in one place. Look back at who did what, when, and how it ended.",
    ticks: ["Every action, from every agent", "Kept in one place", "Who, what and when"],
  },
  {
    id: "spend",
    name: "Usage and spend",
    blurb: "What AI costs, and the right model for each task",
    icon: WalletMoney,
    group: "Prove",
    title: "Know what AI costs.",
    lead: "See AI use and cost, team by team, and pick the right model for each task.",
    points: [],
    summary: "See how much AI your company uses and what it costs. Aevrinlabs helps you match the right model to each task.",
    ticks: ["AI use across the company", "Cost, team by team", "The right model for each task"],
  },
];

export const capability = (id: CapabilityId) => CAPABILITIES.find((c) => c.id === id)!;
