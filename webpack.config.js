const path = require('path');

module.exports = [{
  watch: true,
  mode: 'development',
  entry: './build/client/client.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}];