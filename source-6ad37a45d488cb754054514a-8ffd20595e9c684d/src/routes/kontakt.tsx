import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Siren } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – Nauczyciele Cosinus" },
      { name: "description", content: "Kontakt do ucznia od strony Nauczyciele Cosinus." },
      { property: "og:title", content: "Kontakt – Nauczyciele Cosinus" },
      { property: "og:description", content: "Kontakt do ucznia od strony Nauczyciele Cosinus." },
    ],
  }),
  component: Kontakt,
});

const items = [
  { Icon: MapPin, title: "Adres", lines: ["Wrocławska 32/34", "piętro 1 i 2"] },
  { Icon: Phone, title: "Telefon", lines: ["695 560 039", "Proszę o kontakt SMS"] },
  { Icon: Mail, title: "Email", lines: ["brak maila"] },
];

function Kontakt() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center font-display text-4xl font-black sm:text-5xl">
        Kontakt <span className="text-gradient">Do Ucznia Od Strony</span>
      </h1>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {items.map(({ Icon, title, lines }) => (
          <div key={title} className="card-hover flex gap-5 rounded-3xl border border-border bg-gradient-card p-6">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-glow"><Icon /></div>
            <div>
              <h2 className="font-display text-xl font-bold">{title}</h2>
              {lines.map((l) => <p key={l} className="text-muted-foreground">{l}</p>)}
            </div>
          </div>
        ))}
        <div className="flex gap-5 rounded-3xl border border-destructive/60 bg-destructive/10 p-6">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-destructive"><Siren /></div>
          <div>
            <h2 className="font-display text-xl font-bold text-destructive">Sytuacje Alarmowe · 24/7</h2>
            <p className="text-muted-foreground">Jeżeli jest jakiś błąd kontaktuj się poprzez nr. tel.</p>
          </div>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
