import RouterManager, { IRoute } from "./RouterManager";
import React, { createContext, ReactElement, useEffect, useState } from "react";
import { Path } from "path-parser";

interface IProps {
  base: string;
  routes: IRoute[];
  children: ReactElement;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<RouterManager>(null);
RouterContext.displayName = "RouterContext";

/**
 * Router
 * Wrap Link and Stack component with this Router component
 * @param {IProps} props
 */
export const Router = (props: IProps) => {
  const [routerManager] = useState<RouterManager>(
    () =>
      new RouterManager({
        base: props.base,
        routes: props.routes,
      })
  );

  // add routes to state
  const [routes, setRoutes] = useState<IRoute[]>([]);

  // listen popstate
  useEffect(() => {
    const handlePopState = () => {
      updateRoute();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /**
   * Add new route object to routes array
   */
  const add = (path: string, component, props): void => {
    const routeParams: IRoute = {
      path,
      component,
      props,
      parser: new Path(path),
    };
    setRoutes([...routes, routeParams]);
  };

  // update current route
  const updateRoute = (url: string = window.location.pathname) => {};

  // get route from URL
  const getRouteFromUrl = () => {};

  return (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );
};
