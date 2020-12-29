import React, { useRef } from "react";
import Router from "../router/core/Router";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import FooPage from "./FooPage";
import BarPage from "./BarPage";
import { useLocation } from "../router/useLocation";
import { useRouter } from "../router/useRouter";

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

  // test of redirection

  return (
    <div className={componentName} ref={rootRef}>
      About
      <AboutPageNestedRouter base={"/about/"}>
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
      </AboutPageNestedRouter>
    </div>
  );
};

/**
 * AboutPage nested router
 * @param props
 */
const AboutPageNestedRouter = (props) => {
  const router = useRouter();
  const [parentLocation, setParentLocation] = useLocation();

  const nestedBase = `${router.base}${props.base}`.replace("//", "/");
  debug("nestedBase", nestedBase);
  //debug("parentLocation", parentLocation);

  return (

    <Router
      base={nestedBase}
      key={nestedBase}
      subRouter={true}
      routes={[
        { path: "/foo", component: FooPage },
        { path: "/bar", component: BarPage },
      ]}
      id={2}
    >
      {props.children}
    </Router>
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
