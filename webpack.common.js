module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/script.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img/'
            },
          },
        ],
      },
    ],
  },
};
