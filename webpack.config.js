const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, "dist"),
		filename: 'paella-player.js',
		sourceMapFilename: 'paella-player.js.map'
	},
	devtool: 'source-map',
	
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},

			{
				test: /\.css$/,
				use:  [
					'style-loader',
					'css-loader'
				]
			},

			{
				test: /\.svg$/i,
				use: {
					loader: 'svg-inline-loader'
				}
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: true
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './config', to: 'config' },
				{ from: './repository_test/repository', to: 'repository' },
				{ from: './src/style.css', to: '' }
			]
		})
	]
}