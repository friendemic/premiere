let webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
let UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  entry: './build/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'premiere.min.js',
    library: 'Premiere',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({compress: {warnings: false}}),
    new UnminifiedWebpackPlugin()
  ]
};
