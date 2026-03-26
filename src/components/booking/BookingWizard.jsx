import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { brand, services } from "../../data/content";
import { api } from "../../services/api";
import SkeletonCard from "../ui/SkeletonCard";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Najpierw wybierz konsultację."),
  slot: z.string().min(1, "Wybierz termin."),
  firstName: z.string().trim().min(2, "Wpisz imię."),
  lastName: z.string().trim().min(2, "Wpisz nazwisko."),
  email: z.string().trim().email("Wpisz poprawny adres e-mail."),
  phone: z.string().trim().min(7, "Wpisz poprawny numer telefonu."),
  notes: z.string().trim().max(700, "Wiadomość jest zbyt długa.").optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Zaznacz zgodę, aby kontynuować." })
  })
});

const stepFields = {
  1: ["serviceId"],
  2: ["slot"],
  3: ["firstName", "lastName", "email", "phone", "consent"]
};

function BookingWizard() {
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [successState, setSuccessState] = useState(null);

  const {
    register,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      slot: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      consent: false
    }
  });

  const selectedServiceId = watch("serviceId");
  const selectedSlot = watch("slot");
  const selectedService = services.find((service) => service.id === selectedServiceId);

  useEffect(() => {
    if (!selectedServiceId) {
      setAvailability([]);
      setValue("slot", "");
      return;
    }

    let isActive = true;
    setIsLoadingAvailability(true);

    api
      .getAvailability(selectedServiceId)
      .then((response) => {
        if (!isActive) {
          return;
        }

        setAvailability(response.days);

        const existingSlot = getValues("slot");
        const isSlotStillAvailable = response.days
          .flatMap((day) => day.slots)
          .some((slot) => slot.value === existingSlot);

        if (!isSlotStillAvailable) {
          setValue("slot", "");
        }
      })
      .catch((error) => {
        if (isActive) {
          toast.error(error.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingAvailability(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [getValues, selectedServiceId, setValue]);

  async function handleContinue() {
    const isValid = await trigger(stepFields[step]);

    if (!isValid) {
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  async function onSubmit(values) {
    try {
      const response = await api.submitBooking({
        ...values,
        notes: values.notes || ""
      });

      setSuccessState(response.booking);
      toast.success(response.message);
      reset();
      setAvailability([]);
      setStep(1);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Rezerwacja</span>
          <h2 className="mt-5 text-4xl">Umów konsultację w trzech prostych krokach</h2>
          <p className="mt-4 max-w-2xl">
            Wybierz rodzaj wsparcia, zaznacz termin i zostaw podstawowe dane. To robocza wersja systemu, ale cały przepływ działa już lokalnie.
          </p>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/70 px-5 py-4 text-sm shadow-insetGlow dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 font-medium text-ink-900 dark:text-ivory-50">
            <ShieldCheck className="size-4 text-sage-600 dark:text-gold-100" />
            Bezpieczny zapis
          </div>
          <p className="mt-2 text-sm">Dane trafiają do lokalnego backendu i zapisują się w roboczej bazie projektu.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { number: "01", title: "Wybór usługi" },
          { number: "02", title: "Wybór terminu" },
          { number: "03", title: "Dane kontaktowe" }
        ].map((item, index) => {
          const isActive = step === index + 1;

          return (
            <div
              key={item.number}
              className={`rounded-3xl border px-5 py-4 transition ${
                isActive
                  ? "border-sage-500 bg-sage-600 text-white dark:border-gold-200 dark:bg-gold-300 dark:text-ink-900"
                  : "border-white/60 bg-white/65 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.24em]">{item.number}</p>
              <p className="mt-2 font-semibold">{item.title}</p>
            </div>
          );
        })}
      </div>

      {successState ? (
        <div className="mt-8 rounded-[2rem] border border-sage-200 bg-sage-50/80 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-1 size-8 text-sage-600 dark:text-gold-100" />
            <div>
              <h3 className="text-3xl">Rezerwacja zapisana</h3>
              <p className="mt-3">
                {successState.fullName} zarezerwował(a) {successState.serviceName} na {formatSlot(successState.slot)}.
              </p>
              <p className="mt-2">
                To testowa rezerwacja zapisana lokalnie. Na etapie publikacji można tu podłączyć prawdziwy e-mail z potwierdzeniem.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        {step === 1 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;

              return (
                <label
                  key={service.id}
                  className={`premium-card cursor-pointer border transition ${
                    isSelected ? "border-sage-500 ring-2 ring-sage-200 dark:border-gold-200 dark:ring-gold-200/30" : ""
                  }`}
                >
                  <input type="radio" value={service.id} className="sr-only" {...register("serviceId")} />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-sage-600 dark:text-gold-100">{service.category}</p>
                      <h3 className="mt-3 text-2xl">{service.name}</h3>
                    </div>
                    {service.price ? (
                      <div className="rounded-full bg-white/75 px-3 py-1 text-sm font-semibold dark:bg-white/10">
                        {service.price}
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-4">{service.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="stat-pill">{service.duration}</span>
                    <span className="stat-pill">Online lub stacjonarnie</span>
                  </div>
                </label>
              );
            })}
            {errors.serviceId ? <p className="text-sm font-medium text-rose-600">{errors.serviceId.message}</p> : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6">
            {selectedService ? (
              <div className="rounded-[2rem] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm uppercase tracking-[0.2em] text-sage-600 dark:text-gold-100">Wybrana usługa</p>
                <h3 className="mt-2 text-3xl">{selectedService.name}</h3>
              </div>
            ) : null}

            {isLoadingAvailability ? (
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availability.map((day) => (
                  <section key={day.date} className="premium-card">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-5 text-sage-600 dark:text-gold-100" />
                      <h3 className="text-2xl">{day.label}</h3>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {day.slots.map((slot) => {
                        const isActive = selectedSlot === slot.value;

                        return (
                          <label
                            key={slot.value}
                            className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                              isActive
                                ? "border-sage-500 bg-sage-600 text-white dark:border-gold-200 dark:bg-gold-300 dark:text-ink-900"
                                : "border-white/60 bg-white/75 text-ink-900 dark:border-white/10 dark:bg-white/5 dark:text-ivory-50"
                            }`}
                          >
                            <input type="radio" value={slot.value} className="sr-only" {...register("slot")} />
                            <span className="flex items-center gap-2">
                              <Clock3 className="size-4" />
                              {slot.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
            {errors.slot ? <p className="text-sm font-medium text-rose-600">{errors.slot.message}</p> : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Imię</label>
                  <input className="input-shell" {...register("firstName")} />
                  {errors.firstName ? <p className="mt-2 text-sm text-rose-600">{errors.firstName.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Nazwisko</label>
                  <input className="input-shell" {...register("lastName")} />
                  {errors.lastName ? <p className="mt-2 text-sm text-rose-600">{errors.lastName.message}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Adres e-mail</label>
                  <input className="input-shell" type="email" {...register("email")} />
                  {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Telefon</label>
                  <input className="input-shell" {...register("phone")} />
                  {errors.phone ? <p className="mt-2 text-sm text-rose-600">{errors.phone.message}</p> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Krótka informacja przed wizytą</label>
                <textarea
                  rows="5"
                  className="input-shell"
                  placeholder="Napisz, z czym chcesz pracować lub co chcesz uporządkować."
                  {...register("notes")}
                />
                {errors.notes ? <p className="mt-2 text-sm text-rose-600">{errors.notes.message}</p> : null}
              </div>

              <label className="flex items-start gap-3 rounded-3xl border border-white/60 bg-white/65 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                <input type="checkbox" className="checkbox-shell mt-1" {...register("consent")} />
                <span>Wyrażam zgodę na zapisanie moich danych przez {brand.name} w celu obsługi rezerwacji i kontaktu zwrotnego.</span>
              </label>
              {errors.consent ? <p className="text-sm text-rose-600">{errors.consent.message}</p> : null}
            </div>

            <aside className="premium-card">
              <p className="text-sm uppercase tracking-[0.22em] text-sage-600 dark:text-gold-100">Podsumowanie</p>
              <h3 className="mt-4 text-3xl">{selectedService?.name}</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/75 p-4 dark:bg-white/5">
                  <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">Termin</p>
                  <p className="mt-2 text-lg font-semibold text-ink-900 dark:text-ivory-50">
                    {selectedSlot ? formatSlot(selectedSlot) : "Nie wybrano"}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/75 p-4 dark:bg-white/5">
                  <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">Szczegóły wizyty</p>
                  <p className="mt-2">{selectedService?.duration}</p>
                  {selectedService?.price ? <p className="mt-1">{selectedService.price}</p> : null}
                </div>
                <div className="rounded-3xl bg-white/75 p-4 dark:bg-white/5">
                  <p className="text-sm uppercase tracking-[0.18em] text-sage-600 dark:text-gold-100">Status projektu</p>
                  <p className="mt-2">Robocza wersja lokalna gotowa do dalszego dopracowania.</p>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 1))}
            disabled={step === 1 || isSubmitting}
            className="outline-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 size-4" />
            Wstecz
          </button>

          {step < 3 ? (
            <button type="button" onClick={handleContinue} className="luxury-button">
              Dalej
              <ArrowRight className="ml-2 size-4" />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="luxury-button disabled:opacity-60">
              {isSubmitting ? "Zapisywanie..." : "Potwierdź rezerwację"}
              <ArrowRight className="ml-2 size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function formatSlot(slot) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(slot));
}

export default BookingWizard;
