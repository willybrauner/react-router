import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  const { currentRoute } = useRoutes();
  return [currentRoute?.path, (url) => router.updateRoute(url)];
};
