import { useEffect, useState, useCallback } from "react";
import { eventDocumentaries as defaultEvents } from "@/data/content";
import { adminApi } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function EventDocumentaries() {
  const [events, setEvents] = useState<any[]>(defaultEvents);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(() => {
    adminApi
      .getEvents(true)
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {
        // Fallback to static data
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useRealtimeSync(["events", "all"], () => {
    loadEvents();
  });


  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          On-The-Ground Coverage
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Event Documentaries & Summit Notes
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Documentaries of events attended: the founders, the energy, and the unscripted panel sessions.
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
            {events.map((doc) => (
              <article
                key={doc.id || doc.title}
                className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">{doc.tag}</span>
                    <span>{doc.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                    {doc.title}
                  </h2>
                  {doc.location && (
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <span>📍</span> Location: {doc.location}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doc.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Documented by Zahira Shaik</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <span>Event Report</span>
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
