import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
const debug = require("debug")("front:HomePage");

type TProps = {};

const componentName: string = "HomePage";
const HomePage = forwardRef((props: TProps, ref: MutableRefObject<any>) => {
  const rootRef = useRef(null);

  // useStack({
  //   componentName,
  //   rootRef,
  //   playIn: () => transitionsHelper(rootRef.current, true),
  //   playOut: () => transitionsHelper(rootRef.current, false),
  // });

  useImperativeHandle(
    ref,
    () => ({
      ref: rootRef,
      playIn: () => transitionsHelper(rootRef.current, true),
      playOut: () => transitionsHelper(rootRef.current, false),
    }),
    []
  );

  return (
    <div className={componentName} ref={rootRef}>
      Home
    </div>
  );
});

export default HomePage;
