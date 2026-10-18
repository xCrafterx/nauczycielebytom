import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAdmins, useTeachers } from "@/lib/store";
import { znajdzOsobe } from "@/lib/doradca.functions";

export function Doradca() {
  const [teachers] = useTeachers();
  const [admins] = useAdmins();
  const [sprawa, setSprawa] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<{ answer?: string; error?: string } | null>(null);

  const ask = async () => {
    if (sprawa.trim().length < 3) return;
    setLoading(true);
    setOut(null);
    try {
      const osoby = [
        ...teachers.map((t) => ({ name: t.name, role: t.role, info: `Funkcja: ${t.funkcja} Wprowadził: ${t.wprowadzil} Cele: ${t.cele} Styl: ${t.styl}` })),
        ...admins.map((a) => ({ name: a.name, role: `Administracja strony – ${a.role}`, info: a.desc })),
      ];
      setOut(await znajdzOsobe({ data: { sprawa: sprawa.trim(), osoby } }));
    } catch {
      setOut({ error: "Coś poszło nie tak, spróbuj ponownie." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-glow sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Sparkles className="h-6 w-6 text-accent" />Do kogo z moją sprawą?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Opisz swoją sprawę, a AI podpowie, do którego nauczyciela lub osoby z administracji się zgłosić.</p>
        <textarea
          rows={4}
          maxLength={2000}
          value={sprawa}
          onChange={(e) => setSprawa(e.target.value)}
          placeholder="Np. Chcę zgłosić błąd na stronie…"
          className="mt-4 w-full rounded-xl border border-input bg-input/40 px-3 py-2 text-sm outline-none focus:border-ring"
        />
        <button onClick={ask} disabled={loading} className="btn-brand mt-3 w-full py-3 disabled:opacity-60">
          {loading ? "Szukam…" : "Znajdź właściwą osobę"}
        </button>
        {out?.answer && <p className="mt-4 whitespace-pre-line rounded-xl border border-accent/40 bg-secondary p-4 text-sm">{out.answer}</p>}
        {out?.error && <p className="mt-4 text-sm text-destructive">{out.error}</p>}
      </div>
    </section>
  );
}
