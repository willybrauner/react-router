import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
const debug = require("debug")("front:HomePage");

type TProps = {};

const componentName: string = "HomePage";
const HomePage = forwardRef((props: TProps, ref: MutableRefObject<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

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
    setTimeout(() => {
      debug("ready deferred is resolve !");
      readyDeferred.resolve();
    }, 2000);
  }, []);

  useImperativeHandle(
    ref,
    () => {
      debug("readyDeferred.promise", readyDeferred.promise);
      return {
        componentName,
        ref: rootRef,
        playIn: () => transitionsHelper(rootRef.current, true),
        playOut: () => transitionsHelper(rootRef.current, false),
        isReadyPromise: readyDeferred.promise,
      };
    },
    [readyDeferred]
  );

  return (
    <div className={componentName} ref={rootRef}>
      Home
    </div>
  );
});

export default HomePage;
