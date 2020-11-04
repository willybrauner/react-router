import { useRouter } from "./useRouter";

/**
 * useLocation
 */
export const useLocation = (): [string, (url: string) => void] => {
  const router = useRouter();
  return [router.currentRoute?.path, (url) => router.updateRoute(url)];
};
