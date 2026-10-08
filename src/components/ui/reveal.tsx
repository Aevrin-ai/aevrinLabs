import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { EASE } from "@/lib/ease";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
  id?: string;
};

// Rises and fades in the first time it scrolls into view. Still for anyone
// who has asked for less motion.
export function Reveal({ children, className, delay = 0, y = 24, as = "div", id }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
