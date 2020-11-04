import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoute";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  const { currentRoute } = useRoutes();
  return [currentRoute?.path, (url) => router.updateRoute(url)];
};
