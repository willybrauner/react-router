import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";

import App from "components/app/App";
import { config } from "./config";
const debug = require("debug")(`front:index`);

/**
 * Init Application
 */
export function initApp() {
  /**
   * Prepare
   */
  config.register = {
    version: require("../package.json").version,
    baseUrl: process.env.APP_BASE,
    routerBaseUrl: process.env.APP_BASE,
    env: process.env.ENV,
  };

  // ...

  /**
   * Start
   */
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();
