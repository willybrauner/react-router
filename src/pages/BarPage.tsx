import React, { useRef } from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
import Router from "../router/core/Router";
import FooPage from "./FooPage";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";
import HomePage from "./HomePage";
import ArticlePage from "./ArticlePage";
import YoloPage from "./YoloPage";

const componentName: string = "BarPage";
const debug = require("debug")(`front:${componentName}`);

const BarPage = () => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

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

  return (
    <div className={componentName} ref={rootRef}>
      Bar
    </div>
  );
};

export default BarPage;
