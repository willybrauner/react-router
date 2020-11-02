import React, { ReactNode, useMemo } from "react";
import { useRouter } from "./useRouter";

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
  const router = useRouter();

  const url = useMemo(() => {
    return props.href.replaceAll("//", "/");
  }, [router, props.href]);

  const handleClick = (e) => {
    router.updateRoute(url);
    e.preventDefault();
  };

  return (
    <a
      className={[componentName, props.className].filter((e) => e).join(" ")}
      onClick={handleClick}
      href={url}
      children={props.children}
    />
  );
}

export default Link;
