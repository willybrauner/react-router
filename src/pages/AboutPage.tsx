import React, { useRef } from "react";
import Router from "../router/core/Router";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import { routesList } from "../index";

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
      {/*<Router*/}
      {/*  routes={routesList.find((el) => el.path == "/about").children}*/}
      {/*  // FIXME pas utilisé pour le moment dans RouterManager*/}
      {/*  base={"/about"}*/}
      {/*  key={"/about"}*/}
      {/*>*/}
      {/*  <div className={componentName}>*/}
      {/*    <nav>*/}
      {/*      <ul>*/}
      {/*        <li>*/}
      {/*          <Link href={"/about/foo"}>Foo</Link>{" "}*/}
      {/*        </li>*/}
      {/*        <li>*/}
      {/*          <Link href={"/about/bar"}>Bar</Link>{" "}*/}
      {/*        </li>*/}
      {/*      </ul>*/}
      {/*    </nav>*/}
      {/*    <Stack manageTransitions={manageTransitions} key={"stack-2"} />*/}
      {/*  </div>*/}
      {/*</Router>*/}
    </div>
  );
};

export default React.memo(AboutPage);

// /**
//  * Manage Router Stack Transitions
//  * @param previousPage
//  * @param currentPage
//  * @param unmountPreviousPage
//  */
// const manageTransitions = ({
//   previousPage,
//   currentPage,
//   unmountPreviousPage,
// }: TManageTransitions): Promise<any> => {
//   return new Promise(async (resolve) => {
//     const previousPageRef = previousPage?.rootRef.current;
//     const currentPageRef = currentPage?.rootRef.current;
//
//     debug("ref", { previousPageRef, currentPageRef });
//
//     if (currentPageRef != null) currentPageRef.style.visibility = "hidden";
//     await previousPage?.playOut?.();
//
//     unmountPreviousPage();
//
//     if (currentPageRef != null) currentPageRef.style.visibility = "visible";
//     await currentPage?.playIn?.();
//
//     resolve();
//   });
// };
