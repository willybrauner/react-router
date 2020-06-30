const { prebuildHtaccess } = require("../prebuild-htaccess");
const { prebuildDotenv } = require("../prebuild-dotenv");
const debug = require("debug")("config:prebuild");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Execute all prebuild modules
 * @param {string|null} pEnv: current envName (staging, qa, ...), can be null
 */
const prebuild = (pEnv = null) => {
  debug("pEnv", pEnv);

  return new Promise(async (resolve) => {
    // prebuild htaccess file
    if (config.prebuildHtaccess) await prebuildHtaccess();

    // prebuild .env file
    if (config.prebuildDotEnv) await prebuildDotenv(pEnv);

    /**
     * Custom tasks
     * Set your custom brebuild-tasks below
     * ...
     */

    // end
    resolve();
  });
};

module.exports = { prebuild };
