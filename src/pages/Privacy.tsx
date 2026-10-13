import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container pt-24 pb-16 max-w-4xl">
      <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-12 space-y-8 backdrop-blur-2xl shadow-xl">
        <div className="border-b border-white/30 dark:border-white/10 pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider text-primary font-semibold">
            Legal Documentation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">1. Data We Collect</h2>
            <p>
              We respect reader privacy. Unmasking collects minimal personal information necessary to deliver newsletter updates and manage story subscriptions.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Subscription Data:</strong> Your name and email address when subscribing to newsletters or downloading content guides.</li>
              <li><strong className="text-foreground">Inquiry Data:</strong> Contact details and project specifics provided via service inquiry forms.</li>
              <li><strong className="text-foreground">System Data:</strong> Standard server logs containing anonymous IP addresses and browser types for server reliability.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">2. How We Use Your Data</h2>
            <p>
              Your email address is strictly used to send published founder interviews, editorial essays, and requested platform updates. We do not sell, rent, or trade reader personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">3. Service Providers and Database Storage</h2>
            <p>
              Subscriber registrations are securely stored in our backend database system. Email communications may be processed through configured transactional email providers (e.g., SMTP / FastAPI Mail).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">4. Your Rights and Unsubscribing</h2>
            <p>
              You can request removal of your email from our database at any time by selecting the unsubscribe link in our newsletters or contacting us at info@unmasking.com.
            </p>
          </section>

          <div className="p-5 border border-white/40 dark:border-white/10 glass-panel rounded-2xl text-xs sm:text-sm text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground">[Draft for Review]</span>
            <p>
              Detailed cookie management policy and GDPR/CCPA data controller identification details are prepared as drafts pending final compliance review.
            </p>
          </div>

          <div className="pt-6 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-sm">
            <Link to="/" className="text-primary font-semibold hover:underline">
              ← Return to Home
            </Link>
            <Link to="/terms" className="text-primary font-semibold hover:underline">
              View Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

