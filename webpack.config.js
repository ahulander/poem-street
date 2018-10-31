const path = require('path');

module.exports = {
  entry: './build/client/client.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js'
  },
  watch: true
};