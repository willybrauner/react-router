import React from "react";
import Link from "../router/Link";
import RouterStack, { TManageTransitions } from "../router/RouterStack";
import { Router } from "../router/Router";
import { routesList } from "../index";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  return (
    <Router routes={routesList} base={"/"}>
      <div className={componentName}>
        <nav>
          <ul>
            <li>
              <Link href={"/"}>Home</Link>{" "}
            </li>
            <li>
              <Link href={"/about"}>About</Link>{" "}
            </li>
            <li>
              <Link href={"/blog/article-1"}>blog article "article 1"</Link>
            </li>
          </ul>
        </nav>
        <RouterStack manageTransitions={manageTransitions} />
      </div>
    </Router>
  );
}

export default App;

/**
 * Manage Router Stack Transitions
 * @param previousPage
 * @param currentPage
 * @param destroyPreviousPageComponent
 */
export const manageTransitions = ({
  previousPage,
  currentPage,
  destroyPreviousPageComponent,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    const previousPageRef = previousPage?.rootRef.current;
    const currentPageRef = currentPage?.rootRef.current;
    debug("ref", {
      oldPageRef: previousPageRef,
      newPageRef: currentPageRef,
    });
    if (currentPageRef !== null) currentPageRef.style.visibility = "hidden";
    await previousPage?.playOut?.();

    destroyPreviousPageComponent();

    if (currentPageRef !== null) currentPageRef.style.visibility = "visible";
    await currentPage?.playIn?.();

    resolve();
  });
};
