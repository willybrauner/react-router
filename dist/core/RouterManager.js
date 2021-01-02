"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterManager = exports.ERouterEvent = void 0;
var path_parser_1 = require("path-parser");
var events_1 = require("events");
var GlobalRouter_1 = __importDefault(require("./GlobalRouter"));
var debug = require("debug")("front:RouterManager");
var ERouterEvent;
(function (ERouterEvent) {
    ERouterEvent["PREVIOUS_ROUTE_CHANGE"] = "previous-route-change";
    ERouterEvent["CURRENT_ROUTE_CHANGE"] = "current-route-change";
    // TODO add listener to stack and create hook useStackIsAnimating();
    ERouterEvent["STACK_IS_ANIMATING"] = "stack-is-animating";
})(ERouterEvent = exports.ERouterEvent || (exports.ERouterEvent = {}));
/**
 * Single router
 */
var RouterManager = /** @class */ (function () {
    function RouterManager(_a) {
        var _this = this;
        var _b = _a.base, base = _b === void 0 ? "/" : _b, _c = _a.routes, routes = _c === void 0 ? null : _c, _d = _a.fakeMode, fakeMode = _d === void 0 ? false : _d, _e = _a.id, id = _e === void 0 ? 1 : _e;
        // routes list
        this.routes = [];
        // create event emitter
        this.events = new events_1.EventEmitter();
        this.base = base;
        this.id = id;
        this.fakeMode = fakeMode;
        routes.forEach(function (el) { return _this.addRoute(el); });
        this.updateRoute();
        window.addEventListener("popstate", function (e) {
            debug(_this.id, "pass dans popstate", e);
            _this.updateRoute(window.location.pathname, false);
        });
    }
    /**
     * Add new route object to routes array
     */
    RouterManager.prototype.addRoute = function (route) {
        var routeParams = __assign(__assign({}, route), { parser: new path_parser_1.Path(route.path) });
        // keep routes in local array
        this.routes.push(routeParams);
    };
    /**
     * Update route
     * - get route object matching with current URL
     * - push URL in history
     * - emit selected route object on route-change event (listen by RouterStack)
     */
    RouterManager.prototype.updateRoute = function (url, addToHistory) {
        var _a, _b;
        if (url === void 0) { url = this.fakeMode ? this.base : window.location.pathname; }
        if (addToHistory === void 0) { addToHistory = true; }
        // get matching route depending of current URL
        var matchingRoute = this.getRouteFromUrl(url);
        if (!matchingRoute) {
            debug(this.id, "updateRoute > No matching route. return", { matchingRoute: matchingRoute, url: url });
            return;
        }
        // si currentRoute est un child (contient ~? ex: ~/bar)
        // et matchingRoute ...
        if (((_a = this.currentRoute) === null || _a === void 0 ? void 0 : _a.path) === (matchingRoute === null || matchingRoute === void 0 ? void 0 : matchingRoute.path)) {
            debug(this.id, "updateRoute > This is the same URL, return.", {
                currentRoutePath: (_b = this.currentRoute) === null || _b === void 0 ? void 0 : _b.path,
                matchingRoutePath: matchingRoute === null || matchingRoute === void 0 ? void 0 : matchingRoute.path,
            });
            return;
        }
        this.previousRoute = this.currentRoute;
        this.currentRoute = matchingRoute;
        if (!this.fakeMode) {
            addToHistory
                ? window.history.pushState(null, null, url)
                : window.history.replaceState(null, null, url);
        }
        this.events.emit(ERouterEvent.PREVIOUS_ROUTE_CHANGE, this.previousRoute);
        this.events.emit(ERouterEvent.CURRENT_ROUTE_CHANGE, this.currentRoute);
        GlobalRouter_1.default.routeCounter++;
    };
    /**
     * Get current route from url using path-parser
     * @doc https://www.npmjs.com/package/path-parser
     */
    // prettier-ignore
    RouterManager.prototype.getRouteFromUrl = function (url, routes) {
        if (routes === void 0) { routes = this.routes; }
        if (!routes || (routes === null || routes === void 0 ? void 0 : routes.length) === 0)
            return;
        for (var i = 0; i < routes.length; i++) {
            var currentRoute = routes[i];
            // create parser & matcher
            var currentRoutePath = currentRoute.path.slice(1) || "/";
            var pathParser = new path_parser_1.Path(currentRoutePath);
            var currentUrl = url === "/" ? url : url === null || url === void 0 ? void 0 : url.replace(this.base, "");
            // debug(this.id,`getRouteFromUrl: currentUrl "${currentUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(currentUrl));
            var match = void 0;
            // if url match with current route path
            // or if 1rst part of url match with  current route path
            match = pathParser.test(currentUrl) || null;
            /**
             * Needed if access to /foo/bar sub-router on first load
             * router 1 need to instantiate '/foo' for router 2 will be able to render '/bar'
             * So we check URL part
             */
            var partialMatch = false;
            // if not match
            if (!match) {
                partialMatch = true;
                var currentUrlParts = currentUrl.split('/');
                for (var i_1 = 0; i_1 < currentUrlParts.length; i_1++) {
                    // get one part of the url array
                    var specificPartOfUrl = currentUrlParts[i_1];
                    // debug(this.id,`getRouteFromUrl: specificPartOfUrl "${specificPartOfUrl}" match with "${currentRoutePath}" ?`, !!pathParser.test(specificPartOfUrl));
                    // if match,register it
                    if (pathParser.test(specificPartOfUrl)) {
                        match = pathParser.test(specificPartOfUrl);
                    }
                }
            }
            // if current route path match with the param url
            if (match) {
                // prepare route object
                var routeObj = {
                    path: currentRoute.path,
                    component: currentRoute.component,
                    children: currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.children,
                    parser: pathParser,
                    props: __assign({ params: match }, (currentRoute.props || {})),
                };
                debug(this.id, 'getRouteFromUrl: > MATCH routeObj', routeObj);
                return routeObj;
            }
        }
    };
    /**
     * TODO
     * Use middleWare
     */
    RouterManager.prototype.use = function () { };
    return RouterManager;
}());
exports.RouterManager = RouterManager;
