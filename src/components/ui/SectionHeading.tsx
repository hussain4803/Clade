import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ index, eyebrow, title, description, action, id, className, as: Tag = "h2" }: Props) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <p className="label-tech flex items-center gap-3 text-apex-blue">
          {index && <span className="text-steel">{index} /</span>}
          <span className="h-px w-8 bg-apex-blue" aria-hidden="true" />
          {eyebrow}
        </p>
        <Tag id={id} className="mt-4 text-display-md font-bold uppercase text-chalk">
          {title}
        </Tag>
        {description && <div className="mt-4 max-w-2xl text-steel">{description}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
