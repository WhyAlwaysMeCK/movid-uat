import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageTransition from "./components/layout/PageTransition";
import AmbientBackground from "./components/ui/AmbientBackground";
import ScrollProgress from "./components/ui/ScrollProgress";
import { useUiStore } from "./store/ui-store";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const UatPage = lazy(() => import("./pages/UatPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <ThemeSync />
          <ScrollToTop />
          <AmbientBackground />
          <ScrollProgress />
          <div className="relative min-h-screen overflow-x-clip">
            <Navbar />
            <AnimatedRoutes />
            <Footer />
          </div>
          <Toaster
            position="top-right"
            expand
            toastOptions={{
              classNames: {
                toast:
                  "!border-white/40 !bg-white/85 !text-ink-900 dark:!border-white/10 dark:!bg-sage-800/90 dark:!text-ivory-50",
                description: "!text-ink-700 dark:!text-ivory-100/75",
                actionButton: "!bg-sage-500 !text-white",
                cancelButton: "!bg-black/10 !text-ink-900 dark:!bg-white/10 dark:!text-ivory-50"
              }
            }}
          />
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <ServicesPage />
              </PageTransition>
            }
          />
          <Route
            path="/booking"
            element={
              <PageTransition>
                <BookingPage />
              </PageTransition>
            }
          />
          <Route
            path="/blog"
            element={
              <PageTransition>
                <BlogPage />
              </PageTransition>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PageTransition>
                <ArticlePage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            }
          />
          <Route
            path="/uat"
            element={
              <PageTransition>
                <UatPage />
              </PageTransition>
            }
          />
          <Route
            path="/not-found"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

function ThemeSync() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}

function RouteLoader() {
  return (
    <div className="section-shell pt-20">
      <div className="glass-panel animate-pulse p-10">
        <div className="h-4 w-32 rounded-full bg-sage-100 dark:bg-white/10" />
        <div className="mt-6 h-14 w-2/3 rounded-3xl bg-sage-100 dark:bg-white/10" />
        <div className="mt-4 h-5 w-full rounded-full bg-sage-100 dark:bg-white/10" />
        <div className="mt-3 h-5 w-5/6 rounded-full bg-sage-100 dark:bg-white/10" />
      </div>
    </div>
  );
}

export default App;
