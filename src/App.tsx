import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Interviews from "./pages/Interviews";
import InterviewDetail from "./pages/InterviewDetail";
import Notes from "./pages/Notes";
import CorporateGirlie from "./pages/CorporateGirlie";
import EventDocumentaries from "./pages/EventDocumentaries";
import Services from "./pages/Services";
import StartupStories from "./pages/StartupStories";
import Admin from "./pages/Admin";
import Subscribe from "./pages/Subscribe";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/interviews/:slug" element={<InterviewDetail />} />
              <Route path="/startup-stories" element={<StartupStories />} />
              <Route path="/corporate-girlie" element={<CorporateGirlie />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/events" element={<EventDocumentaries />} />
              <Route path="/services" element={<Services />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
