var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './wwwroot/index'
  ],
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['awesome-typescript-loader'],
      include: path.join(__dirname, 'wwwroot')
    }]
  }
};
