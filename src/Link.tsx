import React, { ReactNode } from "react";
import Router from "./Router";

interface IProps {
  className?: string;
  router: Router;
  children: ReactNode;
  href: string;
}

const componentName = "Link";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name Link
 */
function Link(props: IProps) {
  /**
   * TODO Cette methode doit passer dans le router directement
   * après lecture des liens
   * @param e
   */
  const handleClick = (e) => {
    window.history.pushState(null, null, props.href);

    props.router?.updateRoute();

    e.preventDefault();
  };

  return (
    <a
      className={[componentName, props.className].filter((e) => e).join(" ")}
      onClick={handleClick}
      href={props.href}
    >
      {props.children}
    </a>
  );
}

export default Link;
