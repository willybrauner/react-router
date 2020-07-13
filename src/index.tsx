import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app/App";
import { IRoute } from "./Router";
import HomePage from "./pages/homePage/HomePage";
import AboutPage from "./pages/aboutPage/AboutPage";
import ArticlePage from "./pages/articlePage/ArticlePage";

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

/**
 * Init Application
 */
export function initApp() {
  ReactDOM.render(<App />, document.getElementById("Root"));
}

initApp();
