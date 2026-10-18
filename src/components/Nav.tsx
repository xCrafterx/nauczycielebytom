import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

const links = [
  { to: "/", label: "Strona główna" },
  { to: "/administracja", label: "Administracja" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/admin", label: "Logowanie Admina" },
] as const;

export function Nav() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </span>
          Nauczyciele Cosinus
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
