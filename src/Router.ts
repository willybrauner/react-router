import { Path } from "path-parser";
const debug = require("debug")("front:Router");

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
import { ReactNode } from "react";

export interface IRouteData {
  path: string;
  component: ReactNode;
  props?: { [x: string]: any };
  parser: Path;
}

export interface IRoute {
  path: string;
  component: ReactNode;
  props?: { [x: string]: any[] };
}

export default class Router {
  // base url
  public base: string;
  // routes list
  protected _routes: IRoute[] = [];

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
      debug("routes", routes);
      routes.forEach((el) => {
        this.add(el.path, el.component, el.props);
      });
    }

    this.handleUrlChange();
  }

  /**
   * Add new route to routes array
   */
  public add(path: string, component, props) {
    const routeParams: IRouteData = {
      path,
      component,
      props,
      parser: new Path(path),
    };

    // keep routes in local array
    this._routes.push(routeParams);
  }

  /**
   * Use middleWare
   */
  public use() {}

  /**
   * Get current route from URL
   *  https://www.npmjs.com/package/path-parser
   */
  protected getRouteFromUrl(url: string) {
    debug("> url from param", url);

    for (let i = 0; i < this._routes.length; i++) {
      debug("url from route to before test", this._routes[i]?.path);
      const pathParser = new Path(this._routes[i]?.path);
      debug("> pathParser", pathParser);

      const match = pathParser.test(url);
      debug("> match", match);

      if (match) {
        return {
          route: this._routes[i],
          params: match,
        };
      }
    }
  }

  /**
   * Check when URL change
   */
  protected handleUrlChange() {
    const currentUrl = window.location.pathname;
    const route = this.getRouteFromUrl(currentUrl);

    if (!route) {
      console.warn("Error, there is no route.");
      return;
    }

    // TODO return le composant
    const component = "";
  }
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
