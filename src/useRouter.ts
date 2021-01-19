import { useContext } from "react";
import { RouterContext, rootRouter } from "./Router";
import { RouterManager } from "./RouterManager";

/**
 * Returns root router instance
 */
export const useRootRouter = (): RouterManager => rootRouter.root;
/**
 * Returns current router instance context
 * Instance depend of inside witch provider this function is called
 */
export const useRouter = () => useContext(RouterContext);
