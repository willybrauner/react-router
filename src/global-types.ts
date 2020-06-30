/**
 * Default play state enum
 */
export enum EPlayState {
  HIDDEN,
  PLAY_OUT,
  PLAY_IN,
  VISIBLE,
}

/**
 * Env names list
 * Name of the specific environment
 * Update this list if you add some env (qa, lamp...)
 */
export enum EEnv {
  DEV = "development",
  STAGING = "staging",
  PROD = "production",
}
