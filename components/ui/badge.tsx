import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "green" | "yellow" | "red" | "gray";
}

export function Badge({ className, tone = "gray", ...props }: BadgeProps) {
  const toneClass = {
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    yellow: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    gray: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
  }[tone];

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClass, className)}
      {...props}
    />
  );
}
