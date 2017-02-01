var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      './src/app.tsx',
      './src/site.scss'
    ],
    vendor: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react',
      'whatwg-fetch',
      'json-fetch',
      'core-js',
      'lodash',
      'moment'
    ],
  },
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "wwwroot"),
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor', 'manifest']}),
    new ExtractTextPlugin('site.css'),
    new HtmlWebpackPlugin({ template: './src/index.hbs', hash: true }),
    new CopyWebpackPlugin([{from: '**/*', to: 'images', context: './src/images'}])
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: ["css-loader?sourceMap", "sass-loader?sourceMap"]
        })
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader']
      }
    ]
  }
};
