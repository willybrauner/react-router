import ReactDOM from "react-dom";
import * as React from "react";
import HomePage from "./pages/HomePage";
import { TRoute } from "./router/core/RouterManager";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import App from "./components/App";
import Router from "./router/Router";
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
    children: [
      {
        path: "/foo",
        component: FooPage,
      },
      {
        path: "/bar",
        component: BarPage,
      },
    ],
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
    <Router routes={routesList} base={process.env.APP_BASE} id={1}>
      <App />
    </Router>,
    document.getElementById("Root")
  );
}

initApp();
