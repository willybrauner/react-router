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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
var react_1 = __importStar(require("react"));
var useRouter_1 = require("./useRouter");
var useRoutes_1 = require("./useRoutes");
var RouterManager_1 = require("./core/RouterManager");
var componentName = "Stack";
var debug = require("debug")("front:" + componentName);
/**
 * @name Stack
 */
function Stack(props) {
    // get current router instance
    var router = useRouter_1.useRouter();
    // set number index to component instance
    var _a = react_1.useState(0), index = _a[0], setIndex = _a[1];
    // handle components with refs
    var prevRef = react_1.useRef(null);
    var currentRef = react_1.useRef(null);
    // 1 get routes
    var _b = useRoutes_1.useRoutes(function () {
        setIndex(index + 1);
    }, [index]), previousRoute = _b.previousRoute, setPreviousRoute = _b.setPreviousRoute, currentRoute = _b.currentRoute;
    // 2. animate when route state changed
    // need to be "layoutEffect" to play transitions before render, to avoid screen "clip"
    react_1.useLayoutEffect(function () {
        debug(router.id, "routes", { previousRoute: previousRoute, currentRoute: currentRoute });
        if (!currentRoute) {
            debug(router.id, "current route doesn't exist, return.");
            return;
        }
        router.events.emit(RouterManager_1.ERouterEvent.STACK_IS_ANIMATING, true);
        // prepare unmount function
        var unmountPreviousPage = function () { return setPreviousRoute(null); };
        // execute transitions function from outside the stack
        props
            .manageTransitions({
            previousPage: prevRef.current,
            currentPage: currentRef.current,
            unmountPreviousPage: unmountPreviousPage,
        })
            // when transitions are ended
            .then(function () {
            debug(router.id, "manageTransitions promise resolve!");
            // if previous page wasn't unmount manually, we force unmount here
            unmountPreviousPage();
            router.events.emit(RouterManager_1.ERouterEvent.STACK_IS_ANIMATING, false);
        });
    }, [currentRoute]);
    return (react_1.default.createElement("div", { className: componentName },
        (previousRoute === null || previousRoute === void 0 ? void 0 : previousRoute.component) && (react_1.default.createElement(previousRoute.component, __assign({ ref: prevRef, key: index - 1 }, (previousRoute.props || {})))),
        (currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.component) && (react_1.default.createElement(currentRoute.component, __assign({ ref: currentRef, key: index }, (currentRoute.props || {}))))));
}
exports.Stack = Stack;
