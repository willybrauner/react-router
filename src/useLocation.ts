import { useRoutes } from "./useRoutes";
import { PUSH_NEW_LOCATION, locationEvent, TOpenRoute } from "./core/RouterManager";

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRoute) => void] => {
  const { currentRoute } = useRoutes();

  const setLocation = (param: string | TOpenRoute) => {
    locationEvent.emit(PUSH_NEW_LOCATION, param);
  };
  return [currentRoute?.path, setLocation];
};
