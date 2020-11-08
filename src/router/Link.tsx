import React, { ReactNode, useEffect, useMemo } from "react";
import { useLocation } from "./useLocation";
import { useRouter } from "./useRouter";

interface IProps {
  children: ReactNode;
  href: string;
  onClick?: () => void;
  className?: string;
}

const componentName = "Link";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name Link
 */
function Link(props: IProps) {
  const [location, setLocation] = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    setLocation(props.href);
    props.onClick?.();
  };

  const isActive = useMemo(() => location === props.href, [location, props.href]);

  return (
    <a
      className={[componentName, props.className, isActive && "active"]
        .filter((e) => e)
        .join(" ")}
      onClick={handleClick}
      href={props.href}
      children={props.children}
    />
  );
}

export default Link;
