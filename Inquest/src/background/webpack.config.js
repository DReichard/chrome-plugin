const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/background/background.js',
  output: {
    path: path.resolve(__dirname, '../../dist/Inquest'),
    filename: 'background.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': 'true'
    })
  ],
  node: { fs: 'empty' }
};