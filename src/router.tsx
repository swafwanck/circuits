import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { NotFoundPage } from "./components/site/NotFoundPage";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultNotFoundComponent: NotFoundPage,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
