"use strict";
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
exports.Link = void 0;
var react_1 = __importStar(require("react"));
var useLocation_1 = require("./useLocation");
var componentName = "Link";
var debug = require("debug")("front:" + componentName);
/**
 * @name Link
 */
function Link(props) {
    var _a = useLocation_1.useLocation(), location = _a[0], setLocation = _a[1];
    var handleClick = function (e) {
        var _a;
        e.preventDefault();
        setLocation(props.href);
        (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props);
    };
    var isActive = react_1.useMemo(function () { return location === props.href; }, [location, props.href]);
    return (react_1.default.createElement("a", { className: [componentName, props.className, isActive && "active"]
            .filter(function (e) { return e; })
            .join(" "), onClick: handleClick, href: props.href, children: props.children }));
}
exports.Link = Link;
