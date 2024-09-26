const path = require('path');

module.exports = {

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
				test: /\.(svg)$/i,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'svg-inline-loader'
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
				exclude: /(node_modules)/
			}
		]
	},
	
	plugins: [
	],

	performance: {
		hints: false,
		maxEntrypointSize: 1048576,
		maxAssetSize: 1048576
	}
}