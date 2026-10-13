import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "line" | "image" | "title";
}

export function SkeletonLoader({ className, variant = "line" }: SkeletonProps) {
  if (variant === "card") {
    return (
      <div className="border border-border bg-card rounded-md p-6 space-y-4">
        <div className="skeleton-shimmer h-40 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-1/3 rounded" />
        <div className="skeleton-shimmer h-6 w-3/4 rounded" />
        <div className="skeleton-shimmer h-12 w-full rounded" />
      </div>
    );
  }

  if (variant === "image") {
    return <div className={cn("skeleton-shimmer rounded bg-muted", className)} />;
  }

  if (variant === "title") {
    return <div className={cn("skeleton-shimmer h-8 w-2/3 rounded", className)} />;
  }

  return <div className={cn("skeleton-shimmer h-4 w-full rounded", className)} />;
}
