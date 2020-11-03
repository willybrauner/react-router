import { Path } from "path-parser";
const debug = require("debug")("front:Router");
import { ReactNode } from "react";
import { EventEmitter } from "events";

export interface IRoute {
  path: string;
  component: ReactNode;
  props?: { [x: string]: any };
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
      routes.forEach((el) => {
        this.add(el.path, el.component, el.props);
      });
    }

    this.handlePopState();
    window.addEventListener("popstate", this.handlePopState.bind(this));
  }

  /**
   * Add new route object to routes array
   */
  public add(path: string, component, props): void {
    const routeParams: IRoute = {
      path,
      component,
      props,
      parser: new Path(path),
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
      console.warn("updateRoute > Error, there is no matching route.");
      // TODO : emit route not found
      return;
    }

    if (this.currentRoute?.path === matchingRoute.path) {
      debug("updateRoute > This is the same URL, do not continue.");
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
  public getRouteFromUrl(url: string): IRoute {
    if (this.routes?.length === 0 || !this.routes) return;

    for (let i = 0; i < this.routes.length; i++) {
      // get current route object
      let current = this.routes[i];

      const pathParser = new Path(this.formatUrl(this.base, current.path));
      const formatUrl = this.formatUrl(this.base, url);

      // TODO partial test pose des problème car
      // TODO about/foo match aussi avec about
      // TODO l'idée serait pour les nested route, de virer la base avant le match
      // TODO Router 1 : /about -> sans base "/"
      // TODO Router 2 (nested) : /about/foo -> sans base "foo"
      const match = pathParser.partialTest(formatUrl);

      debug("get route from path >", {
        currentRouteObject: current,
        base: this.base,
        url,
        formatUrl,
        pathParser,
        routeObjMatchWithUrl: match,
      });

      if (match) {
        return {
          path: url,
          component: current?.component,
          parser: current?.parser,
          props: {
            params: match,
            ...(current?.props || {}),
          },
        };
      }
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
