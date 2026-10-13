import { Link } from "react-router-dom";
import { SUBSTACK_URL, X_URL, INSTAGRAM_URL } from "@/data/links";

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.851L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function SubstackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="mt-20 border-t border-white/40 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-xl shadow-lg relative z-10">
      <div className="container py-12 sm:py-16">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
              <img
                src="/logo.png"
                alt="Unmasking Logo"
                className="h-8 w-auto object-contain shrink-0 drop-shadow-sm"
              />
              <span className="font-display text-2xl font-bold text-foreground">
                Unmasking<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Independent founder interviews, editorial essays, and high-conviction content strategy by Zahira Shaik.
            </p>
            <div className="pt-2">
              <a
                href="mailto:info@unmasking.com"
                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
              >
                <MailIcon size={16} /> info@unmasking.com
              </a>
            </div>
            <div className="flex gap-3 pt-2">
              {[
                { Icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn", external: true },
                { Icon: XIcon, href: X_URL, label: "X", external: true },
                { Icon: InstagramIcon, href: INSTAGRAM_URL, label: "Instagram", external: true },
                { Icon: SubstackIcon, href: SUBSTACK_URL, label: "Substack", external: true },
              ].map(({ Icon, href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 grid place-items-center rounded-lg border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/10 transition-all focus-visible:ring-2 focus-visible:ring-primary hover:scale-105 shadow-sm"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
              Editorial Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/interviews" className="text-muted-foreground hover:text-primary transition-colors">Entrepreneur Lessons</Link></li>
              <li><Link to="/startup-stories" className="text-muted-foreground hover:text-primary transition-colors">Startup Stories</Link></li>
              <li><Link to="/corporate-girlie" className="text-muted-foreground hover:text-primary transition-colors">Corporate Girlie</Link></li>
              <li><Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">Event Documentaries</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/subscribe" className="text-muted-foreground hover:text-primary transition-colors">Subscribe</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><a href="mailto:info@unmasking.com" className="text-muted-foreground hover:text-primary transition-colors">Editorial Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/30 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Unmasking. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Real founder stories. Independent editorial writing.
          </p>
        </div>
      </div>
    </footer>
  );
}

