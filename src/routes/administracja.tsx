import { createFileRoute } from "@tanstack/react-router";
import { AdminCards } from "@/components/AdminCards";

export const Route = createFileRoute("/administracja")({
  head: () => ({
    meta: [
      { title: "Administracja – Nauczyciele Cosinus" },
      { name: "description", content: "Poznaj główną administrację strony Nauczyciele Cosinus." },
      { property: "og:title", content: "Administracja – Nauczyciele Cosinus" },
      { property: "og:description", content: "Poznaj główną administrację strony Nauczyciele Cosinus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminCards,
});
