import React, { useRef } from "react";
import { transitionsHelper } from "../helper/transitionsHelper";
import { usePageTransition } from "../router/usePageTransition";

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

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<any> => {
    return transitionsHelper(rootRef.current, true);
  };

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<any> => {
    return transitionsHelper(rootRef.current, false);
  };

  /**
   * Register page for ViewStack
   * NOTE: each page of ViewStack need to be register to work.
   * Minimal register should be: usePageRegister({ componentName, rootRef });
   * (remove playIn and playOut if not use)
   */
  usePageTransition({ componentName, rootRef, playIn, playOut });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName} - id: {props?.params?.id}
    </div>
  );
}

export default ArticlePage;
