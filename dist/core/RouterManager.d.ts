/// <reference types="node" />
import { Path } from "path-parser";
import React from "react";
import { EventEmitter } from "events";
export declare type TRoute = {
    path: string;
    component: React.ComponentType<any>;
    parser?: Path;
    props?: {
        [x: string]: any;
    };
    children?: TRoute[];
};
export declare enum ERouterEvent {
    PREVIOUS_ROUTE_CHANGE = "previous-route-change",
    CURRENT_ROUTE_CHANGE = "current-route-change",
    STACK_IS_ANIMATING = "stack-is-animating"
}
/**
 * Single router
 */
declare class RouterManager {
    base: string;
    routes: TRoute[];
    events: EventEmitter;
    currentRoute: TRoute;
    previousRoute: TRoute;
    id: number | string;
    fakeMode: boolean;
    constructor({ base, routes, fakeMode, id, }: {
        base?: string;
        routes?: TRoute[];
        fakeMode?: boolean;
        id?: number | string;
    });
    /**
     * Add new route object to routes array
     */
    addRoute(route: TRoute): void;
    /**
     * Update route
     * - get route object matching with current URL
     * - push URL in history
     * - emit selected route object on route-change event (listen by RouterStack)
     */
    updateRoute(url?: string, addToHistory?: boolean): void;
    /**
     * Get current route from url using path-parser
     * @doc https://www.npmjs.com/package/path-parser
     */
    getRouteFromUrl(url: string, routes?: TRoute[]): TRoute;
    /**
     * TODO
     * Use middleWare
     */
    use(): void;
}
export { RouterManager };
