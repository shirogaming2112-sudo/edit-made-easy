import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./styles.css";

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    // eslint-disable-next-line no-console
    console.error("[global error]", e.error ?? e.message);
  });
  window.addEventListener("unhandledrejection", (e) => {
    // eslint-disable-next-line no-console
    console.error("[unhandled rejection]", e.reason);
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
