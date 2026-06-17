import { createFileRoute } from "@tanstack/react-router";
import Source from "@/pages/Source";

export const Route = createFileRoute("/source/$name")({
  component: Source,
});
