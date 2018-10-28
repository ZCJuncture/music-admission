const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.css$/,
          deleteOriginalAssets: true,
        })]
      }
    }
  }
}
