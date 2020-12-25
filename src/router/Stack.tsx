import React, { useLayoutEffect, useRef, useState } from "react";
import { TStackTransitionObject } from "./useStack";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";
import { TRoute } from "./core/RouterManager";

export type TManageTransitions = {
  previousPage: TStackTransitionObject;
  currentPage: TStackTransitionObject;
  unmountPrev: () => void;
  mountCurrent: any;
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
   const { previousRoute, currentRoute } = useRoutes();
  const [prev, setPrev] = useState<TRoute>(null);
  const [curr, setCurr] = useState<TRoute>(currentRoute);

   useLayoutEffect(()=> {
     setPrev(previousRoute)
     setCurr(currentRoute);
     setIndex(index + 1);
   }, [previousRoute, currentRoute])


  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {
    debug("prev, curr", { prev, curr })

    const pageTransitions = router.stackPageTransitions;

    props.manageTransitions({
      previousPage: pageTransitions?.[prev?.path],
      currentPage: pageTransitions?.[curr?.path],
      mountCurrent: () => {
        //setCurr(currentRoute);
      },
      unmountPrev: () => setPrev(null),
    }).then(() => {
      debug('manageTransitions promise resolve');
    })
  }, [index]);


  return (
    <div className={componentName}>
      {prev?.component && (
        <prev.component
          key={index - 1}
          {...(prev.props || {})}
        />
      )}
      {curr?.component && (
        <curr.component
          key={index}
          {...(curr.props || {})}
        />
      )}
    </div>
  );
}

export default Stack;
