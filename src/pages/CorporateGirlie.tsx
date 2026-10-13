import { useEffect, useState, useCallback } from "react";
import { adminApi, CorporateGirlieItem } from "@/lib/adminContentApi";
import { SUBSTACK_URL } from "@/data/links";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const defaultCorporateGirlies: CorporateGirlieItem[] = [
  {
    id: 1,
    slug: "navigating-office-politics-with-grace",
    title: "Navigating Office Politics Without Losing Yourself",
    author: "Sarah Jenkins",
    excerpt: "Corporate games are real, but you do not have to compromise your integrity to win. Here is the strategic playbook.",
    tag: "Career Growth",
    date: "Jun 01, 2026",
    published: true,
    substack_url: SUBSTACK_URL, // ← replace with exact Substack article URL if specific
  },
  {
    id: 2,
    slug: "the-art-of-saying-no-at-work",
    title: "The Art of Saying No Without Hurting Your Career",
    author: "Elena Rostova",
    excerpt: "Overcommitted and burnt out? How to set clear boundaries with managers and teammates while staying a top performer.",
    tag: "Workplace Culture",
    date: "May 24, 2026",
    published: true,
    substack_url: SUBSTACK_URL, // ← replace with exact Substack article URL if specific
  },
];

export default function CorporateGirlie() {
  const [items, setItems] = useState<CorporateGirlieItem[]>(defaultCorporateGirlies);
  const [loading, setLoading] = useState(true);

  const loadCorporate = useCallback(() => {
    adminApi
      .getCorporateGirlies(true)
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            ...item,
            substack_url: item.substack_url?.trim() || SUBSTACK_URL,
          }));
          setItems(mapped);
        }
      })
      .catch(() => {
        // Fallback to defaultCorporateGirlies
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCorporate();
  }, [loadCorporate]);

  useRealtimeSync(["corporate_girlie", "all"], () => {
    loadCorporate();
  });


  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Column Series
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Corporate Girlie
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Unfiltered stories, strategic advice, and workplace navigation inside modern corporate institutions.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Read on Substack
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="container">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="border border-border bg-card rounded-md p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-muted w-1/4 rounded" />
                <div className="h-6 bg-muted w-3/4 rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((story) => {
              const articleUrl = story.substack_url?.trim() || SUBSTACK_URL;
              return (
                <article
                  key={story.id || story.title}
                  className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">{story.tag}</span>
                      <span>{story.date}</span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors inline-block"
                      >
                        {story.title}
                      </a>
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Author: {story.author}</span>
                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5"
                    >
                      Read on Substack
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}

          </div>
        )}
      </section>
    </div>
  );
}
