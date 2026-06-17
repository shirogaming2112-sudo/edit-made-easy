import { createFileRoute } from "@tanstack/react-router";
import DavaoHub from "@/pages/DavaoHub";

export const Route = createFileRoute("/davao-hub")({
  component: DavaoHub,
});
