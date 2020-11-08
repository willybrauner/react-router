import React, { useRef } from "react";
import { useStackPage } from "../router/useStackPage";
import { transitionsHelper } from "../helper/transitionsHelper";
const debug = require("debug")("front:HomePage");

const componentName: string = "HomePage";
const HomePage = (props) => {
  const rootRef = useRef(null);

  useStackPage({
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

export default HomePage;
