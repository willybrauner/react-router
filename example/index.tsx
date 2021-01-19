import ReactDOM from "react-dom";
import * as React from "react";
import { languageMiddleware, Router, TRoute } from "../src";

import App from "./App";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import FooPage from "./pages/FooPage";
import BarPage from "./pages/BarPage";
import "./index.css";
import { forwardRef } from "react";

const debug = require("debug")(`front:index`);

/**
 * Prepare routes list
 */
export const routesList: TRoute[] = [
  {
    path: "/",
    component: HomePage,
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
    path: "/:rest",
    component: forwardRef((props, r) => <div className="NotFoundPage">Not Found</div>),
  },
];

/**
 * Prepare middleware
 */
const language = languageMiddleware({
  languages: [
    { key: "fr", code: "fr-FR", default: true },
    { key: "en", code: "en-US" },
  ],
  showDefault: true,
});

/**
 * Init Application
 */
ReactDOM.render(
  <Router routes={routesList} base={"/"} middlewares={[language]}>
    <App />
  </Router>,
  document.getElementById("root")
);
