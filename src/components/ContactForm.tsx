import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useFormOutage } from "@/lib/store";

const classes = ["1TIR", "2TIR", "3TIR", "4TIR", "5TIR", "1TC", "2TC", "3TC", "4TC", "5TC", "Inna"];
const fieldStyle = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [outage] = useFormOutage();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => body.append(key, String(value)));
    setStatus("sending");
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="contact-form-title" className="mt-20">
      {outage && (
        <p role="alert" className="mb-8 rounded-2xl border-4 border-red-600 bg-red-600/10 p-5 text-center font-display text-2xl font-black uppercase tracking-wide text-[#ff0000] sm:text-3xl">
          FORMULARZ AKTUALNIE NIE DZIAŁA, KONTAKTOWAĆ SIĘ PRZEZ NUMER TELEFONU!
        </p>
      )}
      <h2 id="contact-form-title" className="text-center font-display text-4xl font-black sm:text-5xl">
        Kontakt <span className="text-gradient">Przez Formularz</span>
      </h2>
      <p className="mt-4 text-center text-muted-foreground">Masz pytanie lub chcesz dołączyć? Napisz do nas.</p>
      <form name="kontakt" method="POST" action="/__forms.html" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-gradient-card p-6 sm:p-10">
        <input type="hidden" name="form-name" value="kontakt" />
        <p hidden><label>Nie wypełniaj tego pola<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <fieldset disabled={status === "sending"} className="space-y-6 disabled:opacity-70">
          <legend className="sr-only">Dane i treść wiadomości</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-semibold" htmlFor="contact-name">Imię <span className="text-accent">*</span>
              <input id="contact-name" name="name" required autoComplete="given-name" maxLength={100} placeholder="Twoje imię" className={fieldStyle} />
            </label>
            <label className="block text-sm font-semibold" htmlFor="contact-class">Klasa <span className="text-accent">*</span>
              <select id="contact-class" name="class" required defaultValue="" className={fieldStyle}>
                <option value="" disabled>Wybierz klasę</option>
                {classes.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold" htmlFor="contact-email">Email
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="twoj@email.pl" aria-describedby="email-hint" className={fieldStyle} />
            <span id="email-hint" className="mt-2 block text-xs font-normal text-muted-foreground">Mail nie jest wymagany. Podaj go, jeśli chcesz otrzymać odpowiedź.</span>
          </label>
          <label className="block text-sm font-semibold" htmlFor="contact-subject">Temat <span className="text-accent">*</span>
            <input id="contact-subject" name="subject" required maxLength={200} placeholder="W jakiej sprawie piszesz?" className={fieldStyle} />
          </label>
          <label className="block text-sm font-semibold" htmlFor="contact-message">Wiadomość <span className="text-accent">*</span>
            <textarea id="contact-message" name="message" required rows={6} maxLength={10000} placeholder="Napisz swoją wiadomość…" className={`${fieldStyle} resize-y`} />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">* Pola wymagane</p>
            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl cursor-pointer bg-[#39ff14] px-6 py-3 font-display text-sm font-bold text-green-950 shadow-lg shadow-green-400/25 transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#70ff54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-wait disabled:transform-none motion-reduce:transform-none sm:w-auto">
              {status === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
              {status === "sending" ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <ArrowUpRight aria-hidden="true" className="h-4 w-4" />}
            </button>
          </div>
        </fieldset>
        <div aria-live="polite" aria-atomic="true">
          {status === "success" && <p className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-300"><CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />Dziękujemy! Twoja wiadomość została wysłana.</p>}
          {status === "error" && <p role="alert" className="mt-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się z nami przez SMS. Wpisana treść została zachowana.</p>}
        </div>
      </form>
    </section>
  );
}
