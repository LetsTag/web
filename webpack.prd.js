const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.com');
module.exports = merge(common, {
    mode: 'production',
    // Preserved media is downloaded on demand; budget only page scripts and styles.
    performance: { assetFilter: filename => /\.(js|css)$/.test(filename) },
    module: { rules: [{
        test: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { modules: { namedExport: false } } }],
    }] },
    plugins: [new MiniCssExtractPlugin({ filename: 'styles.[contenthash:8].css' })],
    optimization: { minimizer: ['...', new CssMinimizerPlugin()] },
});
