import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  const { currentRoute } = useRoutes();
  const setLocation = (url: string) => router.updateRoute(url);
  return [currentRoute?.path, setLocation];
};
