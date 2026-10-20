import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { realityDocumentaries as defaultDocumentaries } from "@/data/content";
import { adminApi, RealitySeriesItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function RealityDocumentary() {
  const { slug } = useParams();
  const [seriesList, setSeriesList] = useState<any[]>(defaultDocumentaries);
  const [loading, setLoading] = useState(true);

  const loadSeries = useCallback(() => {
    adminApi
      .getRealitySeries(true)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: RealitySeriesItem) => ({
            slug: item.slug || item.title.toLowerCase().replace(/\s+/g, "-"),
            title: item.title,
            description: item.description,
            tag: item.tag,
            episodes: item.episodes || [],
          }));
          setSeriesList(formatted);
        }
      })
      .catch(() => {
        // Fallback to static mock data
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  useRealtimeSync(["reality_series", "all"], () => {
    loadSeries();
  });

  const documentary = seriesList.find((d) => d.slug === slug) || defaultDocumentaries.find((d) => d.slug === slug);

  if (loading) {
    return (
      <div className="container py-24 text-center max-w-xl space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-10 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!documentary) {
    return (
      <div className="container py-24 text-center max-w-xl space-y-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Documentary Not Found</h1>
        <p className="text-sm text-muted-foreground">The documentary series you requested could not be located.</p>
        <Link to="/reality-of-startups" className="text-sm font-semibold text-primary hover:underline block pt-2">
          ← Return to The Reality of Startups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <Link to="/reality-of-startups" className="text-xs text-muted-foreground hover:text-foreground font-medium block mb-4 transition-colors">
          ← Back to Reality of Startups
        </Link>
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          {documentary.tag} Series
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          {documentary.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {documentary.description}
        </p>
      </section>

      <section className="container max-w-4xl">
        {(!documentary.episodes || documentary.episodes.length === 0) ? (
          <p className="text-sm text-muted-foreground italic">Episodes coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {documentary.episodes.map((episode: any, idx: number) => (
              <article
                key={episode.id || episode.title || idx}
                className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      Episode {episode.episode_number || idx + 1}
                    </span>
                    <span>{episode.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                    {episode.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {episode.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Documentary Overview</span>
                  {episode.video_url && (
                    <a
                      href={episode.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Watch Episode →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
