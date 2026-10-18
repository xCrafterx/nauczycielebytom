import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Lightbulb, Target, Users, ArrowLeft, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { useTeachers } from "@/lib/store";

export const Route = createFileRoute("/nauczyciel/$id")({
  head: () => ({
    meta: [
      { title: "Nauczyciel – Nauczyciele Cosinus" },
      { name: "description", content: "Szczegóły nauczyciela szkoły Cosinus." },
      { property: "og:title", content: "Nauczyciel – Nauczyciele Cosinus" },
      { property: "og:description", content: "Szczegóły nauczyciela szkoły Cosinus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const [teachers] = useTeachers();
  const t = teachers.find((x) => x.id === id);
  const sections = t
    ? [
        { title: "JAKĄ PEŁNI FUNKCJĘ", text: t.funkcja, Icon: Briefcase },
        { title: "CO WPROWADZIŁ W SZKOŁĘ", text: t.wprowadzil, Icon: Lightbulb },
        { title: "CELE I PRIORYTETY", text: t.cele, Icon: Target },
        { title: "STYL ZARZĄDZANIA", text: t.styl, Icon: Users },
        { title: "ZALETY", text: t.zalety, Icon: ThumbsUp },
        { title: "WADY", text: t.wady, Icon: ThumbsDown },
        ...t.extra.map((x) => ({ title: x.title.toUpperCase(), text: x.text, Icon: Star })),
      ]
    : [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/" className="btn-ghost-brand inline-flex items-center gap-2 px-4 py-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Strona główna
      </Link>
      {!t ? (
        <p className="mt-10 text-muted-foreground">{teachers.length ? "Nie znaleziono nauczyciela." : "Ładowanie…"}</p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {t.image && <img src={t.image} alt={t.name} loading="lazy" width={816} height={816} className="h-32 w-32 rounded-3xl border border-border object-cover shadow-glow" />}
            <div>
              <h1 className="font-display text-4xl font-black sm:text-5xl">{t.name}</h1>
              <p className="text-muted-foreground">{t.role}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {sections.map(({ title, text, Icon }) => (
              <div key={title} className="card-hover flex gap-5 rounded-3xl border border-border bg-gradient-card p-6">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
                  <Icon className="h-10 w-10" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-accent">{title}</h2>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
