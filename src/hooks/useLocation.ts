import { useEffect, useRef, useState } from "react";
import { useRootRouter } from "..";
import { history } from "../api/history";
import { getUrlByRouteName, TOpenRouteParams } from "../api/helpers";

const componentName = "useLocation";
const debug = require("debug")(`front:${componentName}`);

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRouteParams) => void] => {
  const rootRouter = useRootRouter();

  /**
   * Get dynamic current location
   */
  const [location, setLoc] = useState(window.location.pathname);
  const unlistenHistory = useRef(null);

  useEffect(() => {
    unlistenHistory.current = history.listen(({ location, action }) => {
      debug("history", action, location.pathname, location.state);
      setLoc(location.pathname);
    });
    return () => unlistenHistory.current();
  }, []);

  /**
   * Prepare setLocation function, who push in history
   * @param args
   */
  function setLocation(args: string | TOpenRouteParams): void {
    if (typeof args === "string") {
      history.push(args);
    }
    // case this is TOpenRouteParams
    if (typeof args === "object" && args.name) {
      history.push(getUrlByRouteName(rootRouter.routes, args));
    }
  }

  return [location, setLocation];
};
