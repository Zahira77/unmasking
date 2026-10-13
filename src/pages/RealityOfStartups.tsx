import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { realityDocumentaries as defaultDocumentaries } from "@/data/content";
import { adminApi, RealitySeriesItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function RealityOfStartups() {
  const [seriesList, setSeriesList] = useState<any[]>(defaultDocumentaries);
  const [loading, setLoading] = useState(true);

  const loadSeries = useCallback(() => {
    adminApi
      .getRealitySeries(true)
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item: RealitySeriesItem) => ({
            slug: item.slug || item.title.toLowerCase().replace(" ", "-"),
            title: item.title,
            description: item.description,
            tag: item.tag,
            episodes: item.episodes || [],
          }));
          setSeriesList(formatted);
        }
      })
      .catch(() => {
        // Fallback to default mock data
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  useRealtimeSync(["reality_series", "all"], () => {
    loadSeries();
  });


  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Documentary Series
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          The Reality of Startups
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Documentaries on founder obstacles and resilience, written as real stories unfold.
        </p>
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
            {seriesList.map((doc) => (
              <div
                key={doc.slug}
                className="border border-border bg-card rounded-md p-6 sm:p-8 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider">{doc.tag}</span>
                    <span>{doc.episodes?.length || 0} episodes</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {doc.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Documentary Series</span>
                  <Link
                    to={`/reality-of-startups/${doc.slug}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    View Episodes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
