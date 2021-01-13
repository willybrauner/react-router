import { useRoute } from "./useRoute";
import { history, TOpenRoute } from "./core/RouterManager";

const debug = require("debug")("front:useLocation");

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRoute) => void] => {
  const { currentRoute , previousRoute} = useRoute();

  const location = currentRoute?.pathname;

  const setLocation = (param: string | TOpenRoute): void => {

     debug('history.location.pathname === currentRoute?.pathname',history.location.pathname === currentRoute?.pathname)
    debug('history.location.pathname',history.location.pathname)
    debug('currentRoute?.pathname',currentRoute?.pathname)
    debug('previousRoute?.pathname',previousRoute?.pathname)

    if (history.location.pathname === currentRoute?.pathname)
    {
    }

    history.push(param as any);
  };

  return [location, setLocation];
};
