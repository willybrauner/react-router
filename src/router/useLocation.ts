import { useRouter } from "./useRouter";
import { useEffect, useState } from "react";
import { ERouterEvent, TRoute } from "./core/RouterManager";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  const { previousRoute, currentRoute } = useRoutes();
  return [currentRoute?.path, (url) => router.updateRoute(url)];
};

/**
 * Use routes
 */
export type TRoutesHandles = {
  previousRoute: TRoute;
  currentRoute: TRoute;
};

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
