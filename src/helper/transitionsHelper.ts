import { gsap } from "gsap";
const debug = require("debug")(`front:transitionsHelper`);

export const transitionsHelper = (el, show: boolean): Promise<any> => {
  return new Promise((resolve) => {
    debug(`start ${show ? " playIn" : "playOut"}`);
    debug("el", el);
    if (!el) {
      debug("el doesnt exist, do not continue");
      return;
    }

    gsap.fromTo(
      el,
      { autoAlpha: show ? 0 : 1 },
      {
        autoAlpha: show ? 1 : 0,
        delay: 0.1,
        onComplete: () => {
          debug(`ended ${show ? " playIn" : "playOut"}`);
          resolve();
        },
      }
    );
  });
};
