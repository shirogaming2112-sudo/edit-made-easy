import { createFileRoute } from "@tanstack/react-router";
import ComplianceDocsUpload from "@/pages/ComplianceDocsUpload";

export const Route = createFileRoute("/compliance-docs-u")({
  component: ComplianceDocsUpload,
});
