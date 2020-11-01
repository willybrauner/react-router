import { MutableRefObject, useEffect, useLayoutEffect, useMemo } from "react";
const debug = require("debug")("front:usePageTransition");

/**
 *  Pages register type
 */
export type TPageTransition = {
  [currentPath: string]: TPageTransitionObject;
};

/**
 * Single page transition object type
 */
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
  // stack name
  stackName?: string;
  // page is ready state allow to now if page is ready (data fetched or whatever...)
  isReady?: boolean;
  // wait bool isReady pass to true via promise
  waitIsReadyPromise?: () => Promise<any>;
};

// ----------------------------------------------------------------------------- ACCESSOR

/**
 *
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

// ----------------------------------------------------------------------------- HOOK

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
    stackName,
    isReady = true,
  }: TPageTransitionObject,
  pDependencies?: any[]
) {
  /**
   * Page is ready deffered promise
   * Create a promise and get resolve anywhere
   */
  const readyDeferred = useMemo(() => {
    debug("creating deffered");
    const deffered: any = {};
    deffered.promise = new Promise((resolve) => {
      deffered.resolve = resolve;
    });
    return deffered;
  }, []);

  // resolve deferred if isReady param is true
  useEffect(() => {
    if (isReady) {
      readyDeferred?.resolve("readyDeferred Promise is resolved!");
    }
  }, [isReady]);

  /**
   * Register pages before render
   */
  useLayoutEffect(() => {
    // Build a new page transition object
    const newPageTransition = {
      [window.location.pathname]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        stackName,
        isReady,
        waitIsReadyPromise: () => readyDeferred.promise,
      },
    };

    // merge new object on page transition object
    pageTransition.register = {
      ...pageTransition.list,
      ...newPageTransition,
    };

    // log the page register list
    debug(`pages register list`, pageTransition.list);
  }, [...(pDependencies || [])]);
}
