const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Public client-side settings only. Never put a Paddle API key in this file.
const envFile = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
const paddleToken = process.env.PADDLE_CLIENT_TOKEN || '';
const paddleEnvironment = process.env.PADDLE_ENVIRONMENT || 'production';
if (!['production', 'sandbox'].includes(paddleEnvironment)) {
    throw new Error('PADDLE_ENVIRONMENT must be production or sandbox.');
}
if (paddleToken && !paddleToken.startsWith(paddleEnvironment === 'sandbox' ? 'test_' : 'live_')) {
    throw new Error('PADDLE_CLIENT_TOKEN must be a public client-side token matching PADDLE_ENVIRONMENT.');
}

module.exports = {
    entry: { app: './src/index.tsx' },
    output: {
        filename: '[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        clean: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            __PADDLE_CLIENT_TOKEN__: JSON.stringify(paddleToken),
            __PADDLE_ENVIRONMENT__: JSON.stringify(paddleEnvironment),
            __PADDLE_PRICES__: JSON.stringify(Object.fromEntries(['FREE_MONTHLY', 'FREE_ANNUAL', 'LITE_MONTHLY', 'LITE_ANNUAL', 'PLUS_MONTHLY', 'PLUS_ANNUAL', 'MAX_MONTHLY', 'MAX_ANNUAL'].map(key => [key, process.env[`PADDLE_PRICE_${key}`] || '']))),
        }),
        ...[
            ['index.html', "Let's Tag — Exercise API pricing", '/', false],
            ['checkout/index.html', "Payment details — Let's Tag", '/checkout', true],
            ['404.html', "Page not found — Let's Tag", '/404', true],
        ].map(([filename, title, canonicalPath, noindex]) => new HtmlWebpackPlugin({
            template: './src/template/main.ejs', filename, title,
            templateParameters: { canonicalPath, noindex },
        })),
        new CopyPlugin({ patterns: [
            { from: 'robots.txt' }, { from: 'sitemap.xml' }, { from: 'CNAME' },
            { from: 'src/html/pmail_22c30242162cf766f0b95cf7fe1e790e.html' },
            // Preserve every image at its source-relative URL, including previously omitted formats.
            { context: 'src/img', from: '**/*', to: 'img', globOptions: { ignore: ['**/.DS_Store', '**/*.sh', '**/Icon'] } },
            // Preserve legacy public URLs used by existing apps and external consumers.
            ...['exercise', 'emotion', 'emotion_watch', 'size_watch'].map(directory => ({
                context: `src/img/${directory}`, from: '*.{avif,heic,webp,png,jpg,jpeg,svg,gif}', to: 'img', noErrorOnMissing: true,
            })),
            { context: 'src/img/size', from: '**/*', to: 'img', globOptions: { ignore: ['**/.DS_Store'] } },
            { context: 'src/img/icon', from: '**/*', to: 'icon', globOptions: { ignore: ['**/.DS_Store'] } },
            { context: 'src/audio', from: '*.mp3', to: 'audio' },
        ] }),
    ],
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    optimization: { runtimeChunk: 'single', splitChunks: { chunks: 'all' } },
    module: { rules: [
        {
            test: /\.tsx?$/, exclude: /node_modules/,
            use: { loader: 'swc-loader', options: {
                jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2022', transform: { react: { runtime: 'automatic' } } },
            } },
        },
        { test: /\.(woff2?|png|svg|webp|jpg|gif)$/, type: 'asset/resource' },
    ] },
    stats: 'errors-warnings',
};
