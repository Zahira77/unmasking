import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { SUBSTACK_URL } from "@/data/links";
import { useReveal } from "@/hooks/useReveal";
import { StaggeredHeading } from "@/components/StaggeredHeading";
import { SlidingTabs } from "@/components/SlidingTabs";
import { AnimatedButton } from "@/components/AnimatedButton";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { adminApi, HomeReaderItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const readerTabs = [
  { id: 0, label: "Startup News" },
  { id: 1, label: "Entrepreneurship Fact" },
  { id: 2, label: "Latest Update" },
];

const defaultReaderContent = [
  {
    tag: "Startup News",
    date: "Sep 2026",
    title: "India's Startup Ecosystem Crosses 1.4 Lakh Registered Startups",
    body: "The Department for Promotion of Industry and Internal Trade (DPIIT) confirmed that India now has over 1.4 lakh DPIIT-recognised startups, making it the third-largest startup ecosystem globally. Tier-2 and Tier-3 cities are driving the next wave of growth.",
    source: "DPIIT Annual Report, 2026",
    label: "Covered by Unmasking",
  },
  {
    tag: "Entrepreneurship Fact",
    date: "2025 Data",
    title: "72% of Founders Report Serious Mental Health Challenges",
    body: "A landmark study found that nearly three in four startup founders experience depression, anxiety, or burnout at some point in their journey. The isolation of building remains the industry's loudest open secret.",
    source: "UCSF Founder Mental Health Study",
    label: "Fact verified by Unmasking",
  },
  {
    tag: "Latest Update",
    date: "Sep 27, 2026",
    title: "Unmasking Launches SEO, AEO and GEO Services for Startups",
    body: "Unmasking is now working directly with startups, D2C brands, and SaaS companies to deliver full-scope modern search visibility. This covers traditional SEO, AI answer engine optimisation, and generative engine positioning.",
    source: "Unmasking Editorial Team",
    label: "From Unmasking",
  },
];

export default function Home() {
  useReveal();
  const [selectedTabId, setSelectedTabId] = useState<number>(0);
  const [readerContent, setReaderContent] = useState<any[]>(defaultReaderContent);

  const loadReader = useCallback(() => {
    adminApi
      .getHomeReader(true)
      .then((data: HomeReaderItem[]) => {
        if (data && data.length > 0) {
          // Map tab_id to reader content slots
          const newContent = [...defaultReaderContent];
          data.forEach((item) => {
            if (item.tab_id >= 0 && item.tab_id < 3) {
              newContent[item.tab_id] = {
                tag: item.tag,
                date: item.date,
                title: item.title,
                body: item.body,
                source: item.source || "Unmasking Editorial",
                label: item.label || "Live from Unmasking",
              };
            }
          });
          setReaderContent(newContent);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  useEffect(() => {
    loadReader();
  }, [loadReader]);

  useRealtimeSync(["home_reader", "all"], () => {
    loadReader();
  });

  const active = readerContent[selectedTabId] ?? readerContent[0];

  return (
    <div className="space-y-20 sm:space-y-28 pt-8 pb-16">

      <section className="container pt-8 sm:pt-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block text-xs uppercase tracking-wider font-semibold text-primary">
              Independent Founder Journalism
            </span>
            <StaggeredHeading
              lines={["Unmasking Real Founder", "Journeys and Hard Truths"]}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground"
            />
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Direct conversations, tactical frameworks, and unvarnished stories from builders shaping modern technology and business.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link to="/interviews">
                <AnimatedButton variant="primary">Read Entrepreneur Lessons</AnimatedButton>
              </Link>
              <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
                <AnimatedButton variant="outline" className="gap-2">
                  <span>Subscribe on Substack</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </AnimatedButton>
              </a>
            </div>
            <div className="pt-4 border-t border-border text-xs text-muted-foreground">
              Updated weekly on Substack with long-form interviews, corporate analysis, and event coverage.
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
              <div className="px-5 py-3.5 border-b border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-semibold text-foreground uppercase tracking-wide">Live Platform Reader</span>
                </div>
                <span className="text-muted-foreground font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/5">[Working Demonstration]</span>
              </div>
              <SlidingTabs
                tabs={readerTabs}
                activeId={selectedTabId}
                onChange={(id) => setSelectedTabId(Number(id))}
              />
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 glass-pill rounded-full text-foreground font-medium">{active.tag}</span>
                  <span>{active.date}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-foreground">{active.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{active.body}</p>
                  <p className="text-xs text-muted-foreground/60">Source: {active.source}</p>
                </div>
                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{active.label}</span>
                  <Link to="/services" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline">
                    <span>Explore More</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="container">
        <div className="border-t border-white/40 dark:border-white/10 pt-12 sm:pt-16">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4 reveal">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Coverage Areas
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground">Editorial Categories &amp; Series</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Beyond 1-on-1 interviews, Unmasking publishes targeted series on corporate dynamics, ecosystem resources, and documentary video footage.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              <div className="reveal editorial-card glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-wider font-semibold text-primary">Column</div>
                <h3 className="font-display text-xl font-bold text-foreground">Corporate Girlie</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Real talk on workplace navigation, career leverage, and maintaining integrity inside large institutions.</p>
                <div className="pt-2"><Link to="/corporate-girlie" className="text-xs font-semibold text-primary hover:underline">View Corporate Articles →</Link></div>
              </div>
              <div className="reveal editorial-card glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-wider font-semibold text-primary">Ecosystem Analysis</div>
                <h3 className="font-display text-xl font-bold text-foreground">Startup Stories</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Unpacking incubators, investor dynamics, and network building for early stage founders.</p>
                <div className="pt-2"><Link to="/startup-stories" className="text-xs font-semibold text-primary hover:underline">Explore Ecosystem Guides →</Link></div>
              </div>
              <div className="reveal editorial-card glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-wider font-semibold text-primary">Video Documentaries</div>
                <h3 className="font-display text-xl font-bold text-foreground">Event Documentaries</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">On-the-ground video and transcript coverage from tech summits, intimate meetups, and panel discussions.</p>
                <div className="pt-2"><Link to="/events" className="text-xs font-semibold text-primary hover:underline">Watch Documentaries →</Link></div>
              </div>
              <div className="reveal editorial-card glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 space-y-3 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-wider font-semibold text-primary">SEO &amp; Content Strategy</div>
                <h3 className="font-display text-xl font-bold text-foreground">Bespoke Writing Services</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">High-conviction, well-researched blog content and editorial strategy for growing brands.</p>
                <div className="pt-2"><Link to="/services" className="text-xs font-semibold text-primary hover:underline">Review Content Services →</Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="subscribe">
        <div className="reveal"><NewsletterSubscribe /></div>
      </section>

    </div>
  );
}

