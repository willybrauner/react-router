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
   * après lecture des liens
   * @param e
   */
  const handleClick = (e) => {
    props.router?.updateRoute(props.href);
    e.preventDefault();
  };

  return (
    <a
      className={[componentName, props.className].filter((e) => e).join(" ")}
      onClick={handleClick}
      href={props.href}
      children={props.children}
    />
  );
}

export default Link;
