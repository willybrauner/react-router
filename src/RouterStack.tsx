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
  const [currentRoute, setCurrentRoute] = useState<IRoute>(null);

  useEffect(() => {
    debug("currentRoute", currentRoute);

    const handler = (route: IRoute) => {
      debug("pass dans event emitter");
      setCurrentRoute(route);
    };
    props.router.events.on(ERouterEvent.ROUTE_CHANGE, handler);
    return () => {
      props.router.events.off(ERouterEvent.ROUTE_CHANGE, handler);
    };
  }, [currentRoute]);

  const CurrentRouteEl: any = currentRoute?.component;

  return (
    <div className={componentName}>
      {CurrentRouteEl && <CurrentRouteEl {...(currentRoute?.props || {})} />}
    </div>
  );
}

export default RouterStack;
