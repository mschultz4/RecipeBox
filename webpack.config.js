var path              = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [path.resolve(__dirname, "./src/index.js")],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
	devServer: {
		// serve index.html in place of 404 responses
		historyApiFallback: true,
	 	contentBase: path.resolve(__dirname, "src")
	},
    externals: { 
        react: "React",
        "react-dom": "ReactDOM",
        lodash: "_"
    } ,
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: ["babel"],
            query: {
        presets: ['es2015', 'react']
      }
      
        }]
    },
	plugins:[ 
		new htmlWebpackPlugin({
			template: path.resolve(__dirname, "src/index.html"),
			inject:   'body',
			filename: 'index.html'
   		})
	]
};