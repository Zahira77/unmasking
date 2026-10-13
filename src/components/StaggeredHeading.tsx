import React from "react";
import { cn } from "@/lib/utils";

interface StaggeredHeadingProps {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delayOffsetMs?: number;
}

export function StaggeredHeading({
  lines,
  as: Component = "h1",
  className,
  delayOffsetMs = 0,
}: StaggeredHeadingProps) {
  return (
    <Component className={cn("inline-flex flex-col gap-1", className)}>
      {lines.map((line, index) => {
        const delay = delayOffsetMs + index * 100; // 100ms stagger between each line
        return (
          <span
            key={index}
            className="stagger-item block"
            style={{ animationDelay: `${delay}ms` }}
          >
            {line}
          </span>
        );
      })}
    </Component>
  );
}
