import React from "react";
import { useReveal } from "@/hooks/useReveal";

export default function Services() {
  useReveal();

  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">

      {/* ── HERO ── */}
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Search Visibility
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Work With Unmasking
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-medium leading-snug">
          Rank, Answer, and Get Discovered Everywhere Your Audience Is Looking.
        </p>
        <div className="mt-6 space-y-4 max-w-3xl">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed reveal">
            Unmasking does not just tell founder stories. We know how to make brands findable, answerable, and visible everywhere their audience is searching.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed reveal">
            Search has changed. Audiences are now asking AI assistants questions, getting answers without clicking links, and finding brands through ChatGPT, Perplexity, and Google AI Overviews before ever visiting a website. Unmasking helps startups and brands show up in all of it.
          </p>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="container max-w-4xl">
        <div className="border-t border-white/40 dark:border-white/10 pt-12 space-y-8">
          <div className="reveal">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary mb-2">
              Our Offering
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              What We Do
            </h2>
          </div>

          {/* Unified service card */}
          <article className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-10 space-y-8 editorial-card reveal backdrop-blur-2xl shadow-xl">
            {/* Service header */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                Full-Scope Modern Search
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                SEO, AEO and GEO
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                We handle the full scope of modern search visibility for your brand. This is not limited to content writing. It covers everything your brand needs to rank, be cited, and get mentioned across search engines and AI platforms.
              </p>
            </div>

            {/* Three pillars */}
            <div className="space-y-6">

              {/* SEO */}
              <div className="glass-panel rounded-2xl border border-white/50 dark:border-white/10 p-6 sm:p-8 space-y-3 shadow-md">
                <h4 className="font-display text-lg font-bold text-foreground">
                  SEO: Search Engine Optimisation
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Keyword research, on-page optimisation, technical SEO audits, internal linking, meta structures, and long-form content strategy. Everything your brand needs to rank consistently on Google and other search engines.
                </p>
              </div>

              {/* AEO */}
              <div className="glass-panel rounded-2xl border border-white/50 dark:border-white/10 p-6 sm:p-8 space-y-3 shadow-md">
                <h4 className="font-display text-lg font-bold text-foreground">
                  AEO: Answer Engine Optimisation
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Structuring and optimising your brand's content and web presence so that AI answer engines like ChatGPT, Perplexity, and Google SGE pull from your brand when generating answers to your audience's questions.
                </p>
              </div>

              {/* GEO */}
              <div className="glass-panel rounded-2xl border border-white/50 dark:border-white/10 p-6 sm:p-8 space-y-3 shadow-md">
                <h4 className="font-display text-lg font-bold text-foreground">
                  GEO: Generative Engine Optimisation
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Making your brand part of the conversation inside AI-generated responses. When someone asks an AI assistant about your industry, your niche, or your product category, we work to ensure your brand is mentioned, cited, and positioned as a credible source.
                </p>
              </div>
            </div>

            {/* Closing line */}
            <p className="text-base font-semibold text-foreground border-t border-white/30 dark:border-white/10 pt-6">
              One strategy. Full coverage. Everywhere your audience is searching, you are there.
            </p>
          </article>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="container max-w-4xl">
        <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-10 space-y-4 reveal backdrop-blur-2xl shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary mb-2">
              Ideal Partners
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Who We Work With
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Startups, D2C brands, SaaS companies, tech founders, and businesses that understand search visibility is a long-term asset and not a one-time task.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container max-w-4xl">
        <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-12 text-center space-y-6 reveal backdrop-blur-2xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
            Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Ready to make your brand visible everywhere?
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:info@unmasking.com"
              id="services-email-cta"
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all focus-visible:ring-2 focus-visible:ring-primary btn-action"
            >
              info@unmasking.com
            </a>
            <a
              href="https://www.linkedin.com/company/unmasking-entrepreneurs/"
              id="services-linkedin-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on LinkedIn"
              className="px-6 py-3 border border-white/60 dark:border-white/15 bg-white/40 dark:bg-white/5 backdrop-blur-md text-foreground text-sm font-semibold rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-primary shadow-sm btn-action"
            >
              LinkedIn ↗
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            We respond within 2 business days.
          </p>
        </div>
      </section>

    </div>
  );
}

