import React, { useLayoutEffect, useRef, useState } from "react";
import { TStackTransitionObject } from "./useStack";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";
import { ERouterEvent, TRoute } from "./core/RouterManager";

export type TManageTransitions = {
  previousPage: TStackTransitionObject;
  currentPage: TStackTransitionObject;
  unmountPrev: () => void;
  mountCurrent: any;
};

interface IProps {
  className?: string;
  manageTransitions: (T: TManageTransitions) => Promise<any>;
}

const componentName = "Stack";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name Stack
 */
// prettier-ignore
function Stack(props: IProps) {
  // get current router instance
  const router = useRouter();

  // set number index to component instance
  const [index, setIndex] = useState<number>(0);

  // 1 get routes
  const [previousRoute, setPreviousRoute] = useState<TRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<TRoute>(router.currentRoute);

  const handleCurrentRouteChange = (route: TRoute): void => {
    setIndex(index+1)
    setCurrentRoute(route);
  };
  const handlePreviousRouteChange = (route: TRoute): void => {
    debug('pass la dedans');
    setPreviousRoute(route);
  };

  useLayoutEffect(() => {
    router.events.on(ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
    router.events.on(ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
    return () => {
      router.events.off(ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
      router.events.off(ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
    };
  }, [index]);

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {

    const pageTransitions  = router.stackPageTransitions;

    debug("oldPage Transition", pageTransitions?.[previousRoute?.path])

    props.manageTransitions({
      previousPage: pageTransitions?.[previousRoute?.path],
      currentPage: pageTransitions?.[currentRoute?.path],
      mountCurrent: () => {
        //setCurrent(currentRoute);
      },
      unmountPrev: () => {
      }
    }).then(() => {
      debug('manageTransitions promise resolve');
        setPreviousRoute(null);
    })
    
  }, [currentRoute]);


  return (
    <div className={componentName}>
      {previousRoute?.component && (
        <previousRoute.component
          key={index - 1}
          {...(previousRoute.props || {})}
        />
      )}
      {currentRoute?.component && (
        <currentRoute.component
          key={index}
          {...(currentRoute.props || {})}
        />
      )}
    </div>
  );
}

export default Stack;
