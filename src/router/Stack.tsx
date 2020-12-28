import React, { useLayoutEffect, useState } from "react";
import { TStackTransitionObject } from "./useStack";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

export type TManageTransitions = {
  previousPage: TStackTransitionObject;
  currentPage: TStackTransitionObject;
  unmountPrev: () => void;
};

interface IProps {
  className?: string;
  manageTransitions: (T: TManageTransitions) => Promise<any>;
}

const componentName = "Stack";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name Stack
 */
// prettier-ignore
function Stack(props: IProps) {
  // get current router instance
  const router = useRouter();

  // set number index to component instance
  const [index, setIndex] = useState<number>(0);

  // 1 get routes
  const {previousRoute, setPreviousRoute, currentRoute} = useRoutes(()=> {
    setIndex(index + 1)
  }, [index])

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {
    const pageTransitions = router.stackPageTransitions;

    props.manageTransitions({
      previousPage: pageTransitions?.[previousRoute?.path],
      currentPage: pageTransitions?.[currentRoute?.path],
      unmountPrev: () => {
        setPreviousRoute(null);
      }
    }).then(() => {
      debug('manageTransitions promise resolve');
    })
  }, [currentRoute]);

  return (
    <div className={componentName}>
      {previousRoute?.component && (
        <previousRoute.component
          key={index - 1}
          {...(previousRoute.props || {})}
        />
      )}
      {currentRoute?.component && (
        <currentRoute.component
          key={index}
          {...(currentRoute.props || {})}
        />
      )}
    </div>
  );
}

export default Stack;
