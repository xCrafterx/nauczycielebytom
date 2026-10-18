import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  sprawa: z.string().min(3).max(2000),
  osoby: z
    .array(z.object({ name: z.string().max(200), role: z.string().max(300), info: z.string().max(2000) }))
    .max(60),
});

export const znajdzOsobe = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { error: "Brak konfiguracji AI." };
    const lista = data.osoby.map((o, i) => `${i + 1}. ${o.name} (${o.role}): ${o.info}`).join("\n");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "Jesteś pomocnikiem szkoły Cosinus w Bytomiu. Na podstawie listy osób (nauczyciele i administracja strony) wskaż 1–2 najbardziej odpowiednie osoby do sprawy użytkownika. Korzystaj wyłącznie z podanych informacji. Odpowiedz krótko po polsku: kogo wybrać i dlaczego (1–2 zdania). Jeśli sprawa dotyczy strony internetowej, wskaż administrację. Jeśli nikt nie pasuje, poleć stronę Kontakt. Pisz zwykłym tekstem, bez markdown i gwiazdek.",
        input: `Osoby:\n${lista}\n\nSprawa użytkownika:\n${data.sprawa}`,
      }),
    });
    if (!res.ok || !res.body) {
      if (res.status === 429) return { error: "Za dużo zapytań, spróbuj za chwilę." };
      if (res.status === 402) return { error: "Skończyły się środki na AI." };
      return { error: "Nie udało się uzyskać odpowiedzi." };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        try {
          const ev = JSON.parse(l.slice(5).trim());
          if (ev.type === "response.output_text.delta") text += ev.delta;
        } catch { /* ignore */ }
      }
    }
    return text.trim() ? { answer: text.trim() } : { error: "Brak odpowiedzi." };
  });
