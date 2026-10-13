import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string | number;
  label: string;
}

interface SlidingTabsProps {
  tabs: TabItem[];
  activeId: string | number;
  onChange: (id: any) => void;
  className?: string;
}

export function SlidingTabs({ tabs, activeId, onChange, className }: SlidingTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeId}"]`
    );
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeId, tabs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center border-b border-border bg-muted/20 overflow-x-auto text-xs no-scrollbar",
        className
      )}
    >
      {/* Sliding Highlight Indicator */}
      <div
        className="tab-sliding-indicator absolute bottom-0 h-0.5 bg-primary rounded-t"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-3 font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
            activeId === tab.id
              ? "text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
