import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { interviews as defaultInterviews } from "@/data/content";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { adminApi, EntrepreneurLessonItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function Interviews() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = useCallback(() => {
    adminApi
      .getLessons(true)
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((d: EntrepreneurLessonItem, idx: number) => ({
            slug: d.slug || `lesson-${d.id}`,
            name: d.name,
            title: d.title,
            excerpt: d.excerpt,
            image: d.image_url || defaultInterviews[idx % defaultInterviews.length]?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            category: d.category,
            date: d.date,
            readTime: d.read_time,
          }));
          setItems(formatted);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  useRealtimeSync(["lessons", "all"], () => {
    loadLessons();
  });


  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary block mb-2">
          Entrepreneur Lessons
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-foreground">
          Founders, Unfiltered
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Tactical conversations and unvarnished stories from the people building what comes next.
        </p>
      </section>

      <section className="container">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-border bg-card rounded-md p-6 animate-pulse space-y-4">
                <div className="h-48 bg-muted rounded" />
                <div className="h-4 bg-muted w-1/3 rounded" />
                <div className="h-6 bg-muted w-3/4 rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <ComingSoonCard
            sectionName="Entrepreneur Lessons"
            badge="Founders, Unfiltered"
            title="Coming Soon, Stay Tuned!"
            description="We are recording unvarnished tactical frameworks and deep conversations with visionary builders. As soon as lessons are published via the Admin Dashboard, they will go live right here."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <article
                key={p.slug}
                className="glass-card rounded-2xl border border-white/60 dark:border-white/10 overflow-hidden flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-muted/40 overflow-hidden relative border-b border-white/40 dark:border-white/10 group">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 glass-pill text-foreground text-xs font-semibold rounded-full border border-white/50 dark:border-white/10 backdrop-blur-md">
                    {p.category}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1">
                  <div className="text-xs text-muted-foreground">
                    {p.name} • {p.date} • {p.readTime}
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                    <Link to={`/interviews/${p.slug}`} className="hover:text-primary transition-colors">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {p.excerpt}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-white/30 dark:border-white/10 mt-auto flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">By Zahira Shaik</span>
                  <Link
                    to={`/interviews/${p.slug}`}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Read Lesson</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="container max-w-4xl">
        <NewsletterSubscribe />
      </section>
    </div>
  );
}
