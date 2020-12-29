import { TRoute } from "./RouterManager";
import { EventEmitter } from "events";

/**
 * Global router
 */
class RoutersWrapper {
  /**
   * Static properties
   */
  public fakeMode = false;

  /**
   * Dynamic properties
   */
  public events: EventEmitter = new EventEmitter();
  //
  public routeCounter = 0;
  //
  public routerInstanceLength = 0;
  //
  public currentRoute: TRoute;

  public isFirstRoute = this.routeCounter === 1;
}

export default new RoutersWrapper();
