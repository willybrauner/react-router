import { useRoute } from "./useRoute";
import { PUSH_NEW_LOCATION, locationEvent, TOpenRoute } from "./core/RouterManager";

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRoute) => void] => {
  const { currentRoute } = useRoute();

  const location = currentRoute?.pathname;

  const setLocation = (param: string | TOpenRoute): void => {
    locationEvent.emit(PUSH_NEW_LOCATION, param);
  };

  return [location, setLocation];
};
