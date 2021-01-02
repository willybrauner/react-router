/// <reference types="node" />
import { EventEmitter } from "events";
export declare enum EGlobalRouterEvent {
    CURRENT_ROUTE = "current-route",
    ROUTE_COUNTER = "router-counter"
}
/**
 * Global router
 */
declare class GlobalRouter {
    events: EventEmitter;
    routeCounter: number;
    isFirstRoute: any;
    currentRouteList: any;
}
declare const _default: GlobalRouter;
export default _default;
