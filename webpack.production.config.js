var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')


// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = (env) => {
  console.log('env', env);
  const output = {
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(__dirname, 'src/main.js')
      ],
      vendor: [ 'pixi', 'p2', 'phaser', 'webfontloader' ]

    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: './',
      filename: 'js/bundle.[hash].js'
    },
    plugins: [
      definePlugin,
      new CleanWebpackPlugin([ 'build' ]),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.UglifyJsPlugin({
        drop_console: true,
        minimize: true,
        output: {
          comments: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor' /* chunkName= */,
        filename: 'js/vendor.bundle.js' /* filename= */
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
        template: './src/index.html',
        chunks: [ 'vendor', 'app' ],
        chunksSortMode: 'manual',
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeComments: true,
          removeEmptyAttributes: true
        },
        hash: true
      }),
      new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [ '@babel/preset-env' ]
            }
          },
          include: path.join(__dirname, 'src')
        },
        { test: /pixi\.js/, use: [ 'expose-loader?PIXI' ] },
        { test: /phaser-split\.js$/, use: [ 'expose-loader?Phaser' ] },
        { test: /p2\.js/, use: [ 'expose-loader?p2' ] }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    resolve: {
      alias: {
        'phaser': phaser,
        'pixi': pixi,
        'p2': p2
      }
    }
  };

  if (env.production) {
    console.log('adding string-replace-loader');
    output.module.rules.push(
      {
        test: /Game\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'https:\/\/staging-cofnode\.operaevent\.co',
          flags: 'gi',
          replace: 'https://cofnode.operaevent.co'
        }
      })
  }

  return output;
};