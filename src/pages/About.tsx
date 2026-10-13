import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      {/* HERO SECTION */}
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Origin & Motive
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Why Unmasking Was Built
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Building a startup requires constructing a complete ecosystem around a vision: aligning people, culture, capital, and market realities.
        </p>
      </section>

      {/* MOTIVE SECTIONS */}
      <section className="container max-w-4xl space-y-8">
        <article className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-10 space-y-4 backdrop-blur-2xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
            01. Beyond Product Execution
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Building a startup is building a whole ecosystem
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Having spent more than a year inside the startup ecosystem, I went through a transformative journey. Building a startup is far more than writing code or executing a product roadmap. It requires creating a complete ecosystem: assembling a resilient team, instilling conviction into an idea, and aligning people, culture, and market realities.
          </p>
        </article>

        <article className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-10 space-y-4 backdrop-blur-2xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
            02. Uncovering Realities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            The unspoken truth behind the ecosystem
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Public narratives surrounding startups are often sanitized for social media: focused strictly on funding press releases and rapid growth graphs. Behind every team and product being built lies a deeper reality: co-founder dynamics, cash flow pressures, market pivots, and the quiet determination required to keep an ecosystem alive.
          </p>
        </article>

        <article className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-10 space-y-4 backdrop-blur-2xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
            03. Our Mission
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Publishing the truth behind modern venture ecosystems
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Unmasking exists to pull back the curtain. Through long-form interviews, deep profile notes, and documentary-style explorations, we publish the ground reality of modern ecosystems. We write for builders, operators, and thinkers who value authenticity and depth over noise.
          </p>
        </article>
      </section>

      {/* CORE GUIDING PRINCIPLES */}
      <section className="container max-w-4xl">
        <div className="border-t border-white/40 dark:border-white/10 pt-12">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-1">
              Guiding Principles
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground">
              What Guides Unmasking
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl shadow-md">
              <h3 className="font-display text-lg font-bold text-foreground">Ecosystem View</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Looking past isolated features to understand the complete ecosystem of people, product, and market.
              </p>
            </div>

            <div className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl shadow-md">
              <h3 className="font-display text-lg font-bold text-foreground">Unfiltered Truth</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Asking the questions that founders usually reserve for closed rooms and off-the-record chats.
              </p>
            </div>

            <div className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl shadow-md">
              <h3 className="font-display text-lg font-bold text-foreground">Builder Focus</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Delivering actionable insights and hard-won lessons that serve early-stage builders.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CALL TO ACTION */}
      <section className="container max-w-4xl">
        <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-8 sm:p-12 text-center space-y-6 backdrop-blur-2xl shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-wider font-semibold text-primary">
            Connect with the Community
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Follow the stories shaping tomorrow's ecosystems
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Explore our entrepreneur lessons, startup documentaries, and notes on building in public.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/interviews"
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all focus-visible:ring-2 focus-visible:ring-primary"
            >
              Read Entrepreneur Lessons
            </Link>
            <Link
              to="/startup-stories"
              className="px-6 py-3 border border-white/60 dark:border-white/15 bg-white/40 dark:bg-white/5 backdrop-blur-md text-foreground text-sm font-semibold rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            >
              View Startup Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

