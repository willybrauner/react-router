import css from "./HomePage.module.less";
import React from "react";

const componentName: string = "HomePage";
const HomePage = () => {
  return <div className={css.Root}>{componentName}</div>;
};

export default HomePage;
