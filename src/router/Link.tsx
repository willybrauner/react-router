import React, { ReactNode, useMemo } from "react";
import { useLocation } from "./useLocation";

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
  const [, setLocation] = useLocation();

  const handleClick = (e) => {
    setLocation(props.href);
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
