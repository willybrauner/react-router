import React, { useRef } from "react";
import { useStack } from "../router/useStack";
import { transitionsHelper } from "../helper/transitionsHelper";

const componentName: string = "BarPage";
const BarPage = () => {
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
  useStack({ componentName, rootRef, playIn, playOut });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
};

export default BarPage;
