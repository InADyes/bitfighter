module.exports = {
    entry: {
        index: './index/src/index.ts',
        settings: './index/src/settings.ts'
    },
    output: {
        filename: './index/dist/[name].bundle.js'
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
