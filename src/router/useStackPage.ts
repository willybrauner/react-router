import { MutableRefObject, useEffect, useLayoutEffect, useMemo } from "react";
import { useRouter } from "./useRouter";
const debug = require("debug")("front:useStack");

export type TStackTransitions = {
  [currentPath: string]: TStackTransitionObject;
};

export type TStackTransitionObject = {
  // component name
  componentName: string;
  // component ref
  rootRef: MutableRefObject<any>;
  // playIn page transition promise handler
  playIn?: () => Promise<any>;
  // playOut page transition promise handler
  playOut?: () => Promise<any>;
  // page is ready state allow to now if page is ready (data fetching or whatever...)
  currentPageIsReady?: boolean;
  // wait bool isReady pass to true from promise
  currentPageIsReadyPromise?: () => Promise<any>;
};

/**
 * @name useStackPage
 * @description Allow set page properties in router
 */
export function useStackPage(
  {
    componentName,
    playIn = () => Promise.resolve(),
    playOut = () => Promise.resolve(),
    rootRef,
    currentPageIsReady = true,
  }: TStackTransitionObject,
  pDependencies?: any[]
) {
  const router = useRouter();

  // Page is ready deferred promise
  // Create a promise and get resolve anywhere
  const readyDeferred = useMemo(() => {
    const deferred: any = {};
    deferred.promise = new Promise((resolve) => {
      deferred.resolve = resolve;
    });
    return deferred;
  }, []);

  // resolve deferred if currentPageIsReady param is true
  useEffect(() => {
    currentPageIsReady && readyDeferred.resolve();
  }, [currentPageIsReady]);

  // register pages before render
  useLayoutEffect(() => {
    // set transitions in current router instance
    (router.stackPageTransitions as TStackTransitions) = {
      ...router.stackPageTransitions,
      ...{
        [window.location.pathname]: {
          componentName,
          playIn,
          playOut,
          rootRef,
          currentPageIsReady,
          currentPageIsReadyPromise: () => readyDeferred.promise,
        },
      },
    };

    debug(`pageTransition list`, router.stackPageTransitions);
  }, [...(pDependencies || [])]);
}
