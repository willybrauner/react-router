import { useRoutes } from "./useRoutes";
import { PUSH_NEW_LOCATION, locationEvent, TOpenRoute } from "./core/RouterManager";

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRoute) => void] => {
  const { currentRoute } = useRoutes();

  const setLocation = (param: string | TOpenRoute) => {
    if (typeof param === "string") {
      locationEvent.emit(PUSH_NEW_LOCATION, param);
    }
    if (typeof param === "object") {
      //router.openRoute(param);
    }
  };
  return [currentRoute?.path, setLocation];
};
