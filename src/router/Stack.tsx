import React, { useLayoutEffect, useMemo, useState } from "react";
import { ERouterEvent } from "./core/RouterManager";
import { TStackTransitionObject } from "./useStackPage";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

export type TManageTransitions = {
  previousPage: TStackTransitionObject;
  currentPage: TStackTransitionObject;
  unmountPreviousPage: () => void;
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
function Stack(props: IProps) {
  const router = useRouter();

  // set number index to component instance
  const [pageIndex, setPageIndex] = useState<number>(0);

  const {
    previousRoute,
    currentRoute,
    setPreviousRoute,
    setCurrentRoute,
  } = useRoutes(() => {
    setPageIndex(pageIndex + 1);
  }, [pageIndex]);

  // const [previousLocalRoute, setPreviousLocalRoute] = useState<TRoute>(null);
  // const [currentLocalRoute, setCurrentLocalRoute] = useState<TRoute>(router.currentRoute);

  // // route object

  // useEffect(()=> {
  //   debug("previousRoute, currentRoute", previousRoute, currentRoute);
  //   setPreviousLocalRoute(previousRoute);
  //   setCurrentLocalRoute(currentRoute);
  // }, [previousRoute, currentRoute])

  // // 1. listen route change
  // useEffect(() => {
  //   // executed when route-change event is call
  //   const handleRouteChange = (routes: {
  //     previousRoute: TRoute;
  //     currentRoute: TRoute;
  //   }): void => {
  //     // increment index for component page instance key
  //     setPageIndex(pageIndex + 1);
  //
  //     debug("emitted route object from route-change event", routes);
  //     setPreviousLocalRoute(routes.previousRoute);
  //     setCurrentLocalRoute(routes.currentRoute);
  //   };
  //   router.events.on(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
  //   return () => {
  //     router.events.off(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
  //   };
  // }, [currentLocalRoute, previousLocalRoute, pageIndex]);

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {
    // emit animating state
    router.events.emit(ERouterEvent.ROUTER_STACK_IS_ANIMATING, true);

    // clear previous route state, will remove element from DOM
    const unmountPreviousPage = () => setPreviousRoute(null);

    props
      .manageTransitions({
        previousPage: router.stackPageTransitions?.[previousRoute?.path],
        currentPage: router.stackPageTransitions?.[currentRoute?.path],
        unmountPreviousPage,
      })
      .then(() => {
        // destroy previous page in case manageTransitions doesn't fired this function
        unmountPreviousPage();
        router.events.emit(ERouterEvent.ROUTER_STACK_IS_ANIMATING, false);
      });
  }, [currentRoute]);

  // 3. prepare components
  // const PreviousRouteComponent: any = useMemo(() => previousRoute?.component, [
  //   previousRoute,
  // ]);
  //
  // const CurrentRouteComponent: any = useMemo(() => currentRoute?.component, [
  //   currentRoute,
  // ]);

  const PreviousRouteComponent: any = previousRoute?.component;
  const CurrentRouteComponent: any = currentRoute?.component;

  return (
    <div className={componentName}>
      {PreviousRouteComponent && (
        <PreviousRouteComponent key={pageIndex - 1} {...(previousRoute?.props || {})} />
      )}
      {CurrentRouteComponent && (
        <CurrentRouteComponent key={pageIndex} {...(currentRoute?.props || {})} />
      )}
    </div>
  );
}

export default React.memo(Stack);
