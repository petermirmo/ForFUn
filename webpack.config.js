const path = require("path");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  entry: "/src/index.js",
  output: { path: path.resolve(__dirname, "dist") },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
