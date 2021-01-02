import { MutableRefObject, useEffect, useImperativeHandle, useMemo } from "react";
const debug = require("debug")("front:useStack");

export type TUseStack = {
  componentName: string;
  handleRef: MutableRefObject<any>;
  rootRef: MutableRefObject<any>;
  playIn?: () => Promise<any>;
  playOut?: () => Promise<any>;
  isReady?: boolean;
};

/**
 * @name useStack
 * @description Allow set page properties in router
 */
export function useStack({
  componentName,
  playIn = () => Promise.resolve(),
  playOut = () => Promise.resolve(),
  handleRef,
  rootRef,
  isReady = true,
}: TUseStack) {
  // create deferred promise who we can resolve in the scope
  const deferredPromise = useMemo(() => {
    const deferred: any = {};
    deferred.promise = new Promise((resolve) => {
      deferred.resolve = resolve;
    });
    return deferred;
  }, []);

  // resolve deferred if isReady param is true
  useEffect(() => {
    isReady && deferredPromise.resolve();
  }, [isReady]);

  useImperativeHandle(
    handleRef,
    () => ({
      componentName,
      ref: rootRef,
      playIn,
      playOut,
      isReady,
      isReadyPromise: () => deferredPromise.promise,
    }),
    [deferredPromise]
  );
}
