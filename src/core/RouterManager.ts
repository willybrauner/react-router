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
};

export enum ERouterEvent {
  PREVIOUS_ROUTE_CHANGE = "previous-route-change",
  CURRENT_ROUTE_CHANGE = "current-route-change",
  // TODO add listener to stack and create hook useStackIsAnimating();
  STACK_IS_ANIMATING = "stack-is-animating",
}

/**
 * Single router
 */
class RouterManager {
  // base url
  public base: string;
  // routes list
  public routes: TRoute[] = [];
  // create event emitter
  public events: EventEmitter = new EventEmitter();
  // current route object
  public currentRoute: TRoute;
  // previous route object
  public previousRoute: TRoute;
  // perform fake routing to not allow url changing between routes
  public id: number | string;

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
    window.addEventListener("popstate", (e) => {
      debug(this.id, "pass dans popstate", e);
      this.updateRoute(window.location.pathname, false);
    });
  }

  /**
   * Add new route object to routes array
   */
  public addRoute(route: TRoute): void {
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
   * - emit selected route object on route-change event (listen by RouterStack)
   */
  public updateRoute(
    url: string = this.fakeMode ? this.base : window.location.pathname,
    addToHistory: boolean = true
  ): void {
    // get matching route depending of current URL
    const matchingRoute: TRoute = this.getRouteFromUrl(url);

    if (!matchingRoute) {
      debug(this.id, "updateRoute > No matching route. return", { matchingRoute, url });
      return;
    }

    // si currentRoute est un child (contient ~? ex: ~/bar)
    // et matchingRoute ...

    if (this.currentRoute?.path === matchingRoute?.path) {
      debug(this.id, "updateRoute > This is the same URL, return.", {
        currentRoutePath: this.currentRoute?.path,
        matchingRoutePath: matchingRoute?.path,
      });
      //  return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;

    if (!this.fakeMode) {
      addToHistory
        ? window.history.pushState(null, null, url)
        : window.history.replaceState(null, null, url);
    }

    this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
    this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);

    GlobalRouter.routeCounter++;
  }

  /**
   * Get current route from url using path-parser
   * @doc https://www.npmjs.com/package/path-parser
   */
  // prettier-ignore
  public getRouteFromUrl(url: string, routes = this.routes): TRoute {
    if (!routes || routes?.length === 0) return;

    for (let i = 0; i < routes.length; i++) {
      let currentRoute = routes[i];

      // create parser & matcher
      const currentRoutePath = currentRoute.path.slice(1) || "/";
      const pathParser: Path = new Path(currentRoutePath);

      const currentUrl = url === "/" ? url : url?.replace(this.base, "");
      // debug(this.id,`getRouteFromUrl: currentUrl "${currentUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(currentUrl));

      let match;
      // if url match with current route path
      // or if 1rst part of url match with  current route path
      match = pathParser.test(currentUrl) || null;

      /**
       * Needed if access to /foo/bar sub-router on first load
       * router 1 need to instantiate '/foo' for router 2 will be able to render '/bar'
       * So we check URL part
       */
      let partialMatch = false;
      // if not match
      if (!match) {
        partialMatch = true;
        const currentUrlParts = currentUrl.split('/');
        for (let i = 0; i < currentUrlParts.length; i++) {

          // get one part of the url array
          const specificPartOfUrl = currentUrlParts[i];
          // debug(this.id,`getRouteFromUrl: specificPartOfUrl "${specificPartOfUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(specificPartOfUrl));

          // if match,register it
          if (pathParser.test(specificPartOfUrl)) {
            match = pathParser.test(specificPartOfUrl);
          }
        }
      }

      // if current route path match with the param url
      if (match) {

        // prepare route object
        const routeObj: TRoute = {
          path: currentRoute.path,
          component: currentRoute.component,
          children: currentRoute?.children,
          parser: pathParser,
          props: {
            params: match,
            ...(currentRoute.props || {}),
          },
        };

        debug(this.id, 'getRouteFromUrl: > MATCH routeObj', routeObj);

        return routeObj;
      }
    }
   }

  /**
   * Build an URL with path and params
   */
  public buildUrl(path: string, params?: { [x: string]: any }) {
    const newPath = new Path(path);
    return newPath.build(params);
  }

  /**
   * Open a specific route by is name
   * @param componentName
   * @param params
   */
  public openRoute({
    componentName,
    params,
  }: {
    componentName: string;
    params?: { [x: string]: any };
  }): void {
    // get route by name
    const targetRoute = this.routes.find((el) => el.name === componentName);

    if (!targetRoute?.path) {
      debug(this.id, "There is no route with this name, exit", componentName);
      return;
    }

    // build url
    let url = this.buildUrl(targetRoute.path, params);

    // update route with this url
    this.updateRoute(url);
  }

  /**
   * TODO
   * Use middleWare
   */
  public use() {}
}

export { RouterManager };
