var path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    externals: { 
        react: "React",
        "react-dom": "ReactDOM",
        lodash: "_",
        flux: "Flux"
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
    }
};
