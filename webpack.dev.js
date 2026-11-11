const { merge } = require('webpack-merge');
const common = require('./webpack.com')('development');
module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000,
        historyApiFallback: true,
        open: false,
    },
    module: { rules: [{
        test: /\.module\.css$/,
        use: [{
            loader: 'style-loader',
            options: {
                // Insert development styles into the same isolation boundary as production.
                insert: require.resolve('./scripts/insert-styles.cjs'),
            },
        }, { loader: 'css-loader', options: { modules: { namedExport: false } } }],
    }] },
});
