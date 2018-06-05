const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  entry: './kuda.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'kuda.js'
  },
  target: 'node',
  externals: [nodeExternals()]
};