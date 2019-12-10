const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/popup/popup.js',
  output: {
    path: path.resolve(__dirname, '../../dist/Inquest'),
    filename: 'popup.js'
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'popup.html',
    template: './src/popup/popup.html'
  })],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ] 
  }
};