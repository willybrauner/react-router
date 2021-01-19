import { useContext } from "react";
import { RouterContext, rootRouter } from "./Router";

/**
 * Return root router instance
 */
export const useRootRouter = () => rootRouter["root"];
/**
 * Return current router instance
 * Instance depend of inside of witch provider useRouter is called
 */
export const useRouter = () => useContext(RouterContext);
