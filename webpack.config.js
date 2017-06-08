const path = require("path");
const fs = require("fs");
const htmlWebpackPlugin = require("html-webpack-plugin");

//  Client Configuration
const client = {
  entry: [path.resolve(__dirname, "./src/client/index.js")],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    // serve index.html in place of 404 responses
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "src")
  },
  // externals: {
  //     react: "React",
  //     "react-dom": "ReactDOM",
  //     lodash: "_"
  // } ,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"],
          plugins: ["transform-object-rest-spread"]
        }
      }
    ]
  },
  // plugins: [
  //   new htmlWebpackPlugin({
  //     template: path.resolve(__dirname, "src/client/index.html"),
  //     inject: "body",
  //     filename: "index.html"
  //   })
  // ]
};

// Node Configuration
const server = {
  entry: path.resolve(__dirname, "./src/server/server.js"),

  output: {
    filename: "./server.bundle.js"
  },

  target: "node",

  // keep node_module paths out of the bundle
  externals: fs
    .readdirSync(path.resolve(__dirname, "node_modules"))
    .concat(["react-dom/server", "react/addons"])
    .reduce(function(ext, mod) {
      ext[mod] = "commonjs " + mod;
      return ext;
    }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"],
          plugins: ["transform-object-rest-spread"]
        }
      }
    ]
  }
};

module.exports = [client, server];