import css from "./App.module.less";
import React, { useRef } from "react";
import { merge } from "../../utils/class-utils";
import Router from "../../Router";
import { routes } from "../../index";
import RouterStack from "../../RouterStack";
import Link from "../../Link";
import ArticlePage from "../../pages/articlePage/ArticlePage";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name App
 */
export function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  // create new router instance
  // router instance need to be pass as props to routerStack
  const router = useRef(new Router({ base: "/", routes }));

  return (
    <div className={merge([css.root, componentName])} ref={rootRef}>
      <nav>
        {routes.map((el, i) => {
          return (
            <Link
              // TODO, on ne devrait pas passer "router" comme props
              // besoin que le lien reconnaisse dans quel router il se trouve
              router={router.current}
              // TODO est ce qu'on ne devrait pas pouvoir définir une valeur param id
              // dans une route au moment de sa déclaration dans le tableau ?
              href={
                el.component === ArticlePage ? "/blog/test-article" : el.path
              }
              key={i}
              className={css.link}
              children={el.props?.name}
            />
          );
        })}
      </nav>
      <RouterStack router={router.current} />
    </div>
  );
}

export default App;
