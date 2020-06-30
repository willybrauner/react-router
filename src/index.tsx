import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app/App";
import Router, { IRoute } from "./Router";

const debug = require("debug")(`front:index`);

/**
 * Init Application
 */
export function initApp() {
  /**
   * Router
   */

  const prepareRoutes: IRoute[] = [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/about",
      component: AboutPage,
    },
  ];

  const router = new Router({ base: "/", routes: prepareRoutes });

  /**
   * Start
   */
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();

/**
 * Pages
 * Important que ce soit des fonctions nommées
 */
export function HomePage() {
  return <div className={"Home"}>Home</div>;
}

export function AboutPage() {
  return <div className={"About"}>About</div>;
}
