import RouterManager, { TRoute } from "./core/RouterManager";
import React, { createContext, memo, ReactElement, useState } from "react";

interface IProps {
  base: string;
  routes: TRoute[];
  children: ReactElement;
  fakeMode?: boolean;
  id?: number | string;
  subRouter?: boolean;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<RouterManager>(null);
RouterContext.displayName = "Router";

/**
 * Router
 * will wrap Link and Stack components
 */
const Router = (props: IProps) => {
  const [routerManager] = useState<RouterManager>(
    () =>
      new RouterManager({
        base: props.base,
        routes: props.routes,
        fakeMode: props.fakeMode,
        id: props.id,
      })
  );

  return (
    <RouterContext.Provider value={routerManager}>
      {props.children}
    </RouterContext.Provider>
  );
};

export default memo(Router);
