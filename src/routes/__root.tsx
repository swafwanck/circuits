import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";


import appCss from "../styles.css?url";
// import "@fontsource/poppins/400.css";
// import "@fontsource/poppins/500.css";
// import "@fontsource/poppins/600.css";
// import "@fontsource/poppins/700.css";
// import "@fontsource/poppins/800.css";
import { reportLovableError } from "./../lib/lovable-error-reporting";
import { EnquiryPopup } from "./../components/site/EnquiryPopup";
import { EnquiryProvider } from "./../components/site/EnquiryProvider";
import { FloatingAssist } from "./../components/site/FloatingAssist";
import { NotFoundPage } from "./../components/site/NotFoundPage";
import { PageLoader } from "./../components/site/PageLoader";

function NotFoundComponent() {
  return <NotFoundPage />;
}


function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error as Error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Circuit Travels — Curated Travel Journeys & Worldwide Visa Services" },
      { name: "description", content: "Hand-crafted travel packages to 180+ destinations & seamless visa support for 60+ countries. Luxury travel, made effortless." },
      { property: "og:title", content: "Circuit Travels — Curated Travel Journeys" },
      { property: "og:description", content: "Hand-crafted packages & worldwide visa services in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <EnquiryProvider>
        <PageLoader />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        {!isAdmin && isHome && <EnquiryPopup />}
        {!isAdmin && <FloatingAssist />}
      </EnquiryProvider>
    </QueryClientProvider>
  );
}


