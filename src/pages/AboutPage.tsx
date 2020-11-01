import React, { useRef } from "react";
import { transitionsHelper } from "../helper/transitionsHelper";
import { usePageTransition } from "../router/usePageTransition";

const componentName: string = "AboutPage";
const AboutPage = () => {
  const rootRef = useRef();

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
      {componentName}
    </div>
  );
};

export default AboutPage;
