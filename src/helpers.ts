import { Path } from "path-parser";
import { TRoute } from "./RouterManager";
const debug = require("debug")("front:helpers");

export type TParams = { [x: string]: any };

export type TOpenRouteParams = {
  name: string;
  params?: TParams;
};

/**
 * Build an URL with path and params
 */
export function buildUrl(path: string, params?: TParams): string {
  const newPath = new Path(path);
  return newPath.build(params);
}

/**
 * Get route URL by his route name and params
 * TODO improve to call nested routes (need to build URL with is base)
 */
export function getUrlByRouteName(routes: TRoute[], params: TOpenRouteParams): string {
  // get route by name property (by default) or by component displayName
  const targetRoute = (pRoutes) =>
    pRoutes.find((el: TRoute) => {
      const match = el?.name === params.name || el.component?.displayName === params.name;
      if (match) {
        return match;
      } else if (el.children?.length > 0) {
        targetRoute(el.children);
      }
    });

  const route = targetRoute(routes);

  if (!route?.path) {
    debug("There is no route with this name, exit", params.name);
    return;
  }

  const url = buildUrl(route.path, params.params);
  // build URL
  return url || null;
}
