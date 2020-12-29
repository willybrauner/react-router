import React, { useRef } from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";
import { useLocation } from "../router/useLocation";

const componentName: string = "BarPage";
const debug = require("debug")(`front:${componentName}`);

const BarPage = () => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

  // test of redirection
  const [location, setLocation] = useLocation();

  return (
    <div className={componentName} ref={rootRef}>
      Bar
      <button onClick={() => setLocation("/about")}>back to /about</button>
    </div>
  );
};

export default BarPage;
