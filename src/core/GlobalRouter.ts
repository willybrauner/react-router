import { EventEmitter } from "events";
import { TRoute } from "./RouterManager";
const debug = require("debug")("front:GlobalRouter");

export enum EGlobalRouterEvent {
  CURRENT_ROUTE = "current-route",
  ROUTE_COUNTER = "router-counter",
}

/**
 * Global router
 */
class GlobalRouter {
  public events: EventEmitter = new EventEmitter();
  public routeCounter = 0;
  public isFirstRoute;
  public currentRouteList;


  public currentRoute: TRoute;
  public previousRoute: TRoute;




}

export default new GlobalRouter();
