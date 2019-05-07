const path = require('path');

module.exports = {
  entry: './src/pageHook/pageHook.js',
  output: {
    path: path.resolve(__dirname, '../../dist/Inquest'),
    filename: 'pageHook.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              localIdentName: 'inquest.css'
            },
          }
        ],
      },
    ],
  }
};