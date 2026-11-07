import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

export function PageLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isLoading) {
      t = setTimeout(() => setVisible(true), 120);
    } else {
      setVisible(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 rounded-full border-4 border-secondary" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
          <span className="absolute inset-0 grid place-items-center">
            <Plane className="h-7 w-7 text-primary animate-pulse" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-display text-sm font-bold tracking-wide text-ocean-deep">
            Circuit Travels
          </p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-sunset animate-bounce [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-coral animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
