const { Files } = require("@zouloux/files");
const path = require("path");
const paths = require("../paths");
const log = require("debug")("config:prebuild-atoms");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Create atoms less to JS template
 */
const _atomsTemplate = (
  pAtomList,
  pFileTabRegex = new RegExp(`(\n${"\t\t\t"})`, "gmi")
) => {
  return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 * Auto-Updated with HMR and generated on production build.
			 * This file is ignored on .gitignore 
			 */
			export const atoms = {
			${pAtomList
        .map(atom => {
          return `	"${atom.name}": ${atom.value},`;
        })
        .join("\n")}
			};`.replace(pFileTabRegex, "\n");
};

/**
 * Parse atoms list
 * @param pWatcher Files to parse
 * @returns {[]}
 * @private
 */
const _atomsParser = pWatcher => {
  // Get less files
  const atomsLessFiles = Files.getFiles(pWatcher);

  // Generated atoms list
  let atomList = [];

  // Browse less files
  atomsLessFiles.all(lessFile => {
    // Read less file
    const lessContent = Files.getFiles(lessFile).read();

    // Browse lines
    lessContent.split("\n").map(split => {
      // Trim line
      split = split.trim();
      // Get @ index (starting of a new less var)
      const atIndex = split.indexOf("@");
      // If @ is not at first index (we are trimmed), next
      if (atIndex !== 0) return;
      // Get colon index (starting of a value in less)
      const colonIndex = split.indexOf(":");
      // If there is no value on this line, next
      if (colonIndex === -1) return;
      // Get optionnal semi colon index
      const semiIndex = split.indexOf(";");
      // Extract var name and trim it
      const varName = split.substring(atIndex + 1, colonIndex).trim();
      // Extract value and trim it
      const value = split
        .substring(colonIndex + 1, Math.min(split.length, semiIndex))
        .trim();

      // Add this atom
      atomList.push({
        // Var name
        name: varName,
        // Var value add quotes of not already there
        value:
          value.charAt(0) === "'" || value.charAt(0) === '"'
            ? value
            : "'" + value + "'"
      });
    });
  });

  return atomList;
};

// ----------------------------------------------------------------------------- PUBLIC

module.exports = {
  /**
   * Generate atoms typescript file from less files inside atoms directory
   * Return a promise
   */
  prebuildAtoms: ({
    pWatcher = paths.atomsFilesToWatch,
    pOutputPath = paths.atomsPath,
    pOutputFilename = paths.atomsGeneratedFilename
  }) =>
    new Promise(resolve => {
      // Generate File path
      const generatedFilePath = `${pOutputPath}/${pOutputFilename}`;
      // get atoms list
      const atomList = _atomsParser(pWatcher);

      log("Write new atoms file...");
      Files.new(generatedFilePath).write(_atomsTemplate(atomList));

      log("Done.");
      resolve();
    })
};
