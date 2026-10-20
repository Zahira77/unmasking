import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { interviews as defaultInterviews } from "@/data/content";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { adminApi, EntrepreneurLessonItem } from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function InterviewDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(() => {
    if (!slug) return;
    adminApi
      .getLessonBySlug(slug)
      .then((data: EntrepreneurLessonItem) => {
        if (data) {
          const fallbackImg = defaultInterviews.find((d) => d.slug === slug)?.image || defaultInterviews[0]?.image;
          setPost({
            slug: data.slug || slug,
            name: data.name,
            title: data.title,
            subtitle: data.subtitle,
            excerpt: data.excerpt,
            content: data.content,
            quote: data.quote,
            quote_by: data.quote_by,
            image: data.image_url || fallbackImg,
            category: data.category,
            date: data.date,
            readTime: data.read_time,
          });
        }
      })
      .catch(() => {
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useRealtimeSync(["lessons", "all"], () => {
    loadPost();
  });

  if (loading) {
    return (
      <div className="container py-24 text-center max-w-2xl space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-64 bg-muted rounded-3xl" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-24 text-center max-w-2xl space-y-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Interview Not Found</h1>
        <p className="text-sm text-muted-foreground">The lesson or interview you requested does not exist or has been relocated.</p>
        <div className="pt-2">
          <Link to="/interviews" className="text-sm font-semibold text-primary hover:underline">
            ← Return to Entrepreneur Lessons
          </Link>
        </div>
      </div>
    );
  }

  // Parse custom blocks if content is JSON
  let contentBlocks: any[] | null = null;
  if (post.content) {
    try {
      const parsed = JSON.parse(post.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        contentBlocks = parsed;
      }
    } catch {}
  }

  return (
    <article className="container max-w-3xl py-12 sm:py-16 space-y-8">
      <div>
        <Link to="/interviews" className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1">
          ← All Entrepreneur Lessons
        </Link>
        <div className="mt-6 text-xs uppercase tracking-wider text-primary font-semibold">{post.category}</div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mt-2 text-foreground">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground mt-2 font-medium">{post.subtitle}</p>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Interviewed by Zahira Shaik with {post.name} • {post.date} • {post.readTime}
        </div>
      </div>

      {post.image && (
        <div className="glass-card rounded-3xl border border-white/60 dark:border-white/10 overflow-hidden bg-muted/30 aspect-[16/10] shadow-2xl backdrop-blur-xl">
          <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-6 text-base text-foreground/90 leading-relaxed">
        {post.excerpt && (
          <blockquote className="text-lg text-foreground/80 italic glass-panel rounded-2xl border-l-4 border-l-primary border border-white/40 dark:border-white/10 p-5 shadow-sm">
            "{post.excerpt}"
          </blockquote>
        )}

        {/* Dynamic Rich Blocks Render */}
        {contentBlocks ? (
          <div className="space-y-6">
            {contentBlocks.map((block: any, idx: number) => {
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
        ) : post.content ? (
          <div
            className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <>
            <p>
              We sat down with {post.name} for an in-depth conversation on product conviction, market timing, and team dynamics. What followed was two hours of honesty about what it actually takes to build something that lasts.
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground pt-4">1. The Early Execution Phase</h2>
            <p>
              "I did not know what I was doing for the first eighteen months," they shared. "Anyone who claims complete certainty from day one is rewriting history." That kind of truth is rare in an ecosystem that rewards retroactive perfection.
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground pt-4">2. The Strategic Turning Point</h2>
            <p>
              The pivotal shift was neither a single feature release nor a funding event. It was the conscious decision to stop optimizing for investor pitch narratives and focus exclusively on resolving core customer pain points.
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground pt-4">3. Tactical Advice for Founders</h2>
            <p>
              "Identify five core users. Talk with them every single week. Disregard secondary noise." Simple, rigorous, and effective.
            </p>
          </>
        )}

        {post.quote && (
          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 my-6">
            <p className="italic text-lg font-medium text-foreground">"{post.quote}"</p>
            {post.quote_by && <p className="text-xs text-primary font-semibold mt-2">— {post.quote_by}</p>}
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-white/30 dark:border-white/10">
        <NewsletterSubscribe />
      </div>
    </article>
  );
}
