import { ERouterEvent, TRoute } from "./core/RouterManager";
import { useRouter } from "./useRouter";
import { useEffect, useState } from "react";

const componentName = "useRoutes";
const debug = require("debug")(`front:${componentName}`);

export type TRoutesHandles = {
  previousRoute: TRoute;
  currentRoute: TRoute;
};

/**
 * useRoutes
 */
export const useRoutes = (cb?: () => void, dep?: any[]) => {
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
      cb?.();
      debug("emitted route object from route-change event", routes);
    };
    router.events.on(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    return () => {
      router.events.off(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    };
  }, [currentRoute, previousRoute, ...(dep || [])]);

  return {
    previousRoute,
    currentRoute,
    setPreviousRoute,
    setCurrentRoute,
  };
};
