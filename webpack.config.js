const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const config = {
  mode: 'development',
  watch: true,
  entry: {
    content: './src/content/content.ts',
    background: './src/background/background.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'manifest.json',
      },
      {
        from: 'src/assets/**',
        flatten: true,
      },
      {
        from: 'src/popup/**',
        flatten: true,
      },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ChromeExtensionReloader({
      reloadPage: true,
      entries: {
        contentScript: 'content',
        background: 'background',
      },
    }),
  ],
};

module.exports = config;
