import React from "react";
import Link from "../router/Link";
import Stack, { TManageTransitions } from "../router/Stack";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  return (
    <div className={componentName}>
      <nav>
        <ul>
          <li>
            <Link href={"/"}>Home</Link>{" "}
          </li>
          <li>
            <Link href={"/about"}>About</Link>{" "}
          </li>
          <li>
            <Link href={"/blog/article-1"}>blog article "article 1"</Link>
          </li>
        </ul>
      </nav>
      <Stack manageTransitions={manageTransitions} key={"stack-1"} />
    </div>
  );
}

export default App;

/**
 * Manage Router Stack Transitions
 * @param previousPage
 * @param currentPage
 * @param unmountPreviousPage
 */
const manageTransitions = ({
  previousPage,
  currentPage,
  unmountPreviousPage,
}: TManageTransitions): Promise<any> => {
  return new Promise(async (resolve) => {
    debug("> previousPage", previousPage);
    debug("> currentPage", currentPage);

    const $prev = previousPage?.$element;
    const $current = currentPage?.$element;
    debug("> $elements", { $prev, $current });

    if ($current) $current.style.visibility = "hidden";

    if (previousPage) {
      await previousPage?.playOut?.();
      debug("> previousPage playOut ended");

      unmountPreviousPage();
      debug("previousPage unmount");
    }

    await currentPage.isReadyPromise?.();

    if ($current) $current.style.visibility = "visible";

    await currentPage?.playIn?.();
    debug("> currentPage playIn ended");

    resolve();
  });
};
