import { CAPABILITIES, type Capability } from "@/data/capabilities";
import { Letter, UsersGroupRounded, type IconComponent } from "@/components/ui/solar-icons";

// The one source for the navbar. The desktop panels and the phone menu both
// read from here, so the two never drift apart.

export type MenuItem = { title: string; description: string; href: string; icon: IconComponent };
export type MenuColumn = { heading: string; items: MenuItem[] };
type Menu = { id: string; label: string; columns: MenuColumn[] };

const toItem = (c: Capability): MenuItem => ({ title: c.name, description: c.blurb, href: `/product#${c.id}`, icon: c.icon });
const group = (heading: Capability["group"]) => ({ heading, items: CAPABILITIES.filter((c) => c.group === heading).map(toItem) });

// Each panel is a few columns side by side, kept to two rows, so it stays
// wide and low. Joining the waitlist and talking to us are buttons in the
// bar itself, so they are not repeated here.
export const menus: Menu[] = [
  { id: "product", label: "Product", columns: [group("See"), group("Control"), group("Prove")] },
  {
    id: "company",
    label: "Company",
    columns: [
      {
        heading: "Company",
        items: [{ title: "About us", description: "Why we are building Aevrinlabs", href: "/about", icon: UsersGroupRounded }],
      },
      {
        heading: "Get in touch",
        items: [{ title: "Contact us", description: "Questions, ideas or working together", href: "/contact", icon: Letter }],
      },
    ],
  },
];
