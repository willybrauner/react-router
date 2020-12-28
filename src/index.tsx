import ReactDOM from "react-dom";
import * as React from "react";
import HomePage from "./pages/HomePage";
import { TRoute } from "./router/core/RouterManager";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import App from "./components/App";
import Router from "./router/core/Router";
import FooPage from "./pages/FooPage";
import BarPage from "./pages/BarPage";

const debug = require("debug")(`front:index`);

export const routesList: TRoute[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/about",
    component: AboutPage,
    // children: [
    //   {
    //     path: "/about/foo",
    //     component: FooPage,
    //   },
    //   {
    //     path: "/about/bar",
    //     component: BarPage,
    //   },
    //],
  },
  {
    path: "/blog/:id",
    component: ArticlePage,
    props: {
      name: "article",
      color: "red",
    },
  },
  {
    path: "/:rest",
    component: () => <div className="NotFoundPage">Not Found</div>,
  },
];

/**
 * Init Application
 */
export function initApp() {
  ReactDOM.render(
    <Router routes={routesList} base={"/"}>
      <App />
    </Router>,
    document.getElementById("Root")
  );
}

initApp();
