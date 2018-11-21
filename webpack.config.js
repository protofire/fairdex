const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  output: {
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'src/images/favicon.png',
      template: 'src/index.html'
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    })
  ],

  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0'
  }
};
