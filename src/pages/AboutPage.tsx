import React, { useRef } from "react";
import { transitionsHelper } from "../helper/transitionsHelper";

import FooPage from "./FooPage";
import BarPage from "./BarPage";
import { usePageTransition } from "../router/usePageTransition";
import { Router } from "../router/core/Router";
import { IRoute } from "../router/core/RouterManager";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import { routesList } from "../index";

const componentName: string = "AboutPage";
const debug = require("debug")(`front:${componentName}`);

const AboutPage = () => {
  const rootRef = useRef(null);

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<any> => {
    return transitionsHelper(rootRef.current, true);
  };

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<any> => {
    return transitionsHelper(rootRef.current, false);
  };

  /**
   * Register page for ViewStack
   * NOTE: each page of ViewStack need to be register to work.
   * Minimal register should be: usePageRegister({ componentName, rootRef });
   * (remove playIn and playOut if not use)
   */
  usePageTransition({ componentName, rootRef, playIn, playOut });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
      <Router
        routes={routesList.find((el) => el.path == "/about").children}
        // FIXME pas utilisé pour le moment dans RouterManager
        base={"/about"}
      >
        <div className={componentName}>
          <nav>
            <ul>
              <li>
                <Link href={"/about/foo"}>Foo</Link>{" "}
              </li>
              <li>
                <Link href={"/about/section-1"}>Bar</Link>{" "}
              </li>
            </ul>
          </nav>
          <Stack manageTransitions={manageTransitions} />
        </div>
      </Router>
    </div>
  );
};

export default AboutPage;

/**
 * Manage Router Stack Transitions
 * @param previousPage
 * @param currentPage
 * @param destroyPreviousPageComponent
 */
const manageTransitions = ({
  previousPage,
  currentPage,
  destroyPreviousPageComponent,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    const previousPageRef = previousPage?.rootRef.current;
    const currentPageRef = currentPage?.rootRef.current;

    debug("ref", { previousPageRef, currentPageRef });

    if (currentPageRef != null) currentPageRef.style.visibility = "hidden";
    await previousPage?.playOut?.();

    destroyPreviousPageComponent();

    if (currentPageRef != null) currentPageRef.style.visibility = "visible";
    await currentPage?.playIn?.();

    resolve();
  });
};
