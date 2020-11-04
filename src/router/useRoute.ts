import { ERouterEvent, TRoute } from "./core/RouterManager";
import { useRouter } from "./useRouter";
import { useEffect, useState } from "react";

export type TRoutesHandles = {
  previousRoute: TRoute;
  currentRoute: TRoute;
};

/**
 * useRoutes
 */
export const useRoutes = (): TRoutesHandles => {
  const router = useRouter();
  const [previousRoute, setPreviousRoute] = useState<TRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<TRoute>(router.currentRoute);

  useEffect(() => {
    const handleRouteChange = (routes: {
      previousRoute: TRoute;
      currentRoute: TRoute;
    }): void => {
      setPreviousRoute(routes.previousRoute);
      setCurrentRoute(routes.currentRoute);
    };
    router.events.on(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    return () => {
      router.events.off(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    };
  }, [currentRoute, previousRoute]);

  return {
    previousRoute,
    currentRoute,
  };
};
