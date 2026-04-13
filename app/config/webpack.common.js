const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/js/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
  ],
};
