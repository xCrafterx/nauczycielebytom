import { Link } from "@tanstack/react-router";
import { Cpu, Sigma } from "lucide-react";
import { useAdmins } from "@/lib/store";
import oliwia from "@/assets/admin-oliwia.jpg";
import tymek from "@/assets/admin-tymek.jpg";
import pomocnik from "@/assets/admin-pomocnik.jpg";
const defaultImg: Record<string, string> = { oliwia, tymek, pomocnik };

export function AdminCards() {
  const [admins] = useAdmins();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center font-display text-4xl font-bold text-gradient">ADMINISTRACJA</h2>
      <p className="mt-2 text-center text-muted-foreground">POZNAJ GŁÓWNĄ ADMINISTRACJĘ!</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {admins.map((a) => {
          const helper = a.id === "pomocnik";
          const inner = (
            <div className="card-hover flex h-full flex-col items-center rounded-3xl border border-border bg-gradient-card p-6 text-center">
              <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-2xl bg-gradient-brand shadow-glow">
                {(a.image || defaultImg[a.id]) ? (
                  <img src={a.image || defaultImg[a.id]} loading="lazy" alt={a.name} className="h-full w-full object-cover" />
                ) : helper ? (
                  <Sigma className="h-14 w-14" />
                ) : (
                  <div className="flex flex-col items-center"><Cpu className="h-10 w-10" /><span className="font-display font-black">{a.desc}</span></div>
                )}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{a.name}</h3>
              <p className={helper ? "mt-1 font-bold tracking-widest text-accent" : "mt-1 text-muted-foreground"}>{a.role}</p>
            </div>
          );
          return helper ? <Link key={a.id} to="/kontakt">{inner}</Link> : <div key={a.id}>{inner}</div>;
        })}
      </div>
    </section>
  );
}
