const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir = path.join(__dirname, '..');
const webpackEnv = process.env.NODE_ENV || 'development';

const appDirectory = path.resolve(__dirname, '../');
const babelLoaderConfiguration = {
  test: /\.(ts|js)x?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'Star.tsx'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'react-native' preset is recommended to match React Native's packager
      presets: [
        '@babel/preset-env',
        [
          '@babel/react',
          {
            runtime: 'automatic',
          },
        ],
        'module:metro-react-native-babel-preset',
      ],
      // Re-write paths to import only the modules needed by the app
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        'react-native-web',
      ],
    },
  },
};

const reactNative = {
  test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
  exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/react',
        {
          runtime: 'automatic',
        },
      ], // <--- this is the preset that will transpile everything for web (its the one used by CRA)

      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      'react-native-reanimated/plugin',
    ],
    cacheDirectory: false,
  },
};



module.exports = {
  mode: webpackEnv,
  entry: {
    app: path.join(rootDir, './index.web.ts'),
  },
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'app-[hash].bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      reactNative,
      babelLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
    }),
    new webpack.DefinePlugin({ process: { env: {} } }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
    ], // read files in fillowing order
    alias: Object.assign({
      'react-native$': 'react-native-web',
    }),
  },
};
