import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound, Crown } from "lucide-react";
import { useTeachers } from "@/lib/store";
import dyrektorImg from "@/assets/dyrektor.jpg";
import { WelcomeModal } from "@/components/WelcomeModal";
import { AdminCards } from "@/components/AdminCards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nauczyciele Cosinus – Bytom" },
      { name: "description", content: "Poznaj nauczycieli szkoły Cosinus w Bytomiu." },
      { property: "og:title", content: "Nauczyciele Cosinus – Bytom" },
      { property: "og:description", content: "Poznaj nauczycieli szkoły Cosinus w Bytomiu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [teachers] = useTeachers();
  return (
    <>
      <WelcomeModal />
      <section className="mx-auto max-w-7xl px-4 pt-16 text-center">
        <h1 className="font-display text-4xl font-black sm:text-6xl">
          Poznaj nauczycieli <span className="text-gradient">Cosinus</span>
        </h1>
        <p className="mt-4 text-muted-foreground">Wybierz nauczyciela, aby dowiedzieć się więcej.</p>
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {teachers.map((t, i) => (
          <div key={t.id} className="card-hover flex flex-col rounded-3xl border border-border bg-gradient-card p-5 text-center">
            <h3 className="truncate font-display text-lg font-bold sm:text-xl">{t.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{t.role}</p>
            <div className="mx-auto my-5 grid aspect-square w-2/3 place-items-center overflow-hidden rounded-2xl bg-gradient-brand shadow-glow">
              {t.image ? <img src={t.image} alt={t.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover" /> : t.id === "t1" ? <img src={dyrektorImg} alt={t.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover" /> : i === 0 ? <Crown className="h-1/2 w-1/2" /> : <UserRound className="h-1/2 w-1/2" />}
            </div>
            <Link to="/nauczyciel/$id" params={{ id: t.id }} className="btn-brand mt-auto py-2.5 text-sm">
              WYBIERAM
            </Link>
          </div>
        ))}
      </section>
      <AdminCards />
    </>
  );
}
