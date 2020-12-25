import { ERouterEvent, TRoute } from "./core/RouterManager";
import { useRouter } from "./useRouter";
import { useLayoutEffect, useState } from "react";

const componentName = "useRoutes";
const debug = require("debug")(`front:${componentName}`);

/**
 * useRoutes
 */
export const useRoutes = (cb?: () => void, dep = []) => {
  const router = useRouter();
  const [previousRoute, setPreviousRoute] = useState<TRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<TRoute>(router.currentRoute);

  const handleCurrentRouteChange = (route: TRoute): void => {
    cb?.();
    setCurrentRoute(route);
  };
  const handlePreviousRouteChange = (route: TRoute): void => {
    setPreviousRoute(route);
  };

  useLayoutEffect(() => {
    router.events.on(ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
    router.events.on(ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
    return () => {
      router.events.off(ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
      router.events.off(ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
    };
  }, dep);

  return {
    previousRoute,
    currentRoute,
    setPreviousRoute,
    setCurrentRoute,
  };
};
