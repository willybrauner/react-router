"use strict";
exports.__esModule = true;
exports.useRouter = void 0;
var react_1 = require("react");
var Router_1 = require("./Router");
/**
 * Return current router instance
 * Instance depend of inside of witch provider useRouter is called
 */
var useRouter = function () { return react_1.useContext(Router_1.RouterContext); };
exports.useRouter = useRouter;
