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
    env: process.env.ENV,
    baseURL: process.env.APP_BASE,
    routerBaseURL: process.env.APP_BASE,
  };

  // ...

  /**
   * Start
   */
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();
