import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { PageTransition } from "./PageTransition";
import AmbientBackdrop from "./AmbientBackdrop";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background/80 dark:bg-background/85 text-foreground relative selection:bg-primary/20">
      <AmbientBackdrop />
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20 relative z-10">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

