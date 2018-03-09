module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/script.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
            cacheDirectory: '.cache'
          },
        },
      },
    ],
  },
};
