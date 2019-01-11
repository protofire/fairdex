const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = (env, { mode }) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  output: {
    publicPath: '/',
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader',
        exclude: /xhr2-cookies/,
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[name]-[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'src/images/favicon.png',
      template: 'src/index.html',
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
  ],

  devtool: mode === 'production' ? 'hidden-source-map' : 'eval-source-map',

  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
  },
});
