var path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('./vendor/sylvester'),
        use: 'exports-loader?Matrix,Vector'
      }
    ]
  }
};
