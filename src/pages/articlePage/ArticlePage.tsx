import css from "./ArticlePage.module.less";
import React from "react";

interface IProps {
  classNames?: string[];
  params?: {
    id: string;
  };
  color: string;
}

const componentName = "ArticlePage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name ArticlePage
 */
function ArticlePage(props: IProps) {
  debug("params", props);
  return (
    <div className={css.Root}>
      {componentName} - id: {props?.params?.id}
    </div>
  );
}

export default ArticlePage;
