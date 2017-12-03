module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules|vendor|dist/,
        loader: 'eslint-loader',
      },
      {
        test: require.resolve('./vendor/sylvester'),
        use: 'exports-loader?Matrix,Vector',
      },
    ],
  },
};
