import { useHistory } from "..";
import { useState } from "react";

const componentName = "useLocation";
const debug = require("debug")(`front:${componentName}`);
/**
 * use Route Counter
 */
export const useRouteCounter = (): {
  count: number;
  isFirstRoute: boolean;
  resetCounter: () => void;
} => {
  const initialCount = 1;
  const initialIsFirstRoute = true;

  // get current route count
  const [count, setCount] = useState<number>(initialCount);

  // check if is first route
  const [isFirstRoute, setIsFirstRoute] = useState<boolean>(initialIsFirstRoute);

  // handle history
  useHistory(() => {
    setCount(count + 1);
    setIsFirstRoute(false);
  }, [count, isFirstRoute]);

  // allow to reset counter if needed (after first redirection for example)
  const resetCounter = () => {
    setCount(initialCount);
    setIsFirstRoute(initialIsFirstRoute);
  };

  return { count, isFirstRoute, resetCounter };
};
