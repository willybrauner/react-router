import React, { useLayoutEffect, useMemo, useState } from "react";
import { ERouterEvent } from "./core/RouterManager";
import { TStackTransitionObject } from "./useStackPage";
import { useRouter } from "./useRouter";
import { useRoutes } from "./useRoutes";

export type TManageTransitions = {
  previousPage: TStackTransitionObject;
  currentPage: TStackTransitionObject;
  unmountPreviousPage: () => void;
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
function Stack(props: IProps) {
  // get current router instance
  const router = useRouter();

  // set number index to component instance
  const [pageIndex, setPageIndex] = useState<number>(0);

  // 1 get routes
  // prettier-ignore
  const {previousRoute, currentRoute, setPreviousRoute, setCurrentRoute} = useRoutes();

  // 2. animate when route state changed
  // need to be "layoutEffect" to execute transitions before render to avoid screen "clip"
  useLayoutEffect(() => {
    // emit animating state
    router.events.emit(ERouterEvent.ROUTER_STACK_IS_ANIMATING, true);

    props
      .manageTransitions({
        previousPage: router.stackPageTransitions?.[previousRoute?.path],
        currentPage: router.stackPageTransitions?.[currentRoute?.path],
        unmountPreviousPage: () => setPreviousRoute(null),
      })
      .then(() => {
        router.events.emit(ERouterEvent.ROUTER_STACK_IS_ANIMATING, false);
        setPageIndex(pageIndex + 1);
      });
  }, [previousRoute, currentRoute]);

  // 3. prepare components
  const Previous: any = useMemo(() => previousRoute?.component, [previousRoute]);
  const Current: any = useMemo(() => currentRoute?.component, [currentRoute]);

  return (
    <div className={componentName}>
      {Previous && <Previous key={pageIndex - 1} {...(previousRoute?.props || {})} />}
      {Current && <Current key={pageIndex} {...(currentRoute?.props || {})} />}
    </div>
  );
}

export default React.memo(Stack);
