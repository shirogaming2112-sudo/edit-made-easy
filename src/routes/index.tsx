import { createFileRoute } from "@tanstack/react-router";
import IndexPage from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyberbacker Application" },
      { name: "description", content: "Apply to join the Cyberbacker team." },
    ],
  }),
  component: IndexPage,
});
