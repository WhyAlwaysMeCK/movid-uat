import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ContactForm from "../components/forms/ContactForm";
import Reveal from "../components/ui/Reveal";
import { brand } from "../data/content";

function ContactPage() {
  const cards = [
    { icon: Phone, title: "Telefon", value: brand.phone || "W przygotowaniu" },
    { icon: Mail, title: "E-mail", value: brand.email || "W przygotowaniu" },
    { icon: MapPin, title: "Forma wizyt", value: brand.visits },
    { icon: Clock3, title: "Status", value: "Projekt rozwijany lokalnie przed publikacją" }
  ];

  return (
    <>
      <Helmet>
        <title>Kontakt | {brand.name}</title>
        <meta
          name="description"
          content={`Kontakt i roboczy formularz wiadomości dla marki ${brand.name}.`}
        />
      </Helmet>

      <section className="section-shell pt-8">
        <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="grid gap-6">
            <Reveal className="glass-panel p-6 sm:p-10">
              <span className="eyebrow">Kontakt</span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
                Spokojny pierwszy kontakt jeszcze przed startem strony.
              </h1>
              <p className="mt-6">
                Na tym etapie pracujemy lokalnie, więc dane kontaktowe są jeszcze ukryte. Możesz
                jednak już testować formularz i układ całej sekcji kontaktowej.
              </p>
            </Reveal>

            <Reveal className="grid gap-4 sm:grid-cols-2">
              {cards.map((item) => (
                <div key={item.title} className="premium-card">
                  <item.icon className="size-6 text-sage-600 dark:text-gold-100" />
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-sage-600 dark:text-gold-100">
                    {item.title}
                  </p>
                  <p className="mt-2 text-lg font-medium text-ink-900 dark:text-ivory-50">
                    {item.value}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal className="glass-panel p-6 sm:p-10">
              <span className="eyebrow">Ważne</span>
              <h2 className="mt-5 text-3xl sm:text-4xl">Adres gabinetu nie jest jeszcze publikowany.</h2>
              <p className="mt-4">
                Zostawiamy go poza widokiem publicznym do momentu, aż marka będzie gotowa do
                oficjalnego wdrożenia. Dzięki temu możesz spokojnie pracować nad stroną bez
                udostępniania pełnych danych.
              </p>
            </Reveal>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

export default ContactPage;
