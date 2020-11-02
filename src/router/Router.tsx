import RouterManager, { IRoute } from "./RouterManager";
import React, { createContext, ReactElement, useEffect, useState } from "react";

interface IProps {
  base: string;
  routes: IRoute[];
  children: ReactElement;
}

export const RouterContext = createContext(null);
RouterContext.displayName = "RouterContext";

export const Router = (props: IProps) => {
  const [routerManager, setRouterManager] = useState<RouterManager>(
    new RouterManager({
      base: props.base,
      routes: props.routes,
    })
  );
  useEffect(() => {
    if (routerManager != null) return;
    //const instance = );
    //setRouterManager(instance);
  }, []);

  // // add routes to state
  // const [routes, setRoutes] = useState<IRoute[]>([]);
  //
  // // listen popstate
  // useEffect(() => {
  //   const handlePopState = () => {
  //     updateRoute();
  //   };
  //   window.addEventListener("popstate", handlePopState);
  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);
  //
  // /**
  //  * Add new route object to routes array
  //  */
  // const add = (path: string, component, props): void => {
  //   const routeParams: IRoute = {
  //     path,
  //     component,
  //     props,
  //     parser: new Path(path),
  //   };
  //   setRoutes([...routes, routeParams]);
  // };
  //
  // // update current route
  // const updateRoute = (url: string = window.location.pathname) => {};
  //
  // // get route from URL
  // const getRouteFromUrl = () => {};

  return (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );
};
