import { ArrowRight, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { brand } from "../../data/content";

function Footer() {
  const hasPhone = Boolean(brand.phone);
  const hasEmail = Boolean(brand.email);
  const hasInstagram = Boolean(brand.instagram);
  const hasLinkedin = Boolean(brand.linkedin);

  return (
    <footer className="relative z-10 mt-24 pb-10 pt-12">
      <div className="section-shell">
        <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src="/logo-mark.svg"
                  alt={`${brand.shortName} logo`}
                  className="size-12 rounded-full object-cover shadow-lg shadow-sage-900/20"
                />
                <span className="eyebrow">{brand.name}</span>
              </div>
              <h2 className="mt-5 max-w-xl text-3xl sm:text-4xl md:text-5xl">
                Strona robocza budowana wokół spokojnej relacji z jedzeniem i realnej zmiany.
              </h2>
              <p className="mt-5 max-w-2xl">
                {brand.subheadline}
              </p>
              <Link to="/booking" className="luxury-button mt-8">
                Przejdź do rezerwacji
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-2xl">Kontakt</h3>
                <div className="mt-5 space-y-3">
                  {hasPhone ? (
                    <a className="flex items-center gap-3 text-sm text-ink-700 dark:text-ivory-100/70" href={`tel:${brand.phone}`}>
                      <Phone className="size-4" />
                      {brand.phone}
                    </a>
                  ) : null}
                  {hasEmail ? (
                    <a className="flex items-center gap-3 text-sm text-ink-700 dark:text-ivory-100/70" href={`mailto:${brand.email}`}>
                      <Mail className="size-4" />
                      {brand.email}
                    </a>
                  ) : null}
                  {!hasPhone && !hasEmail ? <p className="text-sm">{brand.contactNote}</p> : null}
                  <p className="text-sm">{brand.visits}</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl">Na skróty</h3>
                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <Link to="/about">O marce</Link>
                  <Link to="/services">Oferta</Link>
                  <Link to="/blog">Blog</Link>
                  <Link to="/contact">Kontakt</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="soft-divider my-8" />

          <div className="flex flex-col gap-4 text-sm text-ink-700 dark:text-ivory-100/70 sm:flex-row sm:items-center sm:justify-between">
            <p>{brand.name} | robocza wersja strony w {brand.city}</p>
            {hasInstagram || hasLinkedin ? (
              <div className="flex items-center gap-4">
                {hasInstagram ? (
                  <a href={brand.instagram} aria-label={`${brand.name} Instagram`}>
                    <Instagram className="size-4" />
                  </a>
                ) : null}
                {hasLinkedin ? (
                  <a href={brand.linkedin} aria-label={`${brand.name} LinkedIn`}>
                    <Linkedin className="size-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
