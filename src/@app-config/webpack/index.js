const NodeExternals = require( "webpack-node-externals" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const CleanupWebpackPlugin = require( "webpack-cleanup-plugin" );

const Utils = require( "./utils" );

const BuildDir = Utils.Root( "build" );

module.exports = () => {
	
	return {
		
		node: {
			console: true,
			fs: "empty",
			net: "empty",
			tls: "empty"
		},
		entry: Utils.Root( "index.ts" ),
		output: {
			path: BuildDir,
			filename: "index.js"
		},
		resolve: {
			extensions: [ ".js", ".ts", ".tsx" ],
			alias: {
				"@app-config": Utils.Root( "src", "@app-config" )
			},
			modules: [
				Utils.Root( "node_modules" ),
				Utils.Root( "config" ),
				Utils.Root( "src" )
			]
		},
		target: "node",
		externals: [ NodeExternals() ],
		module: {
			rules: [
				{
					test: /\.ts(x?)$/,
					use: [ "babel-loader", "awesome-typescript-loader" ],
					exclude: /node_modules/
				},
				{
					test: /\.js$/,
					use: [ "babel-loader" ],
					exclude: /node_modules/
				}
			]
		},
		plugins: [
			
			new CleanupWebpackPlugin(),
			
			new CopyWebpackPlugin(
				
				[
					{
						from: Utils.Root( "package.json" ),
						to: BuildDir,
						force: true
					}
				]
			),
		
		]
	}
};