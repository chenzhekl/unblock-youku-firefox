const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    popup: "./src/popup/index.js",
    background: "./src/background_scripts/index.js"
  },
  output: {
    path: path.resolve(__dirname, "addon"),
    filename: "[name]/index.js"
  }
};
