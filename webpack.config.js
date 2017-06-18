var path = require('path');

module.exports = {
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader'
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: require.resolve('./vendor/sylvester'),
        use: 'exports-loader?Matrix,Vector'
      }
    ]
  }
};