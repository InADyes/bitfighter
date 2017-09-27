const path = require('path');
const webpack = require('webpack');

module.exports = [
    {
        entry: {
            viewer: './src/front_end/viewer.ts',
            BitFighter: './src/back_end/BitFighter.ts'
        },
        output: {
            filename: './dist/[name].js'
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
            index: './src/testbed/index.ts',
            controls: './src/testbed/controls.ts'
        },
        output: {
            filename: './testbed/js/[name].bundle.js'
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
