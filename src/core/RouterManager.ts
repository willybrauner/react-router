import { Path } from "path-parser";
import React from "react";
import { EventEmitter } from "events";
const debug = require("debug")("front:RouterManager");

export type TRoute = {
  name?: string;
  path: string;
  component: React.ComponentType<any>;
  parser?: Path;
  props?: { [x: string]: any };
  children?: TRoute[];

  // URL re-build with params needed by nested router
  buildUrl?: string;
  // pathname who not depend of current instance
  pathname?: string;
};

export type TOpenRoute = {
  name: string;
  params?: { [x: string]: any };
};

export enum ERouterEvent {
  PREVIOUS_ROUTE_CHANGE = "previous-route-change",
  CURRENT_ROUTE_CHANGE = "current-route-change",
  STACK_IS_ANIMATING = "stack-is-animating",
}

// TODO tester avec history lib ? https://github.com/ReactTraining/history/blob/master/docs/getting-started.md
export const locationEvent = new EventEmitter();
export const PUSH_NEW_LOCATION = "push-new-location";

// store current full URL available for each instance
let GLOBAL_CURRENT_URL: string = window.location.href;

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

  // router instance ID, useful for debug if there is multiple router instance
  public id: number | string;
  // perform fake routing to not allow URL changing between routes
  public fakeMode: boolean;

  constructor({
    base = "/",
    routes = null,
    fakeMode = false,
    id = 1,
  }: {
    base?: string;
    routes?: TRoute[];
    fakeMode?: boolean;
    id?: number | string;
  }) {
    this.base = base;
    this.id = id;
    this.fakeMode = fakeMode;

    routes.forEach((el: TRoute) => this.addRoute(el));
    this.updateRoute();
    this.initEvent();
  }

  /**
   * Initialise event
   */
  public initEvent() {
    window.addEventListener("popstate", this.handlePopState);
    locationEvent.on(PUSH_NEW_LOCATION, this.handleNewLocation);
  }
  public destroy() {
    window.removeEventListener("popstate", this.handlePopState);
    locationEvent.off(PUSH_NEW_LOCATION, this.handleNewLocation);
  }

  /**
   * Handlers
   */
  protected handlePopState = () => {
    this.updateRoute(window.location.pathname, false);
  };

  protected handleNewLocation = (param: string | TOpenRoute) => {
    if (typeof param === "string") this.updateRoute(param);
    else if (typeof param === "object") this.openRoute(param);
  };

  /**
   * Add new route object to routes array
   */
  protected addRoute(route: TRoute): void {
    this.routes.push({
      ...route,
      parser: new Path(route.path),
    });
  }

  /**
   * Update route
   * - get route object matching with current URL
   * - push URL in history
   * - emit selected route object on route-change event (listen by Stack)
   */
  protected updateRoute(
    url: string = this.fakeMode ? this.base : window.location.pathname,
    addToHistory: boolean = true
  ): void {
    // get matching route depending of current URL
    const matchingRoute: TRoute = this.getRouteFromUrl(url);

    // check if there is matching route
    if (!matchingRoute) {
      debug(this.id, "updateRoute: NO MATCHING ROUTE. RETURN.");
      return;
    }

    // check if new route has the same URL or not
    debug(this.id, "updateRoute: ", {
      currentRouteBuildUrl: this.currentRoute?.buildUrl,
      matchingRouteBuildUrl: matchingRoute?.buildUrl,
      GLOBAL_CURRENT_URL: GLOBAL_CURRENT_URL,
    });

    if (this.currentRoute?.buildUrl === matchingRoute?.buildUrl) {
      debug(this.id, "updateRoute > THIS IS THE SAME URL, RETURN.");
      return;
    }

    // We have got a matching route and can continue...
    if (!this.fakeMode) {
      window.history[addToHistory ? "pushState" : "replaceState"](null, null, url);
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;
    this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
    this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);

    // keep global state
    GLOBAL_CURRENT_URL = url;
  }

  /**
   * Get current route from url using path-parser
   * @doc https://www.npmjs.com/package/path-parser
   */
  protected getRouteFromUrl(
    url: string,
    routes = this.routes,
    base = this.base,
    pCurrentRoute: TRoute = null,
    pPathParser = null,
    pMatch = null
  ): TRoute {
    if (!routes || routes?.length === 0) return;

    let match;

    // test each routes
    for (let i in routes) {
      let currentRoute = routes[i];

      // create parser & matcher
      const currentRoutePath = `${base}${currentRoute.path}`.replace("//", "/");
      const pathParser: Path = new Path(currentRoutePath);

      // prettier-ignore
      debug(this.id, `getRouteFromUrl: currentUrl "${url}" match with "${currentRoutePath}"?`, !!pathParser.test(url));

      // set new matcher
      match = pathParser.test(url) || null;

      // if current route path match with the param url
      if (match) {
        // prepare route obj
        const route = pCurrentRoute || currentRoute;
        const params = pMatch || match;

        const routeObj = {
          pathname: url,
          buildUrl: this.buildUrl(route.path, params),
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

        // next
        if (!children) continue;
        const parentBase = currentRoutePath;

        // recursive call
        return this.getRouteFromUrl(
          url,
          children,
          parentBase,
          currentRoute,
          pathParser,
          match
        );
      }
    }
  }

  /**
   * Build an URL with path and params
   */
  public buildUrl(path: string, params?: { [x: string]: any }): string {
    const newPath = new Path(path);
    return newPath.build(params);
  }

  /**
   * Open a specific route by is name
   * @param componentName
   * @param params
   */
  public openRoute({ name, params }: TOpenRoute): void {
    // get route by name property (by default) or by component displayName
    const targetRoute = this.routes.find(
      (el: TRoute) => el?.name === name || el.component?.displayName === name
    );

    if (!targetRoute?.path) {
      debug(this.id, "There is no route with this name, exit", name);
      return;
    }
    // build URL
    let url = this.buildUrl(targetRoute.path, params);
    // update route with this URL
    this.updateRoute(url);
  }
}
