import { useEffect, useState, useCallback } from "react";
import { startupStories as defaultStories } from "@/data/content";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { adminApi, StartupStoryItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Button } from "@/components/ui/button";

export default function StartupStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<any | null>(null);

  const loadStories = useCallback(() => {
    adminApi
      .getStartupStories(true)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
        } else {
          setStories([]);
        }
      })
      .catch(() => {
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  useRealtimeSync(["startup_stories", "all"], () => {
    loadStories();
  });

  // Helper to parse block-based or string content
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
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-border bg-card rounded-md p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-muted w-1/4 rounded" />
                <div className="h-6 bg-muted w-3/4 rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <ComingSoonCard
            sectionName="Startup Stories & Ecosystem Mapping"
            badge="Ecosystem Intelligence"
            title="Coming Soon, Stay Tuned!"
            description="We are investigating startup accelerator truths, funding bottlenecks, and verified case studies. When stories are published from our admin console, they will appear here directly."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <article
                key={story.id || story.slug || story.title}
                onClick={() => setActiveStory(story)}
                className="glass-card cursor-pointer rounded-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {story.tag}
                    </span>
                    <span>{story.date}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {story.title}
                    </h2>
                    {story.subtitle && (
                      <p className="text-xs text-muted-foreground/80 mt-1 font-medium">
                        {story.subtitle}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {story.excerpt}
                  </p>

                  {story.quote && (
                    <div className="border-l-2 border-primary/60 pl-3 py-1.5 text-xs italic text-foreground/80 bg-primary/5 rounded-r-md">
                      "{story.quote}"
                      {story.quote_by && (
                        <span className="block not-italic text-[11px] text-muted-foreground mt-0.5 font-semibold">
                          — {story.quote_by}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/30 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Category: {story.tag}</span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Full Story</span>
                    <span>→</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* DETAIL MODAL FOR READING FULL STARTUP STORY */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {activeStory.tag}
                </span>
                <span>•</span>
                <span>{activeStory.date}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {activeStory.title}
              </h1>
              {activeStory.subtitle && (
                <p className="text-base text-muted-foreground font-medium">
                  {activeStory.subtitle}
                </p>
              )}
            </div>

            {activeStory.quote && (
              <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 text-base italic text-foreground/90 bg-muted/30 rounded-r-xl">
                "{activeStory.quote}"
                {activeStory.quote_by && (
                  <cite className="block not-italic text-xs font-semibold text-primary mt-1">
                    — {activeStory.quote_by}
                  </cite>
                )}
              </blockquote>
            )}

            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeStory.excerpt}
            </div>

            {activeStory.content && (
              <div className="pt-4 border-t border-border">
                {renderContent(activeStory.content)}
              </div>
            )}

            <div className="pt-6 border-t border-border flex justify-end">
              <Button onClick={() => setActiveStory(null)} variant="outline">
                Close Story
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
