import { useContext } from "react";
import { RouterContext } from "./core/Router";

/**
 * Return current router instance
 * Instance depend of inside of witch provider useRouter is called
 */
export const useRouter = () => {
  return useContext(RouterContext);
};
