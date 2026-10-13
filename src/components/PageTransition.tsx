import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className={cn("page-transition min-h-[calc(100vh-10rem)]", className)}
    >
      {children}
    </div>
  );
}
