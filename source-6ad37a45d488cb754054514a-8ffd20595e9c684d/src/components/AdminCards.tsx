import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, Sigma } from "lucide-react";
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
              {helper && (
                <span className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-linear-to-r from-red-700 via-red-600 to-red-700 px-6 py-3 font-display text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0 motion-reduce:transform-none">
                  Zgłoś Się
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                </span>
              )}
            </div>
          );
          return helper ? <Link key={a.id} to="/kontakt" className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background">{inner}</Link> : <div key={a.id}>{inner}</div>;
        })}
      </div>
    </section>
  );
}
