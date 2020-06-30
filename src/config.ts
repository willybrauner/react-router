const debug = require("debug")("front:Store");

export type TConfig = {
  version: string;
  env: string;
  baseURL: string;
  routerBaseURL: string;
  root: HTMLElement;
  locale: string;
};

export const config = {
  set register(pConf: TConfig | Object) {
    this.conf = pConf;
  },
  conf: {} as TConfig,
};
