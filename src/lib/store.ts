import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExtraTile = { id: string; title: string; text: string };

export type Teacher = {
  id: string;
  name: string;
  role: string;
  funkcja: string;
  wprowadzil: string;
  cele: string;
  styl: string;
  wady: string;
  zalety: string;
  extra: ExtraTile[];
  image?: string | undefined;
};

export type AdminPerson = {
  id: string;
  name: string;
  role: string;
  desc: string;
  image?: string | undefined;
};

export const ADMIN_EMAIL = "tymek2008@protonmail.com";

// Shared, database-backed lists. Every save writes to the database so all browsers see it.
export function useTeachers() {
  const [list, setList] = useState<Teacher[]>([]);
  useEffect(() => {
    supabase.from("teachers").select("*").order("position").then(({ data }) => {
      if (data) setList(data.map(({ id, name, role, funkcja, wprowadzil, cele, styl, wady, zalety, extra, image }) => ({ id, name, role, funkcja, wprowadzil, cele, styl, wady, zalety, extra: (extra as ExtraTile[]) ?? [], image: image ?? undefined })));
    });
  }, []);
  const save = async (next: Teacher[]) => {
    const removed = list.filter((t) => !next.some((n) => n.id === t.id)).map((t) => t.id);
    setList(next);
    if (removed.length) await supabase.from("teachers").delete().in("id", removed);
    const { error } = await supabase.from("teachers").upsert(next.map((t, i) => ({ ...t, image: t.image ?? null, position: i + 1 })));
    if (error) alert("Nie udało się zapisać: " + error.message);
  };
  return [list, save] as const;
}

export function useAdmins() {
  const [list, setList] = useState<AdminPerson[]>([]);
  useEffect(() => {
    supabase.from("admins").select("*").order("position").then(({ data }) => {
      if (data) setList(data.map((a) => ({ id: a.id, name: a.name, role: a.role, desc: a.descr, image: a.image ?? undefined })));
    });
  }, []);
  const save = async (next: AdminPerson[]) => {
    setList(next);
    const { error } = await supabase
      .from("admins")
      .upsert(next.map((a, i) => ({ id: a.id, position: i + 1, name: a.name, role: a.role, descr: a.desc, image: a.image ?? null })));
    if (error) alert("Nie udało się zapisać: " + error.message);
  };
  return [list, save] as const;
}

// Shared "Awarie" switch: when on, the contact page warns that the form is down.
export function useFormOutage() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    supabase.from("site_settings").select("form_outage").eq("id", "main").maybeSingle().then(({ data }) => {
      if (data) setOn(data.form_outage);
    });
  }, []);
  const save = async (next: boolean) => {
    setOn(next);
    const { error } = await supabase.from("site_settings").upsert({ id: "main", form_outage: next });
    if (error) {
      setOn(!next);
      alert("Nie udało się zapisać: " + error.message);
    }
  };
  return [on, save] as const;
}
