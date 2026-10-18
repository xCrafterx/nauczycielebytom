import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, LogOut, TriangleAlert, Eye, EyeOff } from "lucide-react";
import { ADMIN_EMAIL, useAdmins, useTeachers, type Teacher } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import comingSoonImg from "@/assets/coming-soon.jpg";
import { Button } from "@/components/ui/button";
import { useContactOutage } from "@/lib/contact-outage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admina – Nauczyciele Cosinus" },
      { name: "description", content: "Logowanie i panel administratora." },
      { property: "og:title", content: "Panel Admina – Nauczyciele Cosinus" },
      { property: "og:description", content: "Logowanie i panel administratora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const inputCls = "w-full rounded-xl border border-input bg-input/40 px-3 py-2 text-sm outline-none focus:border-ring";

type State = "loading" | "out" | "noadmin" | "admin";

function AdminPage() {
  const [state, setState] = useState<State>("loading");
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setState("out");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setState(data ? "admin" : "noadmin");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") setTimeout(check, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const logout = () => supabase.auth.signOut();
  if (state === "loading") return <div className="danger-bg min-h-[80vh]" />;
  if (state === "admin") return <Panel onLogout={logout} />;
  return <Login noAdmin={state === "noadmin"} onLogout={logout} />;
}

function Danger() {
  return (
    <>
      {Array.from({ length: 28 }, (_, i) => (
        <span key={`d${i}`} className="danger-dot" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i % 7) * 0.25}s`, width: 6 + (i % 4) * 4, height: 6 + (i % 4) * 4 }} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <span key={`e${i}`} className="danger-bang" style={{ left: `${(i * 29 + 7) % 96}%`, top: `${(i * 41 + 11) % 92}%`, animationDelay: `${(i % 5) * 0.3}s`, fontSize: 28 + (i % 3) * 14 }}>!</span>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <span key={`w${i}`} className="danger-warn" style={{ left: `${(i * 23 + 15) % 94}%`, top: `${(i * 61 + 5) % 90}%`, animationDelay: `${(i % 4) * 0.4}s` }}>
          <TriangleAlert style={{ width: 30 + (i % 3) * 12, height: 30 + (i % 3) * 12 }} />
          {i % 2 === 0 && <span className="text-xs font-black tracking-widest">UWAGA</span>}
        </span>
      ))}
    </>
  );
}

function Login({ noAdmin, onLogout }: { noAdmin: boolean; onLogout: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const signIn = async () => {
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    setBusy(false);
    if (error) setMsg("Nieprawidłowy email lub hasło (albo konto nie jest jeszcze potwierdzone).");
  };
  const signUp = async () => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) return setMsg("Konto admina można założyć tylko na adres właściciela.");
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.signUp({ email: email.trim(), password: pass, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    setMsg(error ? error.message : "Sprawdź skrzynkę email i kliknij link potwierdzający, potem zaloguj się.");
  };
  return (
    <div className="danger-bg relative grid min-h-[80vh] place-items-center overflow-hidden px-4">
      <Danger />
      <form
        onSubmit={(e) => { e.preventDefault(); signIn(); }}
        className="danger-box relative z-10 w-full max-w-sm space-y-4 rounded-3xl bg-gradient-card p-8"
      >
        <p className="text-xs font-black tracking-[0.3em] text-destructive">⚠ STREFA ZASTRZEŻONA ⚠</p>
        <h1 className="font-display text-2xl font-bold">Logowanie Admina</h1>
        <p className="text-sm text-muted-foreground">Nieuprawnionym wstęp wzbroniony.</p>
        {noAdmin ? (
          <>
            <p className="text-sm text-destructive">To konto nie ma uprawnień admina.</p>
            <button type="button" onClick={onLogout} className="btn-ghost-brand w-full py-3">Wyloguj</button>
          </>
        ) : (
          <>
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={inputCls} type="password" placeholder="Hasło" minLength={6} value={pass} onChange={(e) => setPass(e.target.value)} />
            {msg && <p className="text-sm text-destructive">{msg}</p>}
            <button disabled={busy} className="btn-brand w-full py-3">Zaloguj</button>
            <button type="button" disabled={busy} onClick={signUp} className="w-full text-xs text-muted-foreground underline">Pierwsze uruchomienie? Załóż konto admina</button>
          </>
        )}
      </form>
    </div>
  );
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"t" | "a" | "awarie">("t");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Panel Admina</h1>
        <button onClick={onLogout} className="btn-ghost-brand inline-flex items-center gap-2 px-4 py-2 text-sm"><LogOut className="h-4 w-4" />Wyloguj</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {([["t", "Edycja Nauczycieli"], ["a", "Edycja Administracji"], ["awarie", "Awarie"]] as const).map(([k, l]) => (
          <Button key={k} onClick={() => setTab(k)} variant={tab === k ? "default" : "secondary"} aria-pressed={tab === k}>{l}</Button>
        ))}
      </div>
      {tab === "t" ? <TeachersEditor /> : tab === "a" ? <AdminsEditor /> : <OutageEditor />}
    </div>
  );
}

function OutageEditor() {
  const { data: visible, isPending, isError, save, refetch } = useContactOutage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const toggle = async () => {
    if (visible === undefined) return;
    setBusy(true);
    setError("");
    try { await save(!visible); }
    catch { setError("Nie udało się zapisać zmiany. Spróbuj ponownie."); }
    finally { setBusy(false); }
  };
  return (
    <section className="mt-8 space-y-4">
      <h2 className="font-display text-2xl font-bold">Awarie</h2>
      <p className="font-semibold">Komunikat awarii formularza</p>
      <p className="text-muted-foreground" role="status">{isPending ? "Ładowanie…" : isError ? "Nie udało się odczytać stanu." : visible ? "Komunikat widoczny" : "Komunikat ukryty"}</p>
      {isError ? <Button variant="secondary" onClick={() => refetch()}>Spróbuj ponownie</Button> : (
        <Button onClick={toggle} disabled={busy || isPending} aria-pressed={visible ?? false}>
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{busy ? "Zapisywanie…" : visible ? "Ukryj" : "Pokaż"}
        </Button>
      )}
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </section>
  );
}

const fields: [keyof Teacher, string, boolean][] = [
  ["name", "Imię i nazwisko", false],
  ["role", "Stanowisko / przedmiot", false],
  ["funkcja", "Jaką pełni funkcję", true],
  ["wprowadzil", "Co wprowadził w szkołę", true],
  ["cele", "Cele i priorytety", true],
  ["styl", "Styl zarządzania", true],
  ["zalety", "Zalety", true],
  ["wady", "Wady", true],
];

function TeachersEditor() {
  const [list, setList] = useTeachers();
  const [open, setOpen] = useState<string | null>(null);
  const update = (id: string, k: keyof Teacher, v: string) => setList(list.map((t) => (t.id === id ? { ...t, [k]: v } : t)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const c = [...list];
    const tmp = c[i]!;
    c[i] = c[j]!;
    c[j] = tmp;
    setList(c);
  };
  const add = () => {
    const id = `t${Date.now()}`;
    setList([...list, { id, name: "Nowy nauczyciel", role: "xxx", funkcja: "", wprowadzil: "", cele: "", styl: "", wady: "", zalety: "", extra: [] }]);
    setOpen(id);
  };
  const addComingSoon = () => {
    const id = `t${Date.now()}`;
    setList([...list, { id, name: "xxx", role: "???", funkcja: "", wprowadzil: "", cele: "", styl: "", wady: "", zalety: "", extra: [], image: comingSoonImg }]);
    setOpen(id);
  };
  const addTile = (id: string) =>
    setList(list.map((t) => (t.id === id ? { ...t, extra: [...t.extra, { id: `x${Date.now()}`, title: "Nowy kafelek", text: "" }] } : t)));
  const updateTile = (id: string, tileId: string, k: "title" | "text", v: string) =>
    setList(list.map((t) => (t.id === id ? { ...t, extra: t.extra.map((x) => (x.id === tileId ? { ...x, [k]: v } : x)) } : t)));
  const removeTile = (id: string, tileId: string) =>
    setList(list.map((t) => (t.id === id ? { ...t, extra: t.extra.filter((x) => x.id !== tileId) } : t)));
  return (
    <div className="mt-6 space-y-3">
      {list.map((t, i) => (
        <div key={t.id} className="rounded-2xl border border-border bg-gradient-card p-4">
          <div className="flex items-center gap-2">
            <button className="min-w-0 flex-1 truncate text-left font-semibold" onClick={() => setOpen(open === t.id ? null : t.id)}>
              {i + 1}. {t.name} <span className="text-muted-foreground">– {t.role}</span>
            </button>
            <button aria-label="W górę" onClick={() => move(i, -1)} className="btn-ghost-brand p-2"><ArrowUp className="h-4 w-4" /></button>
            <button aria-label="W dół" onClick={() => move(i, 1)} className="btn-ghost-brand p-2"><ArrowDown className="h-4 w-4" /></button>
            <button aria-label="Usuń" onClick={() => confirm(`Usunąć ${t.name}?`) && setList(list.filter((x) => x.id !== t.id))} className="rounded-xl p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
          </div>
          {open === t.id && (
            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-4">
                {t.image && <img src={t.image} alt={t.name} className="h-24 w-24 rounded-xl object-cover" />}
                <label className="block text-sm text-muted-foreground">
                  Zdjęcie nauczyciela
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-xs"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = () => update(t.id, "image", r.result as string);
                      r.readAsDataURL(f);
                    }}
                  />
                </label>
                {t.image && <button onClick={() => update(t.id, "image", "")} className="text-xs text-destructive">Usuń zdjęcie</button>}
              </div>
              {fields.map(([k, label, area]) => (
                <label key={k} className="text-sm text-muted-foreground">
                  {label}
                  {area ? (
                    <textarea rows={3} className={inputCls} value={t[k] as string} onChange={(e) => update(t.id, k, e.target.value)} />
                  ) : (
                    <input className={inputCls} value={t[k] as string} onChange={(e) => update(t.id, k, e.target.value)} />
                  )}
                </label>
              ))}
              <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
                <p className="text-sm font-semibold">Dodatkowe kafelki ({t.extra.length})</p>
                {t.extra.map((x) => (
                  <div key={x.id} className="space-y-2 rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2">
                      <input className={inputCls} value={x.title} placeholder="Tytuł kafelka" onChange={(e) => updateTile(t.id, x.id, "title", e.target.value)} />
                      <button aria-label="Usuń kafelek" onClick={() => removeTile(t.id, x.id)} className="rounded-xl p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <textarea rows={2} className={inputCls} value={x.text} placeholder="Treść kafelka" onChange={(e) => updateTile(t.id, x.id, "text", e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addTile(t.id)} className="btn-ghost-brand inline-flex items-center gap-2 px-3 py-2 text-sm"><Plus className="h-4 w-4" />Dodaj kafelek</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button onClick={add} className="btn-brand inline-flex items-center gap-2 px-4 py-2"><Plus className="h-4 w-4" />Dodaj nauczyciela</button>
        <button onClick={addComingSoon} className="btn-ghost-brand inline-flex items-center gap-2 px-4 py-2"><Plus className="h-4 w-4" />Dodaj „coming soon"</button>
      </div>
    </div>
  );
}

function AdminsEditor() {
  const [list, setList] = useAdmins();
  const update = (id: string, patch: object) => setList(list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {list.map((a) => (
        <div key={a.id} className="space-y-3 rounded-2xl border border-border bg-gradient-card p-4">
          {a.image && <img src={a.image} alt={a.name} className="h-24 w-24 rounded-xl object-cover" />}
          <input className={inputCls} value={a.name} onChange={(e) => update(a.id, { name: e.target.value })} placeholder="Imię" />
          <input className={inputCls} value={a.role} onChange={(e) => update(a.id, { role: e.target.value })} placeholder="Stanowisko" />
          <textarea rows={2} className={inputCls} value={a.desc} onChange={(e) => update(a.id, { desc: e.target.value })} placeholder="Opis / logo" />
          <label className="block text-sm text-muted-foreground">
            Zdjęcie / logo
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-xs"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => update(a.id, { image: r.result as string });
                r.readAsDataURL(f);
              }}
            />
          </label>
          {a.image && <button onClick={() => update(a.id, { image: undefined })} className="text-xs text-destructive">Usuń zdjęcie</button>}
        </div>
      ))}
    </div>
  );
}
