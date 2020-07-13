import css from "./App.module.less";
import React, { useRef } from "react";
import { merge } from "../../utils/class-utils";
import Router from "../../Router";
import { routes } from "../../index";
import RouterStack from "../../RouterStack";
import Link from "../../Link";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  const router = useRef(new Router({ base: "/", routes }));

  return (
    <div className={merge([css.root, componentName])} ref={rootRef}>
      <nav>
        <Link className={css.link} router={router.current} href={"/"}>
          {"home"}
        </Link>
        <Link className={css.link} router={router.current} href={"/about"}>
          {"about"}
        </Link>
        <Link
          className={css.link}
          router={router.current}
          href={"/blog/article-1"}
        >
          {"article 1"}
        </Link>
      </nav>

      <RouterStack router={router.current} />
    </div>
  );
}

export default App;
