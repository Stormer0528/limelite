const shared = require("./shared");
const {merge} = require("webpack-merge");
const {environment} = require("@rails/webpacker");

const config = merge(environment.toWebpackConfig(), shared);

// Disable ExtractText Plugin in Dev, since it adds 10-30s for component updates
config.plugins[2].options.disabled = process.env.NODE_ENV === "development";

module.exports = config;
