const
    { merge } = require('webpack-merge'),
    webpack = require('webpack'),
    common = require('./webpack.com.js');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            __API_BASE_URL__: JSON.stringify("http://api.letstag.app/"),
            __MAINTENANCE_MODE__: false,
            __IN_DEBUG__: JSON.stringify("Alex"),
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        allowedHosts: 'all',
        open: {
            app: {
                name: 'google-chrome',
            },
        },
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ]
    }
});
