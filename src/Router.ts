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
  protected _routes: IRoute[] = [];
  // create event emitter
  public events: EventEmitter = new EventEmitter();
  // current route object
  protected currentRoute: IRoute;
  // previous route object
  protected previousRoute: IRoute;

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

    // if route exist
    if (routes !== null) {
      debug("constructor > routes", routes);
      routes.forEach((el) => {
        this.add(el.path, el.component, el.props);
      });
    }

    this.updateRoute();
  }

  /**
   * TODO
   * Use middleWare
   */
  public use() {}

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
    this._routes.push(routeParams);
  }

  /**
   * When we need to update route
   */
  public updateRoute(url: string = window.location.pathname): void {
    // get matching route depending of current URL
    const matchingRoute = this.getRouteFromUrl(url);
    debug("handleUrlChange > this route match", matchingRoute);

    if (!matchingRoute) {
      console.warn("Error, there is no matching route.");
      // TODO : emit route not found
      return;
    }

    // TODO previous route ne fonctionne pas si c'est la premiere route de la navigation
    this.previousRoute = this.currentRoute;
    this.currentRoute = matchingRoute;

    // push url in history
    window.history.pushState(null, null, url);
    // emit
    this.events.emit(ERouterEvent.ROUTE_CHANGE, matchingRoute);
  }

  /**
   * Get current route from URL
   *  https://www.npmjs.com/package/path-parser
   */
  protected getRouteFromUrl(url: string): IRoute {
    // check before start
    if (this._routes?.length === 0 || !this._routes) return;

    for (let i = 0; i < this._routes.length; i++) {
      // store current route
      let current = this._routes[i];
      debug("getRouteFromUrl > url from route to before test", current);

      const pathParser = new Path(current?.path);
      debug("getRouteFromUrl > pathParser", pathParser);

      // use path-parser
      const match = pathParser.test(url);
      debug("getRouteFromUrl > match", match);

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

  protected listenLinks() {}
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
