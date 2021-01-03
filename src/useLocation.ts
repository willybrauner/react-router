import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";
import { TOpenRoute } from "./core/RouterManager";

/**
 * useLocation
 */
export const useLocation = (): [string, (param: string | TOpenRoute) => void] => {
  const router = useRouter();
  const { currentRoute } = useRoutes();

  const setLocation = (param: string | TOpenRoute) => {
    if (typeof param === "string") {
      router.updateRoute(param);
    }
    if (typeof param === "object") {
      router.openRoute(param);
    }
  };
  return [currentRoute?.path, setLocation];
};
