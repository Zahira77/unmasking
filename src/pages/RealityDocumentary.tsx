import { Link, useParams } from "react-router-dom";
import { realityDocumentaries } from "@/data/content";

export default function RealityDocumentary() {
  const { slug } = useParams();
  const documentary = realityDocumentaries.find((d) => d.slug === slug);

  if (!documentary) {
    return (
      <div className="container py-24 text-center max-w-xl space-y-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Documentary Not Found</h1>
        <Link to="/reality-of-startups" className="text-sm font-semibold text-primary hover:underline block">
          ← Return to The Reality of Startups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24 pt-8 pb-16">
      <section className="container pt-8 sm:pt-12 max-w-4xl">
        <Link to="/reality-of-startups" className="text-xs text-muted-foreground hover:text-foreground font-medium block mb-4">
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
        <div className="grid md:grid-cols-2 gap-6">
          {documentary.episodes.map((episode) => (
            <article
              key={episode.title}
              className="border border-border bg-card rounded-md p-6 sm:p-8 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-primary uppercase tracking-wider">Episode</span>
                  <span>{episode.date}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                  {episode.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {episode.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                <span>Documentary Overview</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
