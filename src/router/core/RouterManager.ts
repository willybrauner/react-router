import { Path } from "path-parser";
const debug = require("debug")("front:RouterManager");
import React from "react";
import { EventEmitter } from "events";
import { TStackTransitions } from "../useStack";

export type TRoute = {
  path: string;
  component: React.ComponentType<any>;
  parser?: Path;
  props?: { [x: string]: any };
  children?: TRoute[];
};

export enum ERouterEvent {
  PREVIOUS_ROUTE_CHANGE = "previous-route-change",
  CURRENT_ROUTE_CHANGE = "current-route-change",
  ROUTER_STACK_IS_ANIMATING = "router-stack-is-animating",
}

export default class RouterManager {
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
  // allow to check if is first page
  public isFirstRoute: boolean = true;
  // get number of pages
  public routesCounter: number = 0;
  // perform fake routing to not allow url changing between routes
  protected _fakeRouting: boolean;

  // register
  //protected _stackPageTransitions;
  public stackPageTransitions: TStackTransitions;

  constructor(base: string = "/", routes: TRoute[] = null, fakeRouting = false) {
    this.base = base;
    this._fakeRouting = fakeRouting;
    routes.forEach((el) => this.addRoute(el));

    this.updateRoute();
    window.addEventListener("popstate", (e) => {
      debug("pass dans popstate", e);
      this.updateRoute(location.pathname, false);
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
    url: string = window.location.pathname,
    addToHistory: boolean = true
  ): void {
    // get matching route depending of current URL
    const matchingRoute: TRoute = this.getRouteFromUrl(url);

    if (!matchingRoute) {
      debug("updateRoute > No matching route.", { matchingRoute, url });
    }

    if (this.currentRoute?.path === matchingRoute.path) {
      debug("updateRoute > This is the same URL, return.", {
        currentRoutePath: this.currentRoute?.path,
        matchingRoutePath: matchingRoute.path,
      });
      return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;

    if (addToHistory) {
      this._fakeRouting
        ? window.history.replaceState(null, null, url)
        : window.history.pushState(null, null, url);
    }

    this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
    this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);


    // this can't works if multi stack...
    this.routesCounter++;
    this.isFirstRoute = this.routesCounter === 1;
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
      const pathParser: Path = new Path(currentRoute.path);
      const match = pathParser.test(url);
      // debug('match?', !!match, match, currentRoute)

      const childrenMatch: boolean = currentRoute?.children?.some(el => {
        const pathParser: Path = new Path(el.path);
        return  pathParser.test(url);
      })

      // if current route path match with url
      if (match || childrenMatch) {
        debug("getRouteFromUrl > this currentRoute match:",
            { currentRoute, base: this.base, url, pathParser, routeObjMatchWithUrl: match });
        return {
          path: url,
          component: currentRoute.component,
          parser: pathParser,
          props: {
            params: match,
            ...(currentRoute.props || {}),
          },
        };
      }
    }
  }

  /**
   * Use middleWare
   */
  public use() {}
}
