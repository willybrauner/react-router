import RouterManager, { TRoute } from "./RouterManager";
import React, { createContext, memo, ReactElement, useState } from "react";
import RoutersWrapper from "./RoutersWrapper";

interface IProps {
  base: string;
  routes: TRoute[];
  children: ReactElement;
  fakeRouting?: boolean;
  id?: number | string;
  subRouter?: boolean;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<RouterManager>(null);
RouterContext.displayName = "RouterContext";

// If is 1st level router, we add wrapper provider instance
export const RoutersContext = createContext<typeof RoutersWrapper>(null);
RoutersContext.displayName = "RoutersContext";

/**
 * Router
 * will wrap Link and Stack components
 */

const Router = (props: IProps) => {
  const [routerManager] = useState<RouterManager>(
    () => new RouterManager(props.base, props.routes, props.fakeRouting, props.id)
  );

  const routerRender = (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );

  return props.subRouter ? (
    routerRender
  ) : (
    // 1st level
    <RoutersContext.Provider value={RoutersWrapper}>
      {routerRender}
    </RoutersContext.Provider>
  );
};

export default memo(Router);
