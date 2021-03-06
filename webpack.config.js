const webpack = require('webpack');
const path = require('path');

module.exports = (opts) => {

    const plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            chunks: ['app']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vis',
            chunks: ['vis']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'gen',
            chunks: ['gen']
        })
    ].concat(opts.prod ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })
    ] : [
        new webpack.ProvidePlugin({
            THREE: 'three'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]);

    return {
        entry: {
            app: ['./src/scripts/index.js'],
            vis: ['./src/scripts/dungeonVisualizer/index.js'],
            gen: ['./src/scripts/dungeonGenerator/index.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '',
            filename: 'scripts/[name].js',
            libraryTarget: 'umd'
        },
        externals: {
            THREE: 'THREE'
        },
        plugins,
        module: {
            noParse: [
                path.join(__dirname, 'node_modules', 'three')
            ],
            preLoaders: [{
                test: /\.jsx?$/,
                loader: 'eslint',
                exclude: /(node_modules)/,
                include: path.join(__dirname, 'src/scripts')
            }],
            loaders: [{
                test: /\.jsx?$/,
                loader: 'babel',
                include: path.join(__dirname, 'src/scripts')
            }, {
                test: /\.(glsl|vert|frag)$/,
                loader: 'webpack-glsl'
            }, {
                test: /\.json$/,
                loader: 'json'
            }]
        },
        eslint: {emitWarning: true},
        debug: !opts.prod,

        devtool: opts.prod ? undefined : 'cheap-module-source-map'
    };
};
