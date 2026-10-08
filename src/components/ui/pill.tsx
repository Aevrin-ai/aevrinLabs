import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

/*
  Every call to action on the site is a pill. `primary` is Signal orange with
  ink text, the one thing on a screen that matters; `ink` is the dark pill;
  `soft` and `outline` are the quiet second choice.
*/
const pillVariants = cva(
  "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,opacity] duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-signal text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.18),0_1px_2px_rgba(18,19,22,0.18),0_6px_16px_-6px_rgba(185,60,12,0.5)] hover:bg-[#ff6d38]",
        ink: "bg-foreground text-background hover:bg-foreground/85",
        soft: "bg-foreground/[0.06] text-foreground hover:bg-foreground/10",
        outline: "border-border bg-window text-foreground hover:bg-muted border",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-12 px-7 text-base md:h-[50px] md:text-[17px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type PillProps = VariantProps<typeof pillVariants> &
  ComponentPropsWithoutRef<"button"> & {
    // A page of this site.
    to?: string;
    // A link off it.
    href?: string;
  };

// A pill that is a button, a page of this site (`to`), or a link off it (`href`).
export function Pill({ variant, size, className, to, href, children, type = "button", ...props }: PillProps) {
  const classes = cn(pillVariants({ variant, size }), className);
  const { onClick, ...rest } = props;
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick as never} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick as never} aria-label={rest["aria-label"]}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
