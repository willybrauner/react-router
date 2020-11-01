import React, { useRef } from "react";
import Link from "../router/Link";
import RouterStack, { TManageTransitions } from "../router/RouterStack";
import { routerInstance } from "../index";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Manage Router Stack Transitions
   * @param previousPage
   * @param currentPage
   * @param destroyPreviousPageComponent
   */
  const manageTransitions = ({
    previousPage,
    currentPage,
    destroyPreviousPageComponent: destroyPreviousPageComponent,
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
      // destroy previous page component
      destroyPreviousPageComponent();

      if (currentPageRef !== null) currentPageRef.style.visibility = "visible";
      await currentPage?.playIn?.();

      // ended end
      resolve();
    });
  };

  return (
    <div className={componentName} ref={rootRef}>
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

      <RouterStack
        routerInstance={routerInstance}
        manageTransitions={manageTransitions}
      />
    </div>
  );
}

export default App;
