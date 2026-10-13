import { SUBSTACK_URL } from "@/data/links";
import { AnimatedButton } from "./AnimatedButton";
import { Link } from "react-router-dom";


export function NewsletterSubscribe() {
  return (
    <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xl backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
        Substack Publication
      </span>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
        Subscribe to Corporate Girlie in Startup
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Read unvarnished founder interviews, corporate survival guides, and slow essays published on Substack.
      </p>

      <div className="pt-2 max-w-md mx-auto">
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <AnimatedButton variant="primary" className="w-full shadow-lg shadow-primary/20">
            <span>Subscribe on Substack</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </AnimatedButton>
        </a>
      </div>

      <p className="text-xs text-muted-foreground pt-1">
        Free weekly dispatches. Read our{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
}

