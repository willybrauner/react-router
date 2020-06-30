import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";

import App from "components/app/App";
const debug = require("debug")(`front:index`);

/**
 * Init Application
 */
export function initApp() {
  /**
   * Start
   */
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();
