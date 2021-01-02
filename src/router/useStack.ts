import {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from "react";
import { useRouter } from "./useRouter";
import { transitionsHelper } from "../helper/transitionsHelper";
const debug = require("debug")("front:useStack");

export type TStackTransitions = {
  [currentPath: string]: TStackTransitionObject;
};

export type TStackTransitionObject = {
  componentName: string;
  rootRef: MutableRefObject<any>;
  playIn?: () => Promise<any>;
  playOut?: () => Promise<any>;
  currentPageIsReady?: boolean;
};

/**
 * @name useStack
 * @description Allow set page properties in router
 */

export function useStack({
  componentName,
  playIn = () => Promise.resolve(),
  playOut = () => Promise.resolve(),
  rootRef,
  currentPageIsReady = true,
}: TStackTransitionObject) {
  const router = useRouter();

  // Page is ready deferred promise
  // Create a promise and get resolve anywhere
  const deferredPromise = useMemo(() => {
    const deferred: any = {};
    deferred.promise = new Promise((resolve) => {
      deferred.resolve = resolve;
    });
    return deferred;
  }, []);

  // resolve deferred if currentPageIsReady param is true
  useEffect(() => {
    currentPageIsReady && deferredPromise.resolve();
  }, [currentPageIsReady]);

  // register pages before render
  useLayoutEffect(() => {
    // set transitions in current router instance

    const newPage = {
      [router.currentRoute.path]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        currentPageIsReady,
        currentPageIsReadyPromise: () => deferredPromise.promise,
      },
    };
    //debug("> newPage", newPage);
    //debug(">> current stackPageTransitions", router.stackPageTransitions);

    router.stackPageTransitions = {
      ...router.stackPageTransitions,
      ...newPage,
    };

    debug(
      `>>>>>> pageTransition list from ${componentName}`,
      router.stackPageTransitions
    );
  }, []);
}
