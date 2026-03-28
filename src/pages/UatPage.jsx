import { useEffect, useState } from "react";
import { Database, Mail, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Reveal from "../components/ui/Reveal";
import { api } from "../services/api";
import { brand } from "../data/content";

function UatPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setIsLoading(true);

    try {
      const response = await api.getUatOverview();
      setData(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm("Czy na pewno chcesz wyczyścić wszystkie dane testowe w UAT?");

    if (!confirmed) {
      return;
    }

    setIsResetting(true);

    try {
      const response = await api.resetUatData();
      toast.success(response.message);
      await loadOverview();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>UAT | {brand.name}</title>
        <meta
          name="description"
          content={`Środowisko UAT do testowania zapisów, wiadomości i zdarzeń mailowych dla ${brand.name}.`}
        />
      </Helmet>

      <section className="section-shell pt-8">
        <Reveal className="glass-panel p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Środowisko UAT</span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
                Panel testowy rekordów, wiadomości i zdarzeń mailowych.
              </h1>
              <p className="mt-5 max-w-3xl">
                Ten widok służy do testowania tego, co trafia do bazy. Możesz pokazać klientowi
                publiczny flow strony, a potem wejść tutaj i sprawdzić zapisane rezerwacje,
                formularze kontaktowe oraz symulowane maile.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={loadOverview} className="outline-button" disabled={isLoading}>
                <RefreshCcw className="mr-2 size-4" />
                Odśwież
              </button>
              <button type="button" onClick={handleReset} className="luxury-button" disabled={isResetting}>
                <Trash2 className="mr-2 size-4" />
                {isResetting ? "Czyszczenie..." : "Wyczyść dane testowe"}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <StatCard
              icon={Database}
              title="Rezerwacje"
              value={isLoading ? "..." : data?.stats?.bookings ?? 0}
            />
            <StatCard
              icon={ShieldCheck}
              title="Formularze kontaktowe"
              value={isLoading ? "..." : data?.stats?.contacts ?? 0}
            />
            <StatCard
              icon={Mail}
              title="Zdarzenia mailowe"
              value={isLoading ? "..." : data?.stats?.mailEvents ?? 0}
            />
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <DataPanel
            title="Rezerwacje"
            items={data?.bookings}
            isLoading={isLoading}
            renderItem={(item) => (
              <>
                <p className="break-words font-semibold text-ink-900 dark:text-ivory-50">
                  {[item.first_name, item.last_name].filter(Boolean).join(" ") || item.service_name}
                </p>
                <p className="mt-2 break-all text-sm">{item.email}</p>
                <p className="mt-2 break-words text-sm">{item.slot}</p>
              </>
            )}
          />
          <DataPanel
            title="Kontakt"
            items={data?.contacts}
            isLoading={isLoading}
            renderItem={(item) => (
              <>
                <p className="break-words font-semibold text-ink-900 dark:text-ivory-50">{item.full_name}</p>
                <p className="mt-2 break-words text-sm">{item.reason}</p>
                <p className="mt-2 break-all text-sm">{item.email}</p>
              </>
            )}
          />
          <DataPanel
            title="Maile"
            items={data?.mailEvents}
            isLoading={isLoading}
            renderItem={(item) => (
              <>
                <p className="break-words font-semibold text-ink-900 dark:text-ivory-50">{item.subject}</p>
                <p className="mt-2 break-all text-sm">{item.recipient}</p>
                <p className="mt-2 break-words text-sm">{item.preview}</p>
              </>
            )}
          />
        </div>
      </section>
    </>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="premium-card">
      <Icon className="size-6 text-sage-600 dark:text-gold-100" />
      <p className="mt-4 text-sm uppercase tracking-[0.2em] text-sage-600 dark:text-gold-100">
        {title}
      </p>
      <p className="mt-2 text-4xl font-semibold text-ink-900 dark:text-ivory-50">{value}</p>
    </div>
  );
}

function DataPanel({ title, items, isLoading, renderItem }) {
  return (
    <Reveal className="glass-panel p-6">
      <h2 className="text-3xl">{title}</h2>
      <div className="mt-5 space-y-4">
        {isLoading ? (
          <p className="text-sm">Ładowanie...</p>
        ) : items?.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
            >
              {renderItem(item)}
            </div>
          ))
        ) : (
          <p className="text-sm">Brak danych testowych.</p>
        )}
      </div>
    </Reveal>
  );
}

export default UatPage;
