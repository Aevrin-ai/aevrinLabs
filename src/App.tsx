import { lazy, startTransition, Suspense, useEffect, useState } from "react";
import { LazyMotion } from "motion/react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";

import { BRAND } from "@/lib/site";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import { PageMeta } from "@/components/ui/page-meta";
import WaitlistProvider from "@/components/waitlist/provider";

// The home page ships in the first bundle, since it is where most visits land
// and it carries the hero. Below the hero it loads as a second chunk, and
// every other page loads when it is first visited.
const HomeBelowFold = lazy(() => import("@/components/sections/home-below-fold"));
const ProductPage = lazy(() => import("@/pages/product"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// A new page starts at the top; a link with a #hash scrolls to its section
// once that section has loaded.
function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let timer: ReturnType<typeof setTimeout>;
    const attempt = (retries: number) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (retries > 0) timer = setTimeout(() => attempt(retries - 1), 100);
    };
    attempt(20);
    return () => clearTimeout(timer);
  }, [hash, pathname]);
  return null;
}

// Below the hero waits for the browser's first quiet moment, then renders as
// a transition, so React builds it in small slices instead of one long task
// that would hold up the first taps on the page.
function useWhenIdle() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => startTransition(() => setReady(true));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(go, 300);
    return () => clearTimeout(id);
  }, []);
  return ready;
}

function HomePage() {
  const ready = useWhenIdle();
  return (
    <main>
      <PageMeta
        path="/"
        title={`${BRAND}: your AI agents, working on your rules`}
        description={`${BRAND} shows you every AI agent at work, what it can reach and what it costs, and stops it before it goes too far.`}
      />
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>{ready ? <HomeBelowFold /> : <div className="min-h-screen" />}</Suspense>
    </main>
  );
}

export default function App() {
  return (
    // strict: a full `motion` element anywhere would pull every feature back
    // into the first bundle, so it is an error rather than a quiet cost.
    <LazyMotion features={loadMotionFeatures} strict>
      <BrowserRouter>
        <ScrollToHash />
        <WaitlistProvider>
          {/* overflow-x-clip, not hidden: hidden makes this a scroll container,
              and every position: sticky inside would stick to it instead of to
              the viewport. */}
          <div className="bg-background overflow-x-clip">
            <a
              href="#content"
              className="bg-foreground text-background sr-only z-[70] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              Skip to content
            </a>
            <Navbar />
            <div id="content">
              {/* Holds the footer down while a page loads, so it does not flash up
                  into the gap and then jump away. */}
              <Suspense fallback={<div className="min-h-screen" />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product" element={<ProductPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </WaitlistProvider>
      </BrowserRouter>
    </LazyMotion>
  );
}
