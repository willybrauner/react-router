import { TRoute } from "./RouterManager";
import { EventEmitter } from "events";

export enum EGlobalRouterEvent {
  ROUTE_COUNTER,
  ROUTER_INSTANCES_LENGTH,
}

/**
 * Global router
 */
class GlobalRouter {
  public events: EventEmitter = new EventEmitter();
  public routeCounter = 0;
  //
  public routerInstanceLength = 0;
  //
  public currentRoute: TRoute;
  public previousRoute: TRoute;

  public isFirstRoute = this.routeCounter === 1;

  /**
   * --------------
   * RETOUR à une route 1er niveau qui possède un sub-router
   * ------------
   * ON veut:
   *
   * Si on est sur /about/bar
   * au click de "/about", on veut que router 2 stack (/bar) se playOut sans rien playIn par la suite
   *
   * Actuellement on a un comportement normal, mais pas très UI
   *
   * - Une sous stack doit pouvoir recevoir l'instruction de playOut uniquement ?
   *
   * - Ou alors au clic de "/about" stack 1 doit animer son playOut + playIn même si currentRoute = "/about" et matchingRoute = "/about"
   * Seulement si il a une sous-stack imbriqué
   *
   *-----------------
   * LE RETOUR FONCTIONNE QUAND path: currentRoute.path n'est pas la meme que /about au premier chargement
   * (pour le constater - charger l'app sur /about/bar et cliquer sur /about, ça marche.
   * quand on trigg un sous-router sa stack parent doit donc vider le state "previousRoute" ?
   *
   *
   */

  /**
   * Erreur popState quand on est sur un sous-router...
   *
   */
}

export default new GlobalRouter();
