import ReactDOM from "react-dom";
import * as React from "react";
import HomePage from "./pages/HomePage";
import Router, { IRoute } from "./router/Router";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import App from "./components/App";

const debug = require("debug")(`front:index`);

export const routes: IRoute[] = [
  {
    path: "/",
    component: HomePage,
    props: { name: "home" },
  },
  {
    path: "/about",
    component: AboutPage,
    props: { name: "about" },
  },
  {
    path: "/blog/:id",
    component: ArticlePage,
    props: {
      name: "article",
      color: "red",
    },
  },
];

// create new router instance
// router instance need to be pass as props to routerStack
export const routerInstance = new Router({ base: "/", routes });

/**
 * Init Application
 */
export function initApp() {
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();
