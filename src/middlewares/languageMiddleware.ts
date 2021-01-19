/**
 * Patch all routes with language param
 */
const middlewareName = "languageMiddleware";
const debug = require("debug")(`front:${middlewareName}`);

export function languageMiddleware({
  languages,
  showDefault = true,
}: {
  languages: any;
  showDefault?: boolean;
}) {
  debug("languageMiddleware > languages", arguments[0]);
  // add local to each path
}
