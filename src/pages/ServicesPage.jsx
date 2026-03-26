import { startTransition, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import Reveal from "../components/ui/Reveal";
import { services } from "../data/content";

const filters = ["Wszystko", "Psychodietetyka", "Dietetyka kliniczna"];

function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState("Wszystko");

  const filteredServices =
    activeFilter === "Wszystko"
      ? services
      : services.filter((service) => service.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>Oferta | Movid Psychodietetyka</title>
        <meta
          name="description"
          content="Sprawdź ofertę psychodietetyki i dietetyki klinicznej w roboczej wersji strony Movid."
        />
      </Helmet>

      <section className="section-shell pt-8">
        <SectionHeading
          eyebrow="Oferta"
          title="Psychodietetyka i dietetyka kliniczna opisane prosto, konkretnie i bez zbędnego marketingowego szumu."
          description="Na tym etapie ceny są ukryte, a nacisk kładziemy na jasne pokazanie zakresu wsparcia i dobrego pierwszego kroku."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => startTransition(() => setActiveFilter(filter))}
              className={`chip-button ${activeFilter === filter ? "chip-button-active" : ""}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {filteredServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.05}>
              <ServiceCard service={service} showLink />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell mt-24">
        <Reveal className="glass-panel p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="eyebrow">Następny krok</span>
              <h2 className="mt-5 text-4xl">Nie wiesz jeszcze, od czego zacząć?</h2>
              <p className="mt-4 max-w-2xl">
                Najlepszym wejściem do współpracy będzie zwykle konsultacja psychodietetyczna albo konsultacja dietetyczna kliniczna. To właśnie na ich podstawie można dobrać dalszy kierunek pracy.
              </p>
            </div>
            <Link to="/booking" className="luxury-button">
              Przejdź do rezerwacji
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default ServicesPage;
