const { execSync, task, newLine } = require("@solid-js/cli");
const { setupReadme } = require("./modules/setup-readme");
const { setupBundle } = require("./modules/setup-bundle");
const { checkConfigFile } = require("./modules/check-config-file");
const { setupPackageJson } = require("./modules/setup-package-json");
const { cleanFrameworkFiles } = require("./modules/clean-framework-files");
const { showHelp } = require("./modules/show-help");
const { setupInstallConfig } = require("./modules/setup-install-config");
const { setupGitignore } = require("./modules/setup-gitignore");
const debug = require("debug")("config:setup");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../../global.paths");
// get local task config
const config = require("../../global.config");

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup
 */
const setup = () => {
  return new Promise(async (resolve) => {
    // check if cache file exist, if exist, do not contiue
    if (!checkConfigFile({})) return;

    const taskSetup = task("Setup");

    const packageJsonValues = await setupPackageJson({});

    await setupReadme({
      projectName: packageJsonValues.projectName,
      projectDescription: packageJsonValues.projectDescription,
      projectAuthor: packageJsonValues.projectAuthor,
    });

    await cleanFrameworkFiles({});

    // create cache file if is the first install;
    await setupInstallConfig({ bundleType });

    // manage gitignore (add and remove values)
    await setupGitignore({});

    // show help
    await showHelp();
    // end
    logs.done("Webpack-base is ready!");
    newLine();
    resolve();
  });
};

// return
module.exports = { setup };
