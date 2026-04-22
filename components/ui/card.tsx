import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/25 bg-white/70 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60",
        className,
      )}
      {...props}
    />
  );
}
