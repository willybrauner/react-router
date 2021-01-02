import { EventEmitter } from "events";
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
}

export default new GlobalRouter();