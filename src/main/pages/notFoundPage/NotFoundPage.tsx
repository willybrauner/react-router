import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "@common/lib/router/usePageRegister";
import Metas from "@common/lib/react-components/metas";
import { prepare } from "@common/helpers/prepare";
import { merge } from "@common/lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];
}

// prepare
const { componentName, log } = prepare("NotFoundPage");

/**
 * @name NotFoundPage
 */
const NotFoundPage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

  // register page
  usePageRegister({ componentName, rootRef });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={merge([css.Root, componentName])} ref={rootRef}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
    </div>
  );
};

export default NotFoundPage;
