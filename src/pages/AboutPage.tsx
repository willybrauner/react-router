import React, { useRef } from "react";
import Router from "../router/core/Router";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import FooPage from "./FooPage";
import BarPage from "./BarPage";

const componentName: string = "AboutPage";
const debug = require("debug")(`front:${componentName}`);

const AboutPage = () => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

  return (
    <div className={componentName} ref={rootRef}>
      About
      <Router
        routes={[
          { path: "/about/foo", component: FooPage },
          { path: "/about/bar", component: BarPage },
        ]}
        base={process.env.APP_BASE}
        id={2}
      >
        <div className={componentName}>
          <nav>
            <ul>
              <li>
                <Link href={"/about/foo"}>Foo</Link>{" "}
              </li>
              <li>
                <Link href={"/about/bar"}>Bar</Link>{" "}
              </li>
            </ul>
          </nav>
          <Stack manageTransitions={manageTransitions} key={"stack-2"} />
        </div>
      </Router>
    </div>
  );
};

const manageTransitions = ({
  previousPage,
  currentPage,
  unmountPrev,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    const previousPageRef = previousPage?.rootRef.current;
    const currentPageRef = currentPage?.rootRef.current;
    debug("> ref", { previousPageRef, currentPageRef });

    if (currentPageRef) currentPageRef.style.visibility = "hidden";

    if (previousPage) {
      await previousPage.playOut();
      debug("> previousPage playOut ended");

      unmountPrev();
      debug("previousPage unmount");
    }

    if (currentPageRef) currentPageRef.style.visibility = "visible";

    await currentPage?.playIn();
    debug("> currentPage playIn ended");

    resolve();
  });
};

export default AboutPage;
