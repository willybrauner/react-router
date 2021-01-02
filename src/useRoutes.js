"use strict";
exports.__esModule = true;
exports.useRoutes = void 0;
var RouterManager_1 = require("./core/RouterManager");
var useRouter_1 = require("./useRouter");
var react_1 = require("react");
var componentName = "useRoutes";
var debug = require("debug")("front:" + componentName);
/**
 * useRoutes
 */
var useRoutes = function (cb, dep) {
    if (dep === void 0) { dep = []; }
    var router = useRouter_1.useRouter();
    var _a = react_1.useState(router.previousRoute), previousRoute = _a[0], setPreviousRoute = _a[1];
    var _b = react_1.useState(router.currentRoute), currentRoute = _b[0], setCurrentRoute = _b[1];
    var handleCurrentRouteChange = function (route) {
        cb === null || cb === void 0 ? void 0 : cb();
        setCurrentRoute(route);
    };
    var handlePreviousRouteChange = function (route) {
        setPreviousRoute(route);
    };
    react_1.useLayoutEffect(function () {
        router.events.on(RouterManager_1.ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
        router.events.on(RouterManager_1.ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
        return function () {
            router.events.off(RouterManager_1.ERouterEvent.CURRENT_ROUTE_CHANGE, handleCurrentRouteChange);
            router.events.off(RouterManager_1.ERouterEvent.PREVIOUS_ROUTE_CHANGE, handlePreviousRouteChange);
        };
    }, dep);
    return {
        previousRoute: previousRoute,
        currentRoute: currentRoute,
        setPreviousRoute: setPreviousRoute,
        setCurrentRoute: setCurrentRoute
    };
};
exports.useRoutes = useRoutes;
