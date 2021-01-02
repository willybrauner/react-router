import React, { useRef } from "react";
import { transitionsHelper } from "../helper/transitionsHelper";
import { useStack } from "../router/useStack";
import { useLocation } from "../router/useLocation";

interface IProps {
  params?: {
    id: string;
  };
}

const componentName = "ArticlePage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name ArticlePage
 */
function ArticlePage(props: IProps) {
  debug("params", props);
  const rootRef = useRef(null);
  //
  // useStack({
  //   componentName,
  //   rootRef,
  //   playIn: () => transitionsHelper(rootRef.current, true),
  //   playOut: () => transitionsHelper(rootRef.current, false),
  // });

  // test of redirection
  const [location, setLocation] = useLocation();

  return (
    <div className={componentName} ref={rootRef}>
      {componentName} - id: {props?.params?.id}
      <br />
      <button onClick={() => setLocation("/")}>navigate to /</button>
    </div>
  );
}

export default ArticlePage;
