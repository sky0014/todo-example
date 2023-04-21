const { normalize, dirname, resolve, parse, basename } = require("path");
const { createMatchPath, loadConfig } = require("tsconfig-paths");

const config = loadConfig();
const matchPath = createMatchPath(
  config.absoluteBaseUrl,
  config.paths,
  config.mainFields,
  config.addMatchAll
);

const extensions = [".ts", ".tsx", ".js", ".jsx"];

module.exports = {
  pathResolve(filename, path) {
    let result = "";

    if (path.startsWith(".")) {
      // relative path
      result = resolve(dirname(filename), path);
    } else {
      // used tsconfig/jsconfig paths
      result = matchPath(path, undefined, undefined, extensions);
    }

    // strip 'index'
    if (result.endsWith("index")) {
      result = dirname(result);
    }

    return normalize(result);
  },

  pathNormalize(filename) {
    const parsed = parse(filename);
    const base = basename(parsed.base, parsed.ext);
    if (base === "index") {
      return parsed.dir;
    }
    return resolve(parsed.dir, base);
  },
};
