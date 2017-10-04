const path = require('path')

module.exports = {
  entry: {
    popup: './popup/index.js',
    background: './background_scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'addon'),
    filename: '[name]/index.js'
  }
}
