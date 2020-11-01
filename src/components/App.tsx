import React, { useRef } from "react";
import Link from "../router/Link";
import RouterStack from "../router/RouterStack";
import { routerInstance } from "../index";
import { TPageTransitionObject } from "../router/usePageTransition";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  const manageTransitions = (
    pOldPage: TPageTransitionObject,
    pNewPage: TPageTransitionObject
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      debug({ pOldPage, pNewPage });
      const oldPageRef = pOldPage?.rootRef?.current;
      const newPageRef = pNewPage?.rootRef?.current;

      // hide new page by default
      //if (newPageRef !== null) newPageRef.style.visibility = "hidden";
      // playOut old page
      pOldPage && (await pOldPage?.playOut?.());

      //if (newPageRef !== null) newPageRef.style.visibility = "visible";
      // playIn new page
      pNewPage && (await pNewPage?.playIn?.());
      // All done
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
