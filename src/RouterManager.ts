import { Path } from "path-parser";
import React from "react";
import { EventEmitter } from "events";
const debug = require("debug")("front:RouterManager");

export type TRoute = {
  path: string;
  component: React.ComponentType<any>;
  name?: string;

  parser?: Path;
  props?: { [x: string]: any };
  children?: TRoute[];
  // URL re-build with params (needed by nested router)
  buildUrl?: string;
  // real pathname who not depend of current instance
  pathname?: string;
};

export enum ERouterEvent {
  PREVIOUS_ROUTE_CHANGE = "previous-route-change",
  CURRENT_ROUTE_CHANGE = "current-route-change",
  STACK_IS_ANIMATING = "stack-is-animating",
}

/**
 * Create history
 * doc: https://github.com/ReactTraining/history/blob/master/docs/getting-started.md
 */
import { createBrowserHistory } from "history";
import { buildUrl } from "./helpers";
export const history = createBrowserHistory();

/**
 * RouterManager
 */
export class RouterManager {
  // base URL
  public base: string;
  // routes list
  public routes: TRoute[] = [];
  // create event emitter
  public events: EventEmitter = new EventEmitter();

  // current / previous route object
  public currentRoute: TRoute;
  public previousRoute: TRoute;

  // store history listener
  protected unlistenHistory;

  // router instance ID, useful for debug if there is multiple router instance
  public id: number | string;

  constructor({
    base = "/",
    routes = null,
    id = 1,
  }: {
    base?: string;
    routes?: TRoute[];
    fakeMode?: boolean;
    id?: number | string;
  }) {
    this.base = base;
    this.id = id;

    routes.forEach((el: TRoute) => this.addRoute(el));
    this.updateRoute();
    this.initEvents();
  }

  /**
   * Initialise event
   */
  public initEvents() {
    this.unlistenHistory = history.listen(({ location, action }) => {
      debug(this.id, " initEvents > history", action, location.pathname, location.state);
      this.handleHistory(location.pathname);
    });
  }

  public destroyEvents() {
    // To stop listening, call the function returned from listen().
    this.unlistenHistory();
  }

  /**
   * Handlers
   */
  protected handleHistory = (param: string) => {
    this.updateRoute(param);
  };

  /**
   * Add new route object to routes array
   */
  protected addRoute(route: TRoute): void {
    this.routes.push({ ...route, parser: new Path(route.path) });
  }

  /**
   * Update route
   * - get route object matching with current URL
   * - emit selected route object on route-change event (listen by Stack)
   */
  protected updateRoute(url: string = history.location.pathname): void {
    // get matching route depending of current URL
    const matchingRoute: TRoute = this.getRouteFromUrl({ pUrl: url });

    if (!matchingRoute) {
      debug(this.id, "updateRoute: NO MATCHING ROUTE. RETURN.");
      return;
    }

    if (this.currentRoute?.buildUrl === matchingRoute?.buildUrl) {
      debug(this.id, "updateRoute > THIS IS THE SAME URL, RETURN.");
      return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;
    this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
    this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);
  }

  /**
   * Get current route from URL using path-parser
   * @doc https://www.npmjs.com/package/path-parser
   */
  protected getRouteFromUrl({
    pUrl,
    pRoutes = this.routes,
    pBase = this.base,
    pCurrentRoute = null,
    pPathParser = null,
    pMatch = null,
  }: {
    pUrl: string;
    pRoutes?: TRoute[];
    pBase?: string;
    pCurrentRoute?: TRoute;
    pPathParser?: any;
    pMatch?: any;
  }): TRoute {
    if (!pRoutes || pRoutes?.length === 0) return;
    let match;

    // test each routes
    for (let i in pRoutes) {
      let currentRoute = pRoutes[i];
      // create parser & matcher
      const currentRoutePath = `${pBase}${currentRoute.path}`.replace("//", "/");
      // prepare parser
      const pathParser: Path = new Path(currentRoutePath);
      // prettier-ignore
      debug(this.id, `getRouteFromUrl: currentUrl "${pUrl}" match with "${currentRoutePath}"?`, !!pathParser.test(pUrl));
      // set new matcher
      match = pathParser.test(pUrl) || null;
      // if current route path match with the param url
      if (match) {
        // prepare route obj
        const route = pCurrentRoute || currentRoute;
        const params = pMatch || match;
        const routeObj = {
          pathname: pUrl,
          buildUrl: buildUrl(route.path, params),
          path: route?.path,
          component: route?.component,
          children: route?.children,
          parser: pPathParser || pathParser,
          props: {
            params,
            ...(route?.props || {}),
          },
        };

        debug(this.id, "getRouteFromUrl: > MATCH routeObj", routeObj);
        return routeObj;

        // if not match
      } else {
        const children = currentRoute?.children;
        // if there is no child, continue to next iteration
        if (!children) continue;
        // else, call recursivly this same method with new params
        return this.getRouteFromUrl({
          pUrl: pUrl,
          pRoutes: children,
          pBase: currentRoutePath, // parent base
          pCurrentRoute: currentRoute,
          pPathParser: pathParser,
          pMatch: match,
        });
      }
    }
  }
}