const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = (env, argv) => {
  const isDev = argv.mode !== "production";

  return {
    devtool: isDev ? "source-map" : false,

    entry: path.resolve(__dirname, "./src/index"),

    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "./dist"),
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(css)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.(styl)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "stylus-loader",
          ],
        },
        {
          test: /\.(jpg|png|svga)$/,
          type: "asset/resource",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
          type: "javascript/auto",
          issuer: /\.(js|ts)x?$/,
        },
      ],
    },
    resolve: {
      extensions: ["*", ".ts", ".tsx", ".js", ".jsx"],
      plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: "todo",
        publicPath: "/",
      }),
    ],
    devServer: {
      historyApiFallback: true,
    },
  };
};
