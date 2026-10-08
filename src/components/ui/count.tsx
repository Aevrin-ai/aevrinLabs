import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/ease";

// A number that counts to its value whenever the value changes, so a looping
// mockup counts up again each time it starts over.
export function Count({ value, duration = 1.1, prefix = "" }: { value: number; duration?: number; prefix?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  // Where the last count left off, so a change mid-count carries on from there.
  const current = useRef(reduce ? value : 0);

  useEffect(() => {
    const controls = animate(current.current, value, {
      duration: reduce ? 0 : duration,
      ease: EASE,
      onUpdate: (v) => {
        current.current = v;
        setShown(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  return (
    <>
      {prefix}
      {shown.toLocaleString("en-US")}
    </>
  );
}
