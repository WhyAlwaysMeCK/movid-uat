import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { brand } from "../../data/content";
import { api } from "../../services/api";

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Wpisz imię i nazwisko."),
  email: z.string().trim().email("Wpisz poprawny adres e-mail."),
  phone: z.string().trim().optional(),
  reason: z.string().trim().min(2, "Wybierz powód kontaktu."),
  message: z.string().trim().min(20, "Napisz proszę trochę więcej o swojej sytuacji.").max(1200),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Zaznacz zgodę, aby kontynuować." })
  })
});

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      reason: "Nowa konsultacja",
      message: "",
      consent: false
    }
  });

  async function onSubmit(values) {
    try {
      const response = await api.submitContact(values);
      toast.success(response.message);
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 sm:p-8">
      <span className="eyebrow">Formularz kontaktowy</span>
      <h2 className="mt-5 text-4xl">Napisz, czego teraz potrzebujesz</h2>
      <p className="mt-4 max-w-2xl">
        To robocza wersja formularza. Wiadomość zapisze się lokalnie, dzięki czemu możemy spokojnie dopracować cały proces przed publikacją strony.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Imię i nazwisko</label>
          <input className="input-shell" {...register("fullName")} />
          {errors.fullName ? <p className="mt-2 text-sm text-rose-600">{errors.fullName.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Adres e-mail</label>
          <input className="input-shell" type="email" {...register("email")} />
          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Telefon</label>
          <input className="input-shell" {...register("phone")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Powód kontaktu</label>
          <select className="input-shell" {...register("reason")}>
            <option>Nowa konsultacja</option>
            <option>Psychodietetyka</option>
            <option>Dietetyka kliniczna</option>
            <option>Prowadzenie żywieniowe</option>
            <option>Pytanie organizacyjne</option>
          </select>
          {errors.reason ? <p className="mt-2 text-sm text-rose-600">{errors.reason.message}</p> : null}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-ink-900 dark:text-ivory-50">Wiadomość</label>
        <textarea
          className="input-shell"
          rows="6"
          placeholder="Napisz krótko, z czym chcesz pracować albo jakiej pomocy szukasz."
          {...register("message")}
        />
        {errors.message ? <p className="mt-2 text-sm text-rose-600">{errors.message.message}</p> : null}
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-3xl border border-white/60 bg-white/65 p-4 text-sm dark:border-white/10 dark:bg-white/5">
        <input type="checkbox" className="checkbox-shell mt-1" {...register("consent")} />
        <span>Wyrażam zgodę na wykorzystanie moich danych przez {brand.name} w celu odpowiedzi na wiadomość.</span>
      </label>
      {errors.consent ? <p className="mt-2 text-sm text-rose-600">{errors.consent.message}</p> : null}

      <button type="submit" disabled={isSubmitting} className="luxury-button mt-8 disabled:opacity-60">
        {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
      </button>
    </form>
  );
}

export default ContactForm;
