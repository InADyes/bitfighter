module.exports = {
    entry: {
        //index: './src/index.ts',
        //settings: './src/settings.ts',
        simulator: './src/simulator.ts'
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
    devtool: 'source-map'
}
