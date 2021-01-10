import { RouterManager, TRoute } from "./core/RouterManager";
import React, { createContext, memo, ReactElement, useEffect, useState } from "react";

const componentName = "Router";
const debug = require("debug")(`front:${componentName}`);

interface IProps {
  base: string;
  routes: TRoute[];
  children: ReactElement;
  fakeMode?: boolean;
  id?: number | string;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<RouterManager>(null);
RouterContext.displayName = componentName;

/**
 * Router
 * will wrap Link and Stack components
 */
export const Router = memo((props: IProps) => {
  const [routerManager] = useState<RouterManager>(
    () =>
      new RouterManager({
        base: props.base,
        routes: props.routes,
        fakeMode: props.fakeMode,
        id: props.id,
      })
  );

  useEffect(() => {
    return () => routerManager.destroy();
  }, [routerManager]);

  return (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );
});
Router.displayName = componentName;
