import React, { forwardRef, MutableRefObject, useRef } from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
const componentName: string = "HomePage";
const debug = require("debug")(`front:${componentName}`);

type TProps = {};

const HomePage = forwardRef((props: TProps, handleRef: MutableRefObject<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

  return (
    <div className={componentName} ref={rootRef}>
      Home
    </div>
  );
});

HomePage.displayName = componentName;
export default HomePage;
