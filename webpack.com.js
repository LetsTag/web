const
    path = require('path'),
    webpack = require('webpack'),
    // BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    CopyPlugin = require('copy-webpack-plugin'),
    HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        app: './src/index.tsx'
    },
    output: {
        filename: '[name].[chunkhash:3].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "/"
    },
    plugins: [
        // --------------- Static Content EN --------------- 
        new HtmlWebpackPlugin({ template: './src/template/en/main.ejs', filename: 'index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/newoil.ejs', filename: 'newoil/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/features.ejs', filename: 'features/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/trynow.ejs', filename: 'trynow/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/about.ejs', filename: 'about/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/mission.ejs', filename: 'mission/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/about.ejs', filename: 'about/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/mission.ejs', filename: 'mission/index.html', inject: 'body' }),

        // --------------- Static Content EN Without Slash--------------- 
        new HtmlWebpackPlugin({ template: './src/template/en/newoil.ejs', filename: 'newoil.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/features.ejs', filename: 'features.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/trynow.ejs', filename: 'trynow.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/about.ejs', filename: 'about.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/mission.ejs', filename: 'mission.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/about.ejs', filename: 'about.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: './src/template/en/mission.ejs', filename: 'mission.html', inject: 'body' }),

        new HtmlWebpackInjectPreload({
            files: [{
                match: /.*\.woff2$/,
                attributes: { as: 'font', type: 'font/woff2', crossorigin: true }
            }]
        }),

        new CopyPlugin({
            patterns: [
                { context: 'src/i18n/', from: '*.json', to: 'i18n' },
                { from: 'src/../robots.txt' },
                { from: 'src/../sitemap.xml' },
                { from: 'src/html/404.html' },
                { from: 'src/html/pmail_22c30242162cf766f0b95cf7fe1e790e.html' },
                { from: 'CNAME' },
                { context: 'src/img/', from: '*.svg', to: "img" },
                { context: 'src/img/', from: '*.png', to: "img" },
                { context: 'src/img/', from: '*.webp', to: "img" },
                { context: 'src/img/', from: '*.jpg', to: "img" },
                { context: 'src/img/icon/', from: '*', to: "icon" },
            ],
            options: {
                concurrency: 100,
            },
        })
        // , new BundleAnalyzerPlugin()
    ].concat(...[...['ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'pt', 'ru', 'zh'].map(x => [
        new HtmlWebpackPlugin({ template: `./src/template/${x}/main.ejs`, filename: x + '/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/newoil.ejs`, filename: x + '/newoil/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/features.ejs`, filename: x + '/features/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/trynow.ejs`, filename: x + '/trynow/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/about.ejs`, filename: x + '/about/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/mission.ejs`, filename: x + '/mission/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/about.ejs`, filename: x + '/about/index.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/mission.ejs`, filename: x + '/mission/index.html', inject: 'body' }),
        // Without slash at the end
        new HtmlWebpackPlugin({ template: `./src/template/${x}/main.ejs`, filename: x + '.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/newoil.ejs`, filename: x + '/newoil.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/features.ejs`, filename: x + '/features.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/trynow.ejs`, filename: x + '/trynow.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/about.ejs`, filename: x + '/about.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/mission.ejs`, filename: x + '/mission.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/about.ejs`, filename: x + '/about.html', inject: 'body' }),
        new HtmlWebpackPlugin({ template: `./src/template/${x}/mission.ejs`, filename: x + '/mission.html', inject: 'body' }),
    ])]),
    //--------------------------------------------------------------------------------------------------------------------------------------------
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".jsx"],
        alias: {
            src: path.resolve('./src')
        }
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxAsyncRequests: 100,
            maxInitialRequests: 80,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/](react|react-dom|bootstrap|scheduler|node-polyglot|@popperjs|get-intrinsic|es-abstract|object-keys|object-inspect)[\\/]/,
                    name: "vendor"
                }
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(t|j)sx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
        ]
    }
};