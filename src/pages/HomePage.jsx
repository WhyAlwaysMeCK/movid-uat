import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarHeart, Check, Shield, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import TestimonialCarousel from "../components/ui/TestimonialCarousel";
import Reveal from "../components/ui/Reveal";
import { brand, certifications, homeHighlights, services, testimonials, trustMetrics } from "../data/content";

function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.4]);
  const featuredServices = services.filter((service) => service.featured);

  return (
    <>
      <Helmet>
        <title>{brand.name} | Psychodietetyka w Warszawie</title>
        <meta
          name="description"
          content="Robocza wersja strony Satelle Psychodietetyka: psychodietetyka, dietetyka kliniczna, blog i system rezerwacji konsultacji."
        />
      </Helmet>

      <section className="section-shell pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="glass-panel overflow-hidden p-8 sm:p-10 lg:p-12">
            <span className="eyebrow">{brand.tagline}</span>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Psychodietetyka i dietetyka, które pomagają odzyskać spokój wokół jedzenia.
            </h1>
            <p className="mt-6 max-w-2xl text-lg">{brand.headline}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/booking" className="luxury-button">
                Umów konsultację
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link to="/services" className="outline-button">
                Zobacz ofertę
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {homeHighlights.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-white/60 bg-white/65 p-5 dark:border-white/10 dark:bg-white/5">
                  <p className="font-semibold text-ink-900 dark:text-ivory-50">{item.title}</p>
                  <p className="mt-3 text-sm">{item.copy}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <Reveal className="grid gap-6">
            <div className="glass-panel relative overflow-hidden bg-hero-grid p-8 sm:p-10">
              <motion.div
                className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-gold-200/40 blur-3xl dark:bg-gold-300/10"
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-sage-700 shadow-insetGlow dark:bg-white/5 dark:text-gold-100">
                  <Sparkles className="size-4" />
                  Projekt strony premium
                </div>
                <div className="mt-8 grid gap-5">
                  <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm uppercase tracking-[0.22em] text-sage-600 dark:text-gold-100">Dlaczego to działa</p>
                    <h2 className="mt-3 text-4xl">Spokojny przekaz, czytelna oferta i prosty pierwszy krok</h2>
                    <p className="mt-4">
                      Od pierwszego wejścia użytkownik powinien wiedzieć, czym zajmuje się marka, dla kogo jest i jak łatwo można przejść do kontaktu lub rezerwacji.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
                      <CalendarHeart className="size-6 text-sage-600 dark:text-gold-100" />
                      <p className="mt-4 font-semibold text-ink-900 dark:text-ivory-50">Wygodna rezerwacja</p>
                      <p className="mt-2 text-sm">Wielostopniowy formularz pozwala sprawdzić flow rezerwacji jeszcze przed publikacją projektu.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
                      <Shield className="size-6 text-sage-600 dark:text-gold-100" />
                      <p className="mt-4 font-semibold text-ink-900 dark:text-ivory-50">Zaufanie od pierwszego wejścia</p>
                      <p className="mt-2 text-sm">Treści, opinie i spokojna estetyka budują wrażenie profesjonalnej, nowoczesnej marki.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trustMetrics.slice(0, 4).map((item) => (
                <div key={item.label} className="stat-pill flex items-center justify-between gap-4 px-5 py-4">
                  <span className="font-display text-3xl text-ink-900 dark:text-ivory-50">{item.value}</span>
                  <span className="max-w-[12rem] text-right text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell mt-24">
        <SectionHeading
          eyebrow="Oferta"
          title="Usługi zaprojektowane wokół psychodietetyki i codziennych nawyków."
          description="Każda konsultacja ma jasny cel i prosty opis, aby łatwo było zrozumieć, od czego zacząć."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {featuredServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.08}>
              <ServiceCard service={service} showLink />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="glass-panel p-8 sm:p-10">
            <span className="eyebrow">Standard pracy</span>
            <h2 className="mt-6 text-4xl">Marka oparta na spokoju, zrozumieniu i realnych zmianach.</h2>
            <div className="mt-8 space-y-4">
              {certifications.map((item) => (
                <div key={item} className="flex gap-4 rounded-[1.75rem] border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                  <Check className="mt-1 size-5 text-sage-600 dark:text-gold-100" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </div>
      </section>

      <section className="section-shell mt-24">
        <Reveal className="glass-panel overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="eyebrow">Pierwszy krok</span>
              <h2 className="mt-6 max-w-3xl text-4xl md:text-5xl">Zacznij od jednej konsultacji, która pomoże uporządkować dalszą drogę.</h2>
              <p className="mt-5 max-w-2xl">
                Ta wersja strony nie jest jeszcze publikowana, ale już teraz możesz pracować na gotowym układzie, blogu i systemie zapisu.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link to="/booking" className="luxury-button">
                Przejdź do rezerwacji
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link to="/contact" className="outline-button">
                Przejdź do kontaktu
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default HomePage;
