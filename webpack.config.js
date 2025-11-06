const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: 'body',
      }),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        }
      ],
      compress: true,
      port: 3001,
      hot: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      ],
    },
  };
};
