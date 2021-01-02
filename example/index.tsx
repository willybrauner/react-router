import ReactDOM from "react-dom";
import * as React from "react";
import { Router, TRoute } from "../src";

import App from "./App";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import FooPage from "./pages/FooPage";
import BarPage from "./pages/BarPage";
import "./index.css";

const debug = require("debug")(`front:index`);

/**
 * Define routes list
 */
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
ReactDOM.render(
  <Router routes={routesList} base={process.env.APP_BASE}>
    <App />
  </Router>,
  document.getElementById("root")
);
