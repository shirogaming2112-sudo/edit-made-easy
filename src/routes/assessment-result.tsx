import { createFileRoute } from "@tanstack/react-router";
import AssessmentResult from "@/pages/AssessmentResult";

export const Route = createFileRoute("/assessment-result")({
  component: AssessmentResult,
});
