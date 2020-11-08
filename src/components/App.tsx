import React, { useEffect } from "react";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import Router from "../router/core/Router";
import { routesList } from "../index";
import { useRouter } from "../router/useRouter";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  return (
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
      <Stack manageTransitions={manageTransitions} key={"stack-1"} />
    </div>
  );
}

export default App;

/**
 * Manage Router Stack Transitions
 * @param previousPage
 * @param currentPage
 * @param unmountPreviousPage
 */
const manageTransitions = ({
  previousPage,
  currentPage,
  unmountPreviousPage,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    const previousPageRef = previousPage?.rootRef.current;
    const currentPageRef = currentPage?.rootRef.current;

    debug("ref", {
      oldPageRef: previousPageRef,
      newPageRef: currentPageRef,
    });

    if (currentPageRef != null) currentPageRef.style.visibility = "hidden";
    await previousPage?.playOut();

    unmountPreviousPage();

    if (currentPageRef != null) currentPageRef.style.visibility = "visible";
    await currentPage?.playIn();

    resolve();
  });
};
