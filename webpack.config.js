var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var _ = require('lodash');

var config = {
	devtool: 'source-map',
	entry: {
		app: [
			'./src/app.tsx',
			'./src/site.scss',
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
		new webpack.NamedModulesPlugin(),
		new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
		new HtmlWebpackPlugin({ template: './src/index.hbs', hash: true }),
		new CopyWebpackPlugin([{ from: '**/*', to: 'images', context: './src/images' }]),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['react-hot-loader', 'awesome-typescript-loader'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
			},
			{
				test: /\.hbs$/,
				use: ['handlebars-loader']
			}
		]
	}
};

module.exports = function (env) {
	if (env === "prod") {
		console.log('Production config active.');

		// clean up wwwroot before building
		config.plugins.push(new CleanWebpackPlugin('wwwroot', { exclude: ['.'] }));

		// extract CSS to a separate file
		config.plugins.push(new ExtractTextPlugin('site.css'));

		_.remove(config.module.rules, function (rule) { // first remove the existing scss rule that is there for HMR
			return (rule.use[0] === 'style-loader');
		})

		config.module.rules.push({ // then add the replacement scss rule
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract({
				fallbackLoader: "style-loader",
				loader: ["css-loader?sourceMap", "sass-loader?sourceMap"]
			})
		});
	}

	return config;
}