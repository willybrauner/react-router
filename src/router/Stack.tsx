import React, { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

export type TManageTransitions = {
  previousPage;
  currentPage;
  unmountPrev: () => void;
  currentRouteIsReady: () => Promise<any>;
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

  const prevRef = useRef(null);
  const currentRef = useRef(null);



  // 1 get routes
  const {previousRoute, setPreviousRoute, currentRoute} = useRoutes(()=> {
    setIndex(index + 1)
  }, [index])

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {

    debug("refs",{currentRef, prevRef})
    debug(router.id, "routes", {previousRoute, currentRoute})

    if (!currentRoute) {
      debug(router.id, "current route doesn't exist, return.");
      return;
    }

    debug('currentRef.current?.isReadyPromise',currentRef.current?.isReadyPromise)

    props.manageTransitions({
      previousPage: {
        componentName: "prev",
        rootRef: prevRef,
        playIn: prevRef.current?.playIn,
        playOut: prevRef.current?.playOut,
      },
      currentPage: {
        componentName: "current",
        rootRef: currentRef,
        playIn: currentRef.current?.playIn,
        playOut: currentRef.current?.playOut,
    },

      currentRouteIsReady: ()=> currentRef.current?.isReadyPromise,
      
      unmountPrev: () => {
        setPreviousRoute(null);
      }
    }).then(() => {
      debug(router.id, 'manageTransitions promise resolve!');
    })
  }, [currentRoute]);

  return (
    <div className={componentName}>
      {previousRoute?.component && (
        <previousRoute.component
          ref={prevRef}
          key={index - 1}
          {...(previousRoute.props || {})}
        />
      )}
      {currentRoute?.component && (
        <currentRoute.component
          ref={currentRef}
          key={index}
          {...(currentRoute.props || {})}
        />
      )}
    </div>
  );
}

export default Stack;
