import { Path } from "path-parser";
import React from "react";
import { EventEmitter } from "events";
import GlobalRouter from "./GlobalRouter";
const debug = require("debug")("front:RouterManager");

export type TRoute = {
  name?: string;
  path: string;
  component: React.ComponentType<any>;
  parser?: Path;
  props?: { [x: string]: any };
  children?: TRoute[];
  url?: string;
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

// TODO tester avec https://github.com/ReactTraining/history/blob/master/docs/getting-started.md
export const locationEvent = new EventEmitter();
export const PUSH_NEW_LOCATION = "push-new-location";

/**
 * RouterManager instance
 */
class RouterManager {
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

    routes.forEach((el) => this.addRoute(el));

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
   * @param e
   */
  protected handlePopState = (e) => {
    debug(this.id, "in popstate", e);
    this.updateRoute(window.location.pathname, false);
  };

  protected handleNewLocation = (e) => {
    debug(this.id, "in pushstate");
    this.updateRoute(e, true);
  };

  /**
   * Add new route object to routes array
   */
  protected addRoute(route: TRoute): void {
    const routeParams: TRoute = {
      ...route,
      parser: new Path(route.path),
    };
    // keep routes in local array
    this.routes.push(routeParams);
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

    debug(this.id, "updateRoute > ", { matchingRoute, url });
    if (!matchingRoute) {
      debug(this.id, "updateRoute > No matching route. return");
      return;
    }

    // prettier-ignore
    debug(this.id, "updateRoute > ", { currentRouteUrl: this.currentRoute?.url, matchingRouteUrl: matchingRoute?.url });

    // TODO le 1er niveau va aussi recevoir une nouvelle URL et va emit alors qu'il ne devrait pas si uniquement la sous route change
    // prettier-ignore
    if (this.currentRoute?.url === matchingRoute?.url || this.currentRoute?.path === matchingRoute?.path) {
      debug(this.id, "updateRoute > This is the same URL, return.");
      return;
    }

    if (!this.fakeMode) {
      addToHistory
        ? window.history.pushState(null, null, url)
        : window.history.replaceState(null, null, url);
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;
    this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
    this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);

    GlobalRouter.routeCounter++;
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

    // test
    for (let i in routes) {
      let currentRoute = routes[i];

      // create parser & matcher
      const currentRoutePath = `${base}${currentRoute.path}`.replace("//", "/");
      const pathParser: Path = new Path(currentRoutePath);

      // prettier-ignore
      debug(this.id, `getRouteFromUrl: currentUrl "${url}" match with "${currentRoutePath}" ?`, !!pathParser.test(url));

      // if url match with current route path
      // or if 1rst part of url match with  current route path
      match = pathParser.test(url) || null;

      // if current route path match with the param url
      if (match) {
        const prepareMatchingRoute = (route, pathParser, match, url): TRoute => ({
          path: route.path,
          component: route.component,
          children: route?.children,
          parser: pathParser,
          props: {
            params: match,
            ...(route.props || {}),
          },
          url,
        });

        const routeObj = prepareMatchingRoute(
          pCurrentRoute || currentRoute,
          pPathParser || pathParser,
          pMatch || match,
          url
        );

        debug(this.id, "getRouteFromUrl: > MATCH routeObj", routeObj);
        return routeObj;

        // if not match
      } else {
        const children = currentRoute?.children;
        debug("children", children);

        // next
        if (!children) continue;
        const parentBase = currentRoutePath;
        debug(" parentBase", parentBase);

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
   * TODO revoir
   * Open a specific route by is name
   * @param componentName
   * @param params
   */
  public openRoute({ name, params }: TOpenRoute): void {
    // get route by name property (by default) or by component displayName
    const targetRoute = this.routes.find(
      (el) => el?.name === name || el.component?.displayName === name
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

  /**
   * TODO
   * Use middleWare
   */
  public use() {}
}

export { RouterManager };
