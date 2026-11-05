import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "secondary" | "blue" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-display font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-apex-orange text-carbon hover:bg-[#ff8124] hover:shadow-[0_0_0_1px_var(--avr-orange),0_10px_30px_-10px_rgb(255_107_0/0.7)]",
  blue: "bg-apex-blue text-carbon hover:bg-[#33b5ff] hover:shadow-[0_10px_30px_-10px_rgb(0_163_255/0.7)]",
  secondary:
    "border border-line-strong bg-carbon/40 text-chalk backdrop-blur hover:border-chalk hover:bg-chalk hover:text-carbon",
  ghost: "text-chalk hover:text-apex-blue",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-[0.72rem]",
  md: "min-h-12 px-6 text-[0.8rem]",
  lg: "min-h-14 px-7 text-[0.85rem] sm:px-8",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], variant === "ghost" && "min-h-11 px-1 text-[0.78rem]", "rounded-[2px]", className);
}

function Arrow() {
  return <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />;
}

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant, size, className, arrow = true, children, ...props }: LinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; arrow?: boolean };

export function Button({ variant, size, className, arrow = false, children, type = "button", ...props }: BtnProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      <span className="inline-flex items-center gap-2.5">{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
