const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")

module.exports = {
  entry: {
    controller: "./src/controller.ts",
    main: "./src/index.ts"
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["build"]
    }),
    new HtmlWebpackPlugin({
      chunks: ["main"],
      filename: "index.html",
      inlineSource: ".js$",
      template: "src/templates/index.html"
    }),
    new HtmlWebpackPlugin({
      chunks: ["controller"],
      filename: "controller.html",
      inlineSource: ".js$",
      template: "src/templates/controller.html"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  output: {
    path: __dirname + "/build",
    filename: "js/[name].[contenthash].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?/, loader: "ts-loader" }
    ]
  },
  devServer: {
    port: 9001
  }
}
