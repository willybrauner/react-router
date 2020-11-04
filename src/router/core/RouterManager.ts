import { Path } from "path-parser";
const debug = require("debug")("front:Router");
import { ReactNode } from "react";
import { EventEmitter } from "events";

export interface IRoute {
  path: string;
  component: ReactNode;
  props?: { [x: string]: any };
  children?: IRoute[];
  parser?: Path;
}

export enum ERouterEvent {
  ROUTE_CHANGE = "route-change",
  ROUTE_NOT_FOUND = "route-not-found",
  ROUTER_STACK_IS_ANIMATING = "router-stack-is-animating",
}

/**
 *  - lecture de route (parser une URL)
 *  - instance de router
 *  - event emitter pour savoir quand une route change
 *  - connaitre l'ancienne page / la page courante
 *
 *  - hook useRouteTransition : passer les transitions playIn playOut de la page courante + promiseReady
 *  - hook useRoute
 *      const { match, params, currentRoute, previousRoute } = useRoute();
 *
 */

export default class RouterManager {
  // base url
  public base: string;
  // routes list
  protected routes: IRoute[] = [];
  // create event emitter
  public events: EventEmitter = new EventEmitter();
  // current route object
  public currentRoute: IRoute;
  // previous route object
  public previousRoute: IRoute;

  protected pageCount: number = 0;

  public isFirsPage: boolean = true;

  /**
   * Init constructor
   * @param base
   * @param routes
   */
  constructor({
    base = "/",
    routes = null,
  }: {
    base: string;
    routes: IRoute[];
  }) {
    this.base = base;

    if (routes !== null) {
      routes.forEach((el) => this.add(el));
    }

    this.handlePopState();
    window.addEventListener("popstate", this.handlePopState.bind(this));
  }

  /**
   * Add new route object to routes array
   */
  public add(route: IRoute): void {
    const routeParams: IRoute = {
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
  public updateRoute(url: string = location.pathname): void {
    // get matching route depending of current URL
    const matchingRoute: IRoute = this.getRouteFromUrl(url);

    if (!matchingRoute) {
      debug("updateRoute > NOT FOUND there is no matching route. return.", {
        matchingRoute,
        url,
      });
      // TODO : emit route not found
      return;
    }

    if (this.currentRoute?.path === matchingRoute.path) {
      debug("updateRoute > This is the same URL, return.", {
        currentRoutePath: this.currentRoute?.path,
        matchingRoutePath: matchingRoute.path,
      });
      return;
    }

    // TODO previous route ne fonctionne pas si c'est la premiere route de la navigation
    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;

    // push url in history
    window.history.pushState(null, null, url);

    this.events.emit(ERouterEvent.ROUTE_CHANGE, {
      previousRoute: this.previousRoute,
      currentRoute: this.currentRoute,
    });
  }

  /**
   * Get current route from url using path-parser
   * @doc https://www.npmjs.com/package/path-parser
   */

  // prettier-ignore
  public getRouteFromUrl(url: string, routes = this.routes): IRoute {
    if (!routes || routes?.length === 0) return;

    for (let i = 0; i < routes.length; i++) {
      let currentRoute = routes[i];

      // create parser & matcher
      const pathParser: Path = new Path(currentRoute.path);
      const match = pathParser.test(url);
      debug('match?',!!match, match, currentRoute)

      const childrenMatch :boolean = currentRoute?.children?.some(el => {
        const pathParser: Path = new Path(el.path);
        return  pathParser.test(url);
      })

      // if current route path match with url
      if (match || childrenMatch) {
        debug("getRouteFromUrl > this currentRoute match:", { currentRoute, base: this.base, url, pathParser, routeObjMatchWithUrl: match });

        return {
          path: url,
          component: currentRoute.component,
          parser: currentRoute.parser,
          props: {
            params: match,
            ...(currentRoute.props || {}),
          },
        };
      }

      // // if no match, on regarde si il y a une propriété children
      // else if (currentRoute?.children?.length > 0) {
      //   debug('route as children ', currentRoute.children)
      //   return this.getRouteFromUrl(url, currentRoute.children);
      // }
    }
  }

  /**
   * Format URL
   * TODO - Virer la base du path si il exist (voir TODO plus haut)
   * @param base
   * @param path
   */
  protected formatUrl(base: string, path: string = location.pathname): string {
    return path !== "/" ? path.slice(1) : path;
  }

  /**
   * Handle popState event
   */
  protected handlePopState() {
    this.updateRoute();
  }

  /**
   * TODO
   * Use middleWare
   */
  public use() {}
}
