module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: require.resolve('./vendor/sylvester'),
        use: 'exports-loader?Matrix,Vector',
      },
      {
        test: require.resolve('./vendor/orbitcontrols'),
        use: [
          'imports-loader?THREE=three',
          'exports-loader?THREE.OrbitControls',
        ],
      },
    ],
  },
};
