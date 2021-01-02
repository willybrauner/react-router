"use strict";
exports.__esModule = true;
exports.EGlobalRouterEvent = void 0;
var events_1 = require("events");
var debug = require("debug")("front:GlobalRouter");
var EGlobalRouterEvent;
(function (EGlobalRouterEvent) {
    EGlobalRouterEvent["CURRENT_ROUTE"] = "current-route";
    EGlobalRouterEvent["ROUTE_COUNTER"] = "router-counter";
})(EGlobalRouterEvent = exports.EGlobalRouterEvent || (exports.EGlobalRouterEvent = {}));
/**
 * Global router
 */
var GlobalRouter = /** @class */ (function () {
    function GlobalRouter() {
        this.events = new events_1.EventEmitter();
        this.routeCounter = 0;
    }
    return GlobalRouter;
}());
exports["default"] = new GlobalRouter();
