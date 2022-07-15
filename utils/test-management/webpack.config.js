const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    source: './src/test-execution-handler.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'manage-kintone-plugin-test.min.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  plugins: [
    new Dotenv()
  ],
  // devtool: 'inline-source-map',
  watch: true
};