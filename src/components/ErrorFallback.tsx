import { ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error;
  info?: ErrorInfo | null;
  onReset?: () => void;
}

const WIZARD_STATE_KEY = "cb_wizard_state_v1";

const ErrorFallback = ({ error, info, onReset }: Props) => {
  const handleReload = () => window.location.reload();
  const handleHome = () => {
    try {
      sessionStorage.removeItem(WIZARD_STATE_KEY);
    } catch {
      /* ignore */
    }
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="max-w-lg w-full bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          We hit an unexpected error. Your progress is saved — try reloading
          the page, or head back to the welcome screen.
        </p>

        {import.meta.env.DEV && (
          <details className="text-left mb-6 bg-muted rounded-lg p-3 text-xs">
            <summary className="cursor-pointer font-medium text-foreground">
              Error details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words text-muted-foreground">
              {error.message}
              {info?.componentStack ? `\n${info.componentStack}` : ""}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={handleReload} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Reload page
          </Button>
          <Button variant="outline" onClick={handleHome} className="gap-2">
            <Home className="h-4 w-4" /> Back to Welcome
          </Button>
          {onReset && (
            <Button variant="ghost" onClick={onReset}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
