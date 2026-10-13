import { useEffect, useState, useCallback } from "react";
import { startupStories as defaultStories } from "@/data/content";
import { adminApi } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function StartupStories() {
  const [stories, setStories] = useState<any[]>(defaultStories);
  const [loading, setLoading] = useState(true);

  const loadStories = useCallback(() => {
    adminApi
      .getStartupStories(true)
      .then((data) => {
        if (data && data.length > 0) {
          setStories(data);
        }
      })
      .catch(() => {
        // Fallback to static mock data
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  useRealtimeSync(["startup_stories", "all"], () => {
    loadStories();
  });


  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Ecosystem Guides
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Startup Stories & Ecosystem Mapping
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Understanding accelerators, investor maps, and network dynamics before you build.
        </p>
      </section>

      <section className="container">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-border bg-card rounded-md p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-muted w-1/4 rounded" />
                <div className="h-6 bg-muted w-3/4 rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <article
                key={story.id || story.title}
                className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {story.tag}
                    </span>
                    <span>{story.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                    {story.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Category: {story.tag}</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <span>Editorial Guide</span>
                    <span>→</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
