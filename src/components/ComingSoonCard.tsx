import { SUBSTACK_URL } from "@/data/links";
import { AnimatedButton } from "./AnimatedButton";
import { Sparkles, Bell, ArrowRight, Clock } from "lucide-react";

interface ComingSoonCardProps {
  sectionName: string;
  badge?: string;
  title?: string;
  description: string;
}

export function ComingSoonCard({
  sectionName,
  badge = "Editorial In Production",
  title = "Coming Soon, Stay Tuned!",
  description,
}: ComingSoonCardProps) {
  return (
    <div className="relative glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-2xl backdrop-blur-2xl overflow-hidden my-6">
      {/* Ambient background glow accents */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary uppercase tracking-wider backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{badge}</span>
        </div>

        {/* Section Headline & Main Coming Soon Callout */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {sectionName}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed pt-1">
            {description}
          </p>
        </div>

        {/* Highlights / Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-2xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-card/60 border border-white/40 dark:border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unfiltered</span>
            </div>
            <p className="text-xs text-muted-foreground">Raw, candid insights without PR spin or corporate polish.</p>
          </div>
          <div className="p-4 rounded-xl bg-card/60 border border-white/40 dark:border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Direct Sync</span>
            </div>
            <p className="text-xs text-muted-foreground">Directly updated in real-time as soon as new items are published.</p>
          </div>
          <div className="p-4 rounded-xl bg-card/60 border border-white/40 dark:border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Substack Alert</span>
            </div>
            <p className="text-xs text-muted-foreground">Receive instant notifications in your inbox when dispatches drop.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <AnimatedButton variant="primary" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
              <Bell className="w-4 h-4" />
              <span>Get Notified on Substack</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </AnimatedButton>
          </a>
        </div>

        <p className="text-xs text-muted-foreground/80 pt-2 font-mono">
          ⚡ Live Content Pipeline Active • Publishing updates through Admin will appear here directly.
        </p>
      </div>
    </div>
  );
}
