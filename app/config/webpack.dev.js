const { merge } = require('webpack-merge');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'minimal',
  devServer: {
    static: path.resolve(__dirname, '../dist'),
    port: 3000,
    hot: false,
    liveReload: true,
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js'],
      emitWarning: true,
      fix: true,
      lintDirtyModulesOnly: true,
      failOnError: false,
    }),
    new StylelintPlugin({
      extensions: ['scss', 'css'],
      emitWarning: true,
      fix: true,
      lintDirtyModulesOnly: true,
      failOnError: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true, sassOptions: { quietDeps: true } } },
        ],
      },
    ],
  },
});
