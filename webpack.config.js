const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// for exporting into the global scope
// output: {
//     libraryTarget: 'var',
//     library: 'foo'
// }

module.exports = [
    {
        target: 'node',
        entry: {
            BitFighter: './src/backend/Backend.ts'
        },
        output: {
            filename: './dist/[name].js',
            libraryTarget: 'commonjs2',
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            loaders: [
                // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
                { test: /\.tsx?$/, loader: 'ts-loader' }
            ]
        },
        devtool: 'source-map'
    },   
    {
        entry: {
            index: './src/testbed.ts'
        },
        output: {
            filename: './testbed/testbed.js'
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            loaders: [
                // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
                { test: /\.tsx?$/, loader: 'ts-loader' }
            ]
        },
        devtool: 'source-map'//,
        //target: 'node'
    },
    {
        entry: {
            index: './src/index.less'
        },
        output: {
            filename: './testbed/index.css'
        },
        resolve: {
            extensions: ['.js', '.less'],
        },
        module: {
            rules: [
          {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              //resolve-url-loader may be chained before sass-loader if necessary 
              use: ['css-loader?url=false', 'less-loader']
            })
          }
        ]
    
        },
        plugins: [
            new ExtractTextPlugin("./testbed/index.css"),
            new ExtractTextPlugin("./dist/viewer.css")
          ]
        // devtool: 'source-map'//,
        //target: 'node'
    },
    {
        entry: {
            simulator: './src/simulator/simulator.ts'
        },
        output: {
            filename: 'simulator.js',
            devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: 'file://[absolute-resource-path]?[hash]'
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            loaders: [
                // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
                { test: /\.tsx?$/, loader: 'ts-loader' }
            ]
        },
        devtool: 'source-map',
        target: 'node'
    }
];
