import React, { forwardRef, MutableRefObject, useRef } from "react";
import { useLocation } from "../router/useLocation";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";

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
export const ArticlePage = forwardRef(
  (props: IProps, handleRef: MutableRefObject<any>) => {
    debug("params", props);
    const rootRef = useRef(null);

    useStack({
      componentName,
      handleRef,
      rootRef,
      playIn: () => transitionsHelper(rootRef.current, true),
      playOut: () => transitionsHelper(rootRef.current, false),
    });

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
);

ArticlePage.displayName = componentName;
export default ArticlePage;
