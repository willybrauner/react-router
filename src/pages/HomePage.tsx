import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
const debug = require("debug")("front:HomePage");

const componentName: string = "HomePage";
const HomePage = (props) => {
  const rootRef = useRef(null);

  useLayoutEffect(()=> {
    debug('HOME MOUNT', rootRef.current);
  },[])

  useStack({
    componentName,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

  return (
    <div className={componentName} ref={rootRef}>
      Home
    </div>
  );
};

export default React.memo(HomePage);
