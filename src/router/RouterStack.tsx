import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ERouterEvent, IRoute } from "./RouterManager";
import { pageTransition, TPageTransitionObject } from "./usePageTransition";
import { RouterContext } from "./Router";

export type TManageTransitions = {
  previousPage: TPageTransitionObject;
  currentPage: TPageTransitionObject;
  destroyPreviousPageComponent: () => void;
};

interface IProps {
  className?: string;
  manageTransitions: (T: TManageTransitions) => Promise<any>;
}

const componentName = "RouterStack";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name RouterStack
 */
function RouterStack(props: IProps) {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const routerContext = useContext(RouterContext);
  debug("routerInstance", routerContext);

  // route object
  const [previousRoute, setPreviousRoute] = useState<IRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<IRoute>(
    routerContext.currentRoute
  );

  // 1. listen route change
  useEffect(() => {
    // executed when route-change event is call
    const handleRouteChange = (routes: {
      previousRoute: IRoute;
      currentRoute: IRoute;
    }): void => {
      // increment index for component page instance key
      setPageIndex(pageIndex + 1);

      debug("emitted route object from route-change event", routes);
      setPreviousRoute(routes.previousRoute);
      setCurrentRoute(routes.currentRoute);
    };
    routerContext.events.on(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    return () => {
      routerContext.events.off(ERouterEvent.ROUTE_CHANGE, handleRouteChange);
    };
  }, [currentRoute, previousRoute, pageIndex]);

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid a "clip"
  useLayoutEffect(() => {
    // emit animating state
    routerContext.events.emit(ERouterEvent.ROUTER_STACK_IS_ANIMATING, true);

    // clear previous route state, will remove element from DOM
    const destroyPreviousPageComponent = () => setPreviousRoute(null);

    props
      .manageTransitions({
        previousPage: pageTransition.list?.[previousRoute?.path],
        currentPage: pageTransition.list?.[currentRoute?.path],
        destroyPreviousPageComponent,
      })
      .then(() => {
        routerContext.events.emit(
          ERouterEvent.ROUTER_STACK_IS_ANIMATING,
          false
        );
      });
  }, [currentRoute]);

  // 3. prepare components
  const PreviousRouteComponent: any = useMemo(() => previousRoute?.component, [
    previousRoute,
  ]);
  const CurrentRouteComponent: any = useMemo(() => currentRoute?.component, [
    currentRoute,
  ]);

  return (
    <div className={componentName}>
      {PreviousRouteComponent && (
        <PreviousRouteComponent
          key={pageIndex - 1}
          {...(previousRoute?.props || {})}
        />
      )}
      {CurrentRouteComponent && (
        <CurrentRouteComponent
          key={pageIndex}
          {...(currentRoute?.props || {})}
        />
      )}
    </div>
  );
}

export default RouterStack;
