import React, { useRef } from "react";
import { transitionsHelper } from "../helper/transitionsHelper";
import { usePageTransition } from "../router/usePageTransition";
import { routesList } from "../index";
import Link from "../router/Link";
import RouterStack from "../router/RouterStack";
import { Router } from "../router/Router";
import { manageTransitions } from "../components/App";
import { IRoute } from "../router/RouterManager";
import HomePage from "./HomePage";
import FooPage from "./FooPage";
import BarPage from "./BarPage";

const componentName: string = "AboutPage";
const AboutPage = () => {
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
      {componentName}
      {/*<Router*/}
      {/*  routes={*/}
      {/*    [*/}
      {/*      {*/}
      {/*        path: "/foo",*/}
      {/*        component: FooPage,*/}
      {/*        props: { name: "foo" },*/}
      {/*      },*/}
      {/*      {*/}
      {/*        path: "/bar",*/}
      {/*        component: BarPage,*/}
      {/*        props: { name: "bar" },*/}
      {/*      },*/}
      {/*    ] as IRoute[]*/}
      {/*  }*/}
      {/*  base={"/about/"}*/}
      {/*>*/}
      {/*  <div className={componentName}>*/}
      {/*    <nav>*/}
      {/*      <ul>*/}
      {/*        <li>*/}
      {/*          <Link href={"/"}>Home</Link>{" "}*/}
      {/*        </li>*/}
      {/*        <li>*/}
      {/*          <Link href={"/about"}>About</Link>{" "}*/}
      {/*        </li>*/}
      {/*        <li>*/}
      {/*          <Link href={"/blog/article-2"}>blog article "article 2"</Link>*/}
      {/*        </li>*/}
      {/*      </ul>*/}
      {/*    </nav>*/}
      {/*    <RouterStack manageTransitions={manageTransitions} />*/}
      {/*  </div>*/}
      {/*</Router>*/}
    </div>
  );
};

export default AboutPage;
