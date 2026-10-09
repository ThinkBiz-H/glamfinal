import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // React Query's own defaults (staleTime: 0, refetchOnWindowFocus:
        // true) mean every remount and every tab focus re-fires every
        // query on the page — for mostly-static catalog/home data this
        // reads as duplicate network calls for no visible benefit.
        // Mutations (booking, address, profile, cart) already invalidate
        // their specific queries explicitly, so this doesn't risk stale
        // data after a real change — it only avoids redundant refetches
        // of data nothing has touched.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
