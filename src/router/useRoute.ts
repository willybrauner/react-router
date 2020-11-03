import { useRouter } from "./useRouter";
import { IRoute } from "./core/RouterManager";

/**
 * useRoute
 * Get route information from specific URL
 */
const useRoute = (url: string): [boolean, IRoute] => {
  const router = useRouter();
  const matchingRoute = router.getRouteFromUrl(url);
  return [matchingRoute != null, matchingRoute || null];
};
