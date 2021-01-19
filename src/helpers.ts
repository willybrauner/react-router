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
 *  if path "/foo" is a children of path "/bar", his full url is "/bar/foo"
 *  With "/foo" this function will return "/bar/foo"
 */
export function getUrlByPath(
  routes: TRoute[],
  path: string,
  basePath: string = null
): string {
  // prepare local path
  let localPath: string[] = [basePath];

  // join and format paths string array
  const formatPath = (paths: string[]): string => paths?.join("").replace("//", "/");

  for (let i in routes) {
    const route = routes[i];
    debug('route', route)

    // if path match on first level, return it
    if (route.path === path) {
      localPath.push(route.path);
      debug("getUrlByPath > path match, return it", path, formatPath(localPath));
      return formatPath(localPath);
    }

    // if not matching but as children, return it
    else if (route?.children?.length > 0) {
      localPath.push(route.path);
      debug("getUrlByPath > no match, recall recursively getUrlByPath()", localPath);
      return getUrlByPath(route.children, path, formatPath(localPath));
    }
  }
}

/**
 * Get route URL by his route name and params
 */
export function getUrlByRouteName(routes: TRoute[], params: TOpenRouteParams): string {

  // get route by name property (by default) or by component displayName
  const targetRoute = (pRoutes) =>
    pRoutes.find((el: TRoute) => {
      const match = el?.name === params.name || el.component?.displayName === params.name;

      if (match) {
        debug("getUrlByRouteName > has match", match, el);
        return match;

        //
      } else if (el.children?.length > 0) {
        debug("getUrlByRouteName > no match, recall recursively on children", el);
        return targetRoute(el.children);
      }
    });

  const route = targetRoute(routes);
  debug("route", route);

  if (!route?.path) {
    debug("There is no route with this name, exit", params.name);
    return;
  }

  // build URL
  const url = buildUrl(route.path, params.params);

  // return it
  return url || null;
}
