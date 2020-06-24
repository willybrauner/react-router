import css from "./App.module.less";
import React, { useRef } from "react";
import { merge } from "../../utils/class-utils";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * Struct
 */
export interface IProps {}

/**
 * @name App
 */
export function App(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div className={merge([css.root, componentName])} ref={rootRef}>
      App
    </div>
  );
}

export default App;
