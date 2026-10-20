import { useEffect, useState, useCallback } from "react";
import { eventDocumentaries as defaultEvents } from "@/data/content";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { adminApi, EventDocumentaryItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Button } from "@/components/ui/button";

export default function EventDocumentaries() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);

  const loadEvents = useCallback(() => {
    adminApi
      .getEvents(true)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useRealtimeSync(["events", "all"], () => {
    loadEvents();
  });

  const renderContent = (content?: string) => {
    if (!content) return null;
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            {parsed.map((block: any, idx: number) => {
              if (block.type === "text" && block.html) {
                return (
                  <div
                    key={block.id || idx}
                    className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                );
              }
              if (block.type === "image" && block.url) {
                return (
                  <figure key={block.id || idx} className="my-6">
                    <img src={block.url} alt={block.caption || ""} className="w-full rounded-2xl shadow-lg border border-border" />
                    {block.caption && (
                      <figcaption className="text-xs text-center text-muted-foreground mt-2">{block.caption}</figcaption>
                    )}
                  </figure>
                );
              }
              if (block.type === "video" && block.url) {
                return (
                  <figure key={block.id || idx} className="my-6">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-border">
                      <iframe
                        src={block.url.replace("watch?v=", "embed/")}
                        title={block.caption || "Video"}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="text-xs text-center text-muted-foreground mt-2">{block.caption}</figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
          </div>
        );
      }
    } catch {}
    return (
      <div
        className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

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
        ) : events.length === 0 ? (
          <ComingSoonCard
            sectionName="Event Documentaries & Summit Notes"
            badge="Field Coverage"
            title="Coming Soon, Stay Tuned!"
            description="Our on-the-ground team is documenting global tech summits, investor roundtables, and founder showcases. As soon as notes and documentaries are published via Admin, they will appear here directly."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((doc) => (
              <article
                key={doc.id || doc.title}
                onClick={() => setActiveDoc(doc)}
                className="glass-card cursor-pointer rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {doc.tag}
                    </span>
                    <span>{doc.date}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {doc.title}
                    </h2>
                    {doc.subtitle && (
                      <p className="text-xs text-muted-foreground/80 mt-1 font-medium">
                        {doc.subtitle}
                      </p>
                    )}
                  </div>
                  {doc.location && (
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <span>📍</span> Location: {doc.location}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doc.body}
                  </p>
                  {doc.highlights && (
                    <div className="text-xs bg-muted/40 p-2.5 rounded-lg border border-border/60 text-foreground/80">
                      <span className="font-semibold text-primary block mb-1">Key Takeaways:</span>
                      {doc.highlights}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Documented by {doc.author || "Zahira Shaik"}</span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Report</span>
                    <span>→</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* EVENT REPORT DETAIL MODAL */}
      {activeDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveDoc(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {activeDoc.tag}
                </span>
                <span>•</span>
                <span>{activeDoc.date}</span>
                {activeDoc.location && (
                  <>
                    <span>•</span>
                    <span>📍 {activeDoc.location}</span>
                  </>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {activeDoc.title}
              </h1>
              {activeDoc.subtitle && (
                <p className="text-base text-muted-foreground font-medium">
                  {activeDoc.subtitle}
                </p>
              )}
            </div>

            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeDoc.body}
            </div>

            {activeDoc.highlights && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                <span className="font-bold text-primary block mb-1 text-xs uppercase tracking-wider">
                  Highlights & Outcomes
                </span>
                <p className="text-foreground/90">{activeDoc.highlights}</p>
              </div>
            )}

            {activeDoc.content && (
              <div className="pt-4 border-t border-border">
                {renderContent(activeDoc.content)}
              </div>
            )}

            <div className="pt-6 border-t border-border flex justify-end">
              <Button onClick={() => setActiveDoc(null)} variant="outline">
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
