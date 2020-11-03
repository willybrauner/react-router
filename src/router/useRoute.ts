import { useRouter } from "./useRouter";
import { IRoute } from "./core/RouterManager";

/**
 * useRoute
 * Get route information from specific URL
 */
const useRoute = (url: string): [boolean, IRoute] => {
  const router = useRouter();
  const marchingRoute = router.getRouteFromUrl(url);
  return [marchingRoute != null, marchingRoute || null];
};
