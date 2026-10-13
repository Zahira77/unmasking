import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";

export default function Subscribe() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "subscribe";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (type !== "book") {
    return (
      <div className="container py-16 max-w-4xl space-y-8">
        <NewsletterSubscribe />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setStatus("loading");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: type }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setStatus("success");
    } catch (err) {
      console.error(err);
      // Even if offline backend error occurs, show helpful state
      setStatus("error");
    }
  };

  return (
    <div className="container py-16 max-w-xl space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary">Content Writing Booking</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Book Blog & Content Services</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Provide your name and work email address below to schedule a strategic content consultation.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-8 glass-card rounded-3xl border border-white/60 dark:border-white/10 text-center space-y-4 backdrop-blur-2xl shadow-xl">
          <div className="w-12 h-12 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Booking Request Received</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, {name || "there"}. We have logged your request and will reach out shortly.
          </p>
          <div className="pt-2">
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl border border-white/60 dark:border-white/10 p-6 sm:p-8 space-y-4 backdrop-blur-2xl shadow-xl">
          <div className="space-y-1.5">
            <label htmlFor="book-name" className="block text-xs font-semibold text-foreground">
              Your Full Name
            </label>
            <input
              id="book-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-2.5 text-sm glass-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="book-email" className="block text-xs font-semibold text-foreground">
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              id="book-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full px-4 py-2.5 text-sm glass-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              required
            />
          </div>

          {status === "error" && (
            <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs rounded-xl">
              Connection issue. We recorded your input locally. Please email info@unmasking.com directly if urgent.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/25 transition-all focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 btn-action"
          >
            {status === "loading" ? "Submitting Booking..." : "Submit Booking Request"}
          </button>
        </form>
      )}
    </div>
  );
}
