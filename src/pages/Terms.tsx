import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="container pt-24 pb-16 max-w-4xl">
      <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-12 space-y-8 backdrop-blur-2xl shadow-xl">
        <div className="border-b border-white/30 dark:border-white/10 pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider text-primary font-semibold">
            Legal Documentation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">1. Platform Overview</h2>
            <p>
              Unmasking provides independent journalism, founder stories, editorial essays, and content writing services. By accessing or using our platform at unmasking.co or related services, you agree to these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">2. Editorial Content and Intellectual Property</h2>
            <p>
              All original articles, interviews, audio transcripts, event documentaries, and brand materials published on Unmasking are owned by Unmasking and Zahira Shaik unless explicitly stated otherwise.
            </p>
            <p>
              You may quote or share excerpts of our published content for non-commercial editorial commentary provided you include explicit attribution and a direct link back to the original article on Unmasking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">3. Newsletter and User Submissions</h2>
            <p>
              When registering for newsletter updates or applying for founder interviews, you agree to provide truthful and accurate information. We reserve the right to decline submission requests that do not align with our editorial standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">4. Professional Services Agreements</h2>
            <p>
              Bespoke content strategy, SEO blog writing, and advisory services requested through Unmasking are governed by separate, formal client service agreements detailing deliverables, payment schedules, and licensing terms.
            </p>
          </section>

          <div className="p-5 border border-white/40 dark:border-white/10 glass-panel rounded-2xl text-xs sm:text-sm text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground">[Draft for Review]</span>
            <p>
              Specific governing jurisdiction, formal dispute resolution procedures, and corporate registration numbers are currently drafted for formal legal counsel review prior to commercial launch.
            </p>
          </div>

          <div className="pt-6 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-sm">
            <Link to="/" className="text-primary font-semibold hover:underline">
              ← Return to Home
            </Link>
            <Link to="/privacy" className="text-primary font-semibold hover:underline">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

