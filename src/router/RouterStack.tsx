import React, { useEffect, useRef, useState } from "react";
import Router, { ERouterEvent, IRoute } from "./Router";
import { pageTransition, TPageTransitionObject } from "./usePageTransition";
import { routerInstance } from "../index";

// prettier-ignore
export type TManageTransitions = {
  (pOldPage: TPageTransitionObject, pNewPage: TPageTransitionObject): Promise<any>;
}

interface IProps {
  className?: string;
  routerInstance: Router;
  manageTransitions: TManageTransitions;
}

const componentName = "RouterStack";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name RouterStack
 */
function RouterStack(props: IProps) {
  // page transition object
  const oldPageTransition = useRef<TPageTransitionObject>(null);
  const currentPageTransition = useRef<TPageTransitionObject>(null);

  // route object
  const [previousRoute, setPreviousRoute] = useState<IRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<IRoute>(
    props.routerInstance.currentRoute
  );

  useEffect(() => {
    const handleRouteChange = async (route: IRoute) => {
      debug("get emitted route object from route-change event ", route);
      setPreviousRoute(currentRoute);
      setCurrentRoute(route);

      // get page transition
      oldPageTransition.current =
        pageTransition.list?.[routerInstance.previousRoute.path];
      currentPageTransition.current =
        pageTransition.list?.[routerInstance.currentRoute.path];

      debug(
        "handleRouteChange > oldPageTransition.current",
        oldPageTransition.current
      );
      debug(
        "handleRouteChange > currentPageTransition.current",
        currentPageTransition.current
      );

      await props.manageTransitions(
        oldPageTransition.current,
        currentPageTransition.current
      );

      setPreviousRoute(null);
    };
    props.routerInstance.events.on(
      ERouterEvent.ROUTE_CHANGE,
      handleRouteChange
    );
    return () => {
      props.routerInstance.events.off(
        ERouterEvent.ROUTE_CHANGE,
        handleRouteChange
      );
    };
  }, [currentRoute]);

  const PreviousRouteComponent: any = previousRoute?.component;
  const CurrentRouteComponent: any = currentRoute?.component;

  return (
    <div className={componentName}>
      {PreviousRouteComponent && (
        <PreviousRouteComponent {...(currentRoute?.props || {})} />
      )}
      {CurrentRouteComponent && (
        <CurrentRouteComponent {...(currentRoute?.props || {})} />
      )}
    </div>
  );
}

export default RouterStack;
