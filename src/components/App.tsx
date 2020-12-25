import React from "react";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";

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
 * @param mountCurrent
 */
const manageTransitions = ({
  previousPage,
  currentPage,
  unmountPrev,
  mountCurrent,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    const previousPageRef = previousPage?.rootRef.current;
    const currentPageRef = currentPage?.rootRef.current;

    debug("> ref", {
      oldPageRef: previousPageRef,
      newPageRef: currentPageRef,
    });

    //if (currentPageRef != null) currentPageRef.style.visibility = "hidden";

    if (previousPage) {
      debug("> playOut prev...");
      await previousPage.playOut();
      debug("> playOut prev ended");
      debug("unmount prev");
      unmountPrev();
    }

    //if (currentPageRef != null) currentPageRef.style.visibility = "visible";

    debug("> mount current");
    //await mountCurrent();

    debug("> playIn curr...");
    currentPage && (await currentPage.playIn());
    debug("> playIn curr ended");

    resolve();
  });
};
