import { useEffect, useState, useCallback } from "react";
import { notes as defaultNotes } from "@/data/content";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { adminApi, AuthorNoteItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function Notes() {
  const [items, setItems] = useState<any[]>(defaultNotes);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(() => {
    adminApi
      .getNotes(true)
      .then((data: AuthorNoteItem[]) => {
        if (data && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {
        // Fallback to static mock notes
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useRealtimeSync(["notes", "all"], () => {
    loadNotes();
  });

  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Profile Essays & Reflections
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Author Notes & Essays
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Personal essays, ecosystem observations, and reflections written by Zahira Shaik.
        </p>
      </section>

      <section className="container max-w-4xl space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-3 animate-pulse">
                <div className="h-4 bg-muted w-24 rounded" />
                <div className="h-6 bg-muted w-2/3 rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          items.map((n) => (
            <article
              key={n.id || n.slug || n.title}
              className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-3 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block">
                {n.date}
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {n.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {n.excerpt}
              </p>
              {n.content && (
                <div className="text-sm text-foreground/80 pt-2 border-t border-border/40 mt-3 leading-relaxed">
                  {n.content}
                </div>
              )}
              <div className="pt-2">
                <span className="text-xs font-semibold text-primary">Written by Zahira Shaik</span>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="container max-w-4xl">
        <NewsletterSubscribe />
      </section>
    </div>
  );
}
