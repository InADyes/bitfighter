const path = require('path');
const webpack = require('webpack');

module.exports = [
    // {
    //     entry: {
    //         index: './src/front_end/index.ts'
    //     },
    //     output: {
    //         filename: './dist/js/[name].bundle.js'
    //     },
    //     resolve: {
    //         extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    //     },
    //     module: {
    //         loaders: [
    //             // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
    //             { test: /\.tsx?$/, loader: 'ts-loader' }
    //         ]
    //     },
    //     devtool: 'source-map'
    // },   
    {
        entry: {
            controls: './src/back_end/backend.ts'
        },
        output: {
            filename: './dist/js/[name].bundle.js'
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
