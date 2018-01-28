/* eslint comma-dangle: ["error", "never"] */
/* eslint quotes: ["error", "double"] */
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map",
  devServer: {
    contentBase: ".",
    compress: true,
    port: 10980
  }
});
