"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocation = void 0;
var useRouter_1 = require("./useRouter");
var useRoutes_1 = require("./useRoutes");
/**
 * useLocation
 */
var useLocation = function () {
    var router = useRouter_1.useRouter();
    var currentRoute = useRoutes_1.useRoutes().currentRoute;
    return [currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.path, function (url) { return router.updateRoute(url); }];
};
exports.useLocation = useLocation;
