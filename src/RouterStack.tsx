import React, { useEffect, useState } from "react";
import Router, { ERouterEvent, IRoute } from "./Router";

interface IProps {
  classNames?: string[];
  router: Router;
}

const componentName = "RouterStack";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name RouterStack
 */
function RouterStack(props: IProps) {
  const [previousRoute, setPreviousRoute] = useState<IRoute>(null);
  const [currentRoute, setCurrentRoute] = useState<IRoute>(null);

  useEffect(() => {
    const handler = (route: IRoute) => {
      debug("!!!! passe dans event emitter");
      setPreviousRoute(currentRoute);
      setCurrentRoute(route);
    };
    debug("currentRoute", currentRoute);

    props.router.events.on(ERouterEvent.ROUTE_CHANGE, handler);
    return () => {
      props.router.events.off(ERouterEvent.ROUTE_CHANGE, handler);
    };
  }, [currentRoute]);

  const PreviousRouteEl: any = previousRoute?.component;
  const CurrentRouteEl: any = currentRoute?.component;

  return (
    <div className={componentName}>
      {/*{PreviousRouteEl && <PreviousRouteEl {...(currentRoute?.props || {})} />}*/}
      {CurrentRouteEl && <CurrentRouteEl {...(currentRoute?.props || {})} />}
    </div>
  );
}

export default RouterStack;
