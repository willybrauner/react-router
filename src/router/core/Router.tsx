import RouterManager, { TRoute } from "./RouterManager";
import React, { createContext, ReactElement, useState } from "react";

interface IProps {
  base: string;
  routes: TRoute[];
  fakeRouting?: boolean;
  children: ReactElement;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<RouterManager>(null);
RouterContext.displayName = "RouterContext";

/**
 * Router
 * will wrap Link and Stack components
 */
const Router = (props: IProps) => {
  const [routerManager] = useState<RouterManager>(
    () => new RouterManager(props.base, props.routes, props.fakeRouting || false)
  );

  return (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );
};

export default Router;
