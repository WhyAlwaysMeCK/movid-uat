import { Helmet } from "react-helmet-async";
import BookingWizard from "../components/booking/BookingWizard";
import Reveal from "../components/ui/Reveal";
import { brand } from "../data/content";

function BookingPage() {
  return (
    <>
      <Helmet>
        <title>Rezerwacja | {brand.name}</title>
        <meta
          name="description"
          content={`Robocza wersja systemu rezerwacji konsultacji dla marki ${brand.name}.`}
        />
      </Helmet>

      <section className="section-shell pt-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="glass-panel p-6 sm:p-10">
            <span className="eyebrow">System rezerwacji</span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
              Flow zapisu gotowy do testów jeszcze przed publikacją strony.
            </h1>
            <p className="mt-6">
              To lokalna, robocza wersja procesu. Możesz już testować wybór usług, terminów i
              formularz zapisu bez stawiania strony na płatnym hostingu.
            </p>
            <div className="mt-8 space-y-4">
              {[
                `Wybór konsultacji z oferty marki ${brand.shortName}`,
                "Pobieranie dostępnych terminów z lokalnego API",
                "Zapis danych z walidacją i potwierdzeniem"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.75rem] border border-white/60 bg-white/65 p-4 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  {item}
                </div>
              ))}
            </div>
          </Reveal>

          <BookingWizard />
        </div>
      </section>
    </>
  );
}

export default BookingPage;
