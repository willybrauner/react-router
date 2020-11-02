import React, { ReactNode, useContext } from "react";
import { RouterContext } from "./Router";

interface IProps {
  className?: string;
  children: ReactNode;
  href: string;
}

const componentName = "Link";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name Link
 */
function Link(props: IProps) {
  const routerContext = useContext(RouterContext);

  const handleClick = (e) => {
    routerContext.updateRoute(props.href);
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
