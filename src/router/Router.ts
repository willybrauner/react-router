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
export default class Router {
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
      debug("constructor > routes", routes);
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
  public updateRoute(url: string = window.location.pathname): void {
    // get matching route depending of current URL
    const matchingRoute: IRoute = this.getRouteFromUrl(url);
    debug("updateRoute > this route match", matchingRoute);

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
    debug("updateRoute > gonna pushState...");
    window.history.pushState(null, null, url);

    this.events.emit(ERouterEvent.ROUTE_CHANGE, {
      previousRoute: this.previousRoute,
      currentRoute: this.currentRoute,
    });
  }

  /**
   * Get current route from URL using path-parser
   * @doc https://www.npmjs.com/package/path-parser
   */
  private getRouteFromUrl(url: string): IRoute {
    if (this.routes?.length === 0 || !this.routes) return;

    for (let i = 0; i < this.routes.length; i++) {
      let current = this.routes[i];
      debug("getRouteFromUrl > url from route to before test", current);

      const pathParser = new Path(current?.path);
      debug("getRouteFromUrl > pathParser", pathParser);

      const match = pathParser.test(url);
      debug("getRouteFromUrl > use path-parser > match", match);

      if (match) {
        const routeObject: IRoute = {
          path: url,
          component: current?.component,
          parser: current?.parser,
          props: {
            params: match,
            ...(current?.props || {}),
          },
        };
        debug("getRouteFromUrl > routeObject returned", routeObject);
        return routeObject;
      }
    }
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

// ----------------------------------------------------------------------------

/*
const prepareRoutes = [
    {
        path: "",
        component: "",
        props: {
        }
    },
    {
        path: "",
        component: "",
        props: {

        }
    }
]

const router = new Router({ base: "/", routes: [] });

// config par rapport aux locales (récupérée depuis le back)
LanguageService.locales(...);

// middlewares
// patcher toutes les routes avec la locale courante
// afficher la locale par default ou pas
// ex: si une route est définie sans langue, il faut pouvoir la retourner avec langue
const languageMiddleWare = new LanguageMiddleWare({...})
router.use(languageMiddleWare);


// déclaration des routes
router.add("/", Home, );
router.add("/blog", Blog);
router.add("/blog/:id", Article);


// fallback
router.add("*", () => <Error />);

*/
