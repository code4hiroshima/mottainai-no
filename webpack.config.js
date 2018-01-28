/* eslint comma-dangle: ["error", "never"] */
/* eslint quotes: ["error", "double"] */
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "js/script.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: ".",
    compress: true,
    port: 10980
  }
};
