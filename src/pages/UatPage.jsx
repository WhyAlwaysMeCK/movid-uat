import { useEffect, useState } from "react";
import { Database, Mail, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Reveal from "../components/ui/Reveal";
import { api } from "../services/api";

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
        <title>UAT | Movid Psychodietetyka</title>
        <meta
          name="description"
          content="Środowisko UAT do testowania zapisów, wiadomości i zdarzeń mailowych dla Movid Psychodietetyka."
        />
      </Helmet>

      <section className="section-shell pt-8">
        <Reveal className="glass-panel p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Środowisko UAT</span>
              <h1 className="mt-6 text-5xl sm:text-6xl">Panel testowy rekordów, wiadomości i zdarzeń mailowych.</h1>
              <p className="mt-5 max-w-3xl">
                Ten widok służy do testowania tego, co trafia do bazy. Możesz pokazać klientowi publiczny flow strony, a potem wejść tutaj i sprawdzić zapisane rezerwacje, formularze kontaktowe oraz symulowane maile.
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
        </Reveal>
      </section>

      <section className="section-shell mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Database, label: "Rezerwacje", value: data?.stats.bookings ?? 0 },
            { icon: ShieldCheck, label: "Wiadomości", value: data?.stats.contacts ?? 0 },
            { icon: Mail, label: "Zdarzenia mailowe", value: data?.stats.mailEvents ?? 0 }
          ].map((item) => (
            <Reveal key={item.label} className="premium-card">
              <item.icon className="size-6 text-sage-600 dark:text-gold-100" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-sage-600 dark:text-gold-100">{item.label}</p>
              <p className="mt-3 font-display text-5xl text-ink-900 dark:text-ivory-50">{item.value}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell mt-10 grid gap-6 xl:grid-cols-3">
        <Reveal className="glass-panel p-6 sm:p-8 xl:col-span-1">
          <h2 className="text-3xl">Rezerwacje</h2>
          <div className="mt-6 space-y-4">
            {isLoading ? <p>Ładowanie danych...</p> : <RecordList items={data?.bookings} type="booking" />}
          </div>
        </Reveal>

        <Reveal className="glass-panel p-6 sm:p-8 xl:col-span-1">
          <h2 className="text-3xl">Formularze kontaktowe</h2>
          <div className="mt-6 space-y-4">
            {isLoading ? <p>Ładowanie danych...</p> : <RecordList items={data?.contacts} type="contact" />}
          </div>
        </Reveal>

        <Reveal className="glass-panel p-6 sm:p-8 xl:col-span-1">
          <h2 className="text-3xl">Zdarzenia mailowe</h2>
          <div className="mt-6 space-y-4">
            {isLoading ? <p>Ładowanie danych...</p> : <RecordList items={data?.mailEvents} type="mail" />}
          </div>
        </Reveal>
      </section>
    </>
  );
}

function RecordList({ items = [], type }) {
  if (!items.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-sage-200 bg-white/50 p-5 text-sm dark:border-white/10 dark:bg-white/5">
        Brak danych testowych.
      </div>
    );
  }

  return items.map((item) => {
    if (type === "booking") {
      return (
        <div key={item.id} className="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">{item.service_name}</p>
          <p className="mt-3 font-semibold text-ink-900 dark:text-ivory-50">{item.first_name} {item.last_name}</p>
          <p className="mt-2 text-sm">{item.email}</p>
          <p className="mt-1 text-sm">{item.phone}</p>
          <p className="mt-3 text-sm">{formatDate(item.slot)}</p>
          {item.notes ? <p className="mt-3 text-sm text-ink-700 dark:text-ivory-100/75">{item.notes}</p> : null}
        </div>
      );
    }

    if (type === "contact") {
      return (
        <div key={item.id} className="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">{item.reason}</p>
          <p className="mt-3 font-semibold text-ink-900 dark:text-ivory-50">{item.full_name}</p>
          <p className="mt-2 text-sm">{item.email}</p>
          {item.phone ? <p className="mt-1 text-sm">{item.phone}</p> : null}
          <p className="mt-3 text-sm text-ink-700 dark:text-ivory-100/75">{item.message}</p>
        </div>
      );
    }

    return (
      <div key={item.id} className="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">{item.kind}</p>
        <p className="mt-3 font-semibold text-ink-900 dark:text-ivory-50">{item.subject}</p>
        <p className="mt-2 text-sm">Do: {item.recipient}</p>
        <p className="mt-3 text-sm text-ink-700 dark:text-ivory-100/75">{item.preview}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">{formatDate(item.created_at)}</p>
      </div>
    );
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default UatPage;
