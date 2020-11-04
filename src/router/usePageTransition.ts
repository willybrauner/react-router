import { MutableRefObject, useEffect, useLayoutEffect, useMemo } from "react";
const debug = require("debug")("front:usePageTransition");

export type TPageTransition = {
  [currentPath: string]: TPageTransitionObject;
};

export type TPageTransitionObject = {
  // component name
  componentName: string;
  // component ref
  rootRef: MutableRefObject<any>;
  // playIn page transition promise handler
  // if not set, new promise is set by default
  playIn?: () => Promise<any>;
  // playOut page transition promise handler
  // if not set, new promise is set by default
  playOut?: () => Promise<any>;
  // page is ready state allow to now if page is ready (data fetching or whatever...)
  isReady?: boolean;
  // wait bool isReady pass to true from promise
  isReadyPromise?: () => Promise<any>;
};

/**
 * TODO pourrait être dans le Router
 * Pages register accessor
 * All pages properties were store in "pageTransition.list"
 */
export const pageTransition = {
  set register(pPage: TPageTransitionObject | Object) {
    this.list = pPage;
  },
  list: {} as TPageTransition,
};

/**
 * @name usePageTransition
 * @description This Hook allow to register each page properties
 * This pages stack list can be call from everywhere
 */
export function usePageTransition(
  {
    componentName,
    playIn = () => Promise.resolve(),
    playOut = () => Promise.resolve(),
    rootRef,
    isReady = true,
  }: TPageTransitionObject,
  pDependencies?: any[]
) {
  // Page is ready deferred promise
  // Create a promise and get resolve anywhere
  const readyDeferred = useMemo(() => {
    const deferred: any = {};
    deferred.promise = new Promise((resolve) => {
      deferred.resolve = resolve;
    });
    return deferred;
  }, []);

  // resolve deferred if isReady param is true
  useEffect(() => {
    isReady && readyDeferred.resolve();
  }, [isReady]);

  // register pages before render
  useLayoutEffect(() => {
    // build a new page transition object
    const newPageTransition = {
      [window.location.pathname]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        isReady,
        isReadyPromise: () => readyDeferred.promise,
      },
    };

    // merge new object on page transition object
    pageTransition.register = {
      ...pageTransition.list,
      ...newPageTransition,
    };

    debug(`pageTransition list`, pageTransition.list);
  }, [...(pDependencies || [])]);
}
