import { Helmet } from "react-helmet-async";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import Timeline from "../components/ui/Timeline";
import { brand, certifications, philosophy, timeline } from "../data/content";

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>O marce | {brand.name}</title>
        <meta
          name="description"
          content="Poznaj założenia marki Satelle Psychodietetyka, jej podejście do pracy i kierunek rozwoju strony."
        />
      </Helmet>

      <section className="section-shell pt-8">
        <SectionHeading
          eyebrow="O marce"
          title="Satelle Psychodietetyka powstaje jako spokojna, nowoczesna marka wokół relacji z jedzeniem."
          description="To wersja robocza serwisu, w której budujemy język, ofertę i doświadczenie klienta jeszcze przed publikacją i uruchomieniem płatnego hostingu."
        />

        <div className="story-grid mt-10">
          <Reveal className="glass-panel p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.22em] text-sage-600 dark:text-gold-100">
              Kierunek marki
            </p>
            <h2 className="mt-4 text-4xl">
              Psychodietetyka ma pomagać nie tylko zmieniać jedzenie, ale też rozumieć mechanizmy,
              które za nim stoją.
            </h2>
            <p className="mt-5">
              Wiele osób nie potrzebuje kolejnego restrykcyjnego planu, tylko spokojnego procesu,
              który połączy nawyki, emocje, codzienność i dietetykę w jedną spójną zmianę. Taki
              właśnie kierunek ma Satelle.
            </p>
            <p className="mt-4">
              Strona ma wspierać ten odbiór już od pierwszego wejścia: ma być estetyczna, klarowna
              i dawać poczucie, że za marką stoi przemyślany proces pracy.
            </p>
          </Reveal>

          <Reveal className="glass-panel overflow-hidden p-0">
            <div className="relative h-full min-h-[24rem] bg-gradient-to-br from-ivory-100 via-white to-sage-100 dark:from-sage-700 dark:via-sage-800 dark:to-sage-600">
              <img
                src="/practitioner-portrait.svg"
                alt="Ilustracja reprezentująca markę Satelle Psychodietetyka"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell mt-24">
        <SectionHeading
          eyebrow="Filozofia"
          title="Ta marka ma być spokojna, nowoczesna i bardzo czytelna dla odbiorcy."
          description="Równie ważne jak estetyka są tu prosty język, poczucie bezpieczeństwa i konkret, który pomaga przejść do działania."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {philosophy.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} className="premium-card">
              <h3 className="text-3xl">{item.title}</h3>
              <p className="mt-4">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell mt-24">
        <SectionHeading
          eyebrow="Rozwój"
          title="Etapy budowania marki, która z czasem może stać się pełnym serwisem psychodietetycznym."
        />
        <div className="mt-10">
          <Timeline items={timeline} />
        </div>
      </section>

      <section className="section-shell mt-24">
        <Reveal className="glass-panel p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="eyebrow">{brand.shortName}</span>
              <h2 className="mt-5 text-4xl">
                Założenia marki, które mają budować zaufanie jeszcze przed pierwszą wizytą.
              </h2>
            </div>
            <div className="grid gap-4">
              {certifications.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default AboutPage;
