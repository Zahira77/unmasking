import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "glass";
  isSuccess?: boolean;
  successText?: string;
}

export function AnimatedButton({
  children,
  variant = "primary",
  isSuccess = false,
  successText = "Success!",
  className,
  onClick,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    if (onClick) onClick(e);
  };

  const baseStyles =
    "btn-action inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50 select-none transition-all duration-200";

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 border border-primary/30",
    secondary: "bg-white/40 dark:bg-white/10 backdrop-blur-md text-foreground border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/15 shadow-sm",
    outline: "border border-white/60 dark:border-white/15 bg-white/30 dark:bg-white/5 backdrop-blur-md text-foreground hover:bg-white/50 dark:hover:bg-white/10 shadow-sm",
    glass: "glass-btn text-foreground",
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        clicked && "scale-[0.96]",
        isSuccess && "bg-emerald-600 text-white hover:bg-emerald-600 shadow-emerald-500/20",
        className
      )}
    >
      {isSuccess ? (
        <span className="inline-flex items-center gap-1.5 animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

