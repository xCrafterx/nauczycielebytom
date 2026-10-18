import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("cosinus_welcome")) setOpen(true);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-gradient-card p-8 text-center shadow-glow animate-in zoom-in-95">
        <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          Szukamy osób które pomogą nam dać więcej informacji o nauczycielach!
        </p>
        <Link
          to="/kontakt"
          onClick={() => { localStorage.setItem("cosinus_welcome", "1"); setOpen(false); }}
          className="mt-8 flex items-center justify-center gap-3 rounded-2xl border-2 border-accent bg-secondary p-4 font-display text-lg font-bold text-accent transition hover:bg-muted"
        >
          <Mail className="h-5 w-5" /> Kontakt – chcesz pomóc? Napisz do nas!
        </Link>
        <button
          onClick={() => {
            localStorage.setItem("cosinus_welcome", "1");
            setOpen(false);
          }}
          className="btn-brand mt-4 w-full py-4 text-xl"
        >
          OK
        </button>
      </div>
    </div>
  );
}
