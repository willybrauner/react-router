require("colors");
const { logs } = require("../../helpers/logs-helper");
const { execSync } = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async () => {
  logs.start("Start dev server");
  // start webpack
  await execSync(
    [
      // this value will never change
      `NODE_ENV=development`,
      // target .env, this value will never change
      `env-cmd -f .env`,
      // start webpack devServer
      ` webpack-dev-server --config config/webpack/webpack.development.js`,
    ].join(" "),
    3
  );
};

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const dev = () =>
  new Promise(async (resolve) => {
    await clean();
    await _startDevServer();
    resolve();
  });

module.exports = { dev };
