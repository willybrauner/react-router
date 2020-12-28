import { Path } from "path-parser";
import React from "react";
import { EventEmitter } from "events";
import { TStackTransitions } from "../useStack";
const debug = require("debug")("front:RouterManager");

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
  // TODO add listener to stack and create hook useStackIsAnimating();
  ROUTER_STACK_IS_ANIMATING = "router-stack-is-animating",
}

// GLOBAL STATE
let ROUTER_INSTANCE_LENGTH = 0;
let CURRENT_ROUTE: TRoute;

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
  protected _id: number | string;

  public stackPageTransitions: TStackTransitions;

  constructor(
    base: string = "/",
    routes: TRoute[] = null,
    fakeRouting = false,
    id: number | string = 1
  ) {
    ROUTER_INSTANCE_LENGTH++;

    this.base = base;
    this._fakeRouting = fakeRouting;
    this._id = id;

    routes.forEach((el) => this.addRoute(el));

    this.updateRoute();
    window.addEventListener("popstate", (e) => {
      debug(this._id, "pass dans popstate", e);
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
      debug(this._id, "updateRoute > No matching route. return", { matchingRoute, url });
      return;
    }

    if (
      this.currentRoute?.path === matchingRoute?.path
      // &&
      // CURRENT_ROUTE?.path === matchingRoute?.path
    ) {
      debug(this._id, "updateRoute > This is the same URL, return.", {
        currentRoutePath: this.currentRoute?.path,
        matchingRoutePath: matchingRoute?.path,
      });
      return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;
    CURRENT_ROUTE = matchingRoute;
    debug(this._id, "CURRENT_ROUTE", CURRENT_ROUTE);

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
      const currentRoutePath = currentRoute.path.slice(1) || "/";
      const pathParser: Path = new Path(currentRoutePath);

      // debug('url', url)
      // debug('this.base', this.base, this.base.length);
      // debug('currentRoutePath', currentRoutePath)

      const currentUrl = url === "/" ? url : url?.replace(this.base, "");
      debug(this._id,`currentUrl "${currentUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(currentUrl));

      let match;
      // if url match with current route path
      // or if 1rst part of url match with  current route path
      match = pathParser.test(currentUrl);

      if (!match) {
        debug('no match, stream each part of currentUrl...')

        const currentUrlParts = currentUrl.split('/');
        debug("currentUrlParts",currentUrlParts);

        for (let i = 0; i < currentUrlParts.length; i++) {
          const specificPartOfUrl = currentUrlParts[i];
          debug(this._id,`specificPartOfUrl "${specificPartOfUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(specificPartOfUrl));

          if (pathParser.test(specificPartOfUrl)) {
            match = pathParser.test(specificPartOfUrl);
          }
        }
      }

      debug(this._id, '>> MATCH?', !!match, match, currentRoute)

      // if current route path match with one url
      if (match) {
        debug(this._id, "getRouteFromUrl > this currentRoute match:",
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
