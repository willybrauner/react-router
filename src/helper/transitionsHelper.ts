import { gsap } from "gsap";

export const transitionsHelper = (el, show: boolean): Promise<any> => {
  return new Promise((resolve) => {
    gsap.fromTo(
      el,
      { autoAlpha: show ? 0 : 1 },
      { autoAlpha: show ? 1 : 0, onComplete: resolve }
    );
  });
};
