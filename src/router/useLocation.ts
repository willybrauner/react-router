import { useRouter } from "./useRouter";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  // update current route
  const updateRoute = (url: string = window.location.pathname) => {};
  // get route from URL
  const getRouteFromUrl = () => {};

  return [router.currentRoute?.path, (url) => router.updateRoute(url)];
};
