import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/interviews", label: "Entrepreneur Lessons" },
  { to: "/startup-stories", label: "Startup Stories" },
  { to: "/events", label: "Event Documentaries" },
  { to: "/services", label: "Services" },
];

const moreLinks = [
  { to: "/corporate-girlie", label: "Corporate Girlie" },
  { to: "/subscribe", label: "Subscribe" },
];

const allLinks = [...primaryLinks, ...moreLinks];

function navLinkClass(isActive: boolean) {
  return cn(
    "text-sm transition-colors relative py-1 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm px-1",
    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const moreActive = moreLinks.some((l) => loc.pathname === l.to || loc.pathname.startsWith(`${l.to}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/70 dark:bg-background/60 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-md"
          : "bg-background/40 dark:bg-background/30 backdrop-blur-md border-b border-white/20 dark:border-white/5"
      )}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-1 transition-transform hover:scale-[1.02]"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.png"
            alt="Unmasking Logo"
            className="h-9 w-auto object-contain shrink-0 drop-shadow-sm"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Unmasking<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 ml-auto" aria-label="Main Navigation">
          {primaryLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "relative inline-flex items-center gap-1.5 text-sm outline-none py-1 px-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary transition-all hover:bg-white/30 dark:hover:bg-white/5",
                moreActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>More</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6"/>
              </svg>
              {moreActive && <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary shadow-sm" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[14rem] rounded-xl border border-white/40 dark:border-white/10 bg-background/80 dark:bg-card/85 backdrop-blur-xl shadow-xl p-1.5">
              {moreLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild className="rounded-lg">
                  <Link
                    to={l.to}
                    className={cn(
                      "cursor-pointer text-sm px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors rounded-lg",
                      loc.pathname === l.to || loc.pathname.startsWith(`${l.to}/`)
                        ? "text-primary font-medium bg-primary/15"
                        : ""
                    )}
                  >
                    {l.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Header Actions */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md text-foreground hover:bg-white/60 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <nav className="lg:hidden border-t border-white/30 dark:border-white/10 bg-background/90 dark:bg-background/85 backdrop-blur-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto" aria-label="Mobile Navigation">
          <div className="container py-4 flex flex-col space-y-1">
            {allLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "py-2.5 px-3 rounded-lg text-sm transition-colors",
                    isActive ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5"
                  )
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

