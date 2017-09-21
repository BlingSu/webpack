const path = require('path')
const webpack = require('webpack')
const validate = require('webpack-validator')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const Merge = require('webpack-merge')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')


let currentTarget = process.env.npm_lifecycle_event

let debug, devServer, minimize

if (currentTarget == 'build') {
    debug = false, devServer = false, minimize = true
} else if (currentTarget == 'dev') {
    debug = true, devServer = false, minimize = false
} else if (currentTarget == 'dev-hrm') {
    debug = true, devServer = true, minimize = false
}

let proxyTarget = 'http://localhost:8888/'

let PATHS = {
    /* process.cwd():返回运行当前脚本的工作目录路径(绝对路径) */
    publicPath: devServer ? '/webpack-mock/dist' : './'
    libsPath: path.resolve(process.cwd(), './libs')
    srcPath: path.resolve(process.cwd(), 'src')
    node_modulesPath: path.resolve('./node_modules')
}

let resolve = {
    extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg'],
    root: [ PATHS.node_modulesPath ],
    alias: {
        jquery: path.join(PATHS.libsPath, 'js/jquery/jquery'),
        underscore: path.join(PATHS.libsPath, 'js/underscore/underscore.js'),
        bootstrapcss: path.join(PATHS.libsPath, 'css/bootstrap/bootstrap-3.3.5.css')
        indexcss: paht.join(PATHS.srcPath, 'css/index.css')
    }
}

let entry = {
    index: './src/js/index.js',
    common: [
        path.join(PATHS.libsPath, 'js/jquery/jquery.js'),
        path.join(PATHS.libsPath, 'js/underscore/underscore.js')
    ]
}

let output = {
    path: path.join(__dirname, 'dist'),
    publicPath: PATHS.publicPath,
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',
    chunkFilename:devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

let loaders = {
    {
        test: /\.html$/,
        loader: 'html'
    },
    {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: '/img/[name]-[hash:8].[ext]'
        }
    },
    {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader',
        query: {
            limit: 5000,
            name: '/font/[name]-[hash:8].[ext]'
        }
    },
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader', { publicPath: '../' })
    }
}

let plugins = [
    /* gloab flag */
    new webpack.DefinePlugin({
        __DEV__: debug,
        __DEVAPI__: devServer ? '/devApi/' : '""'
    }),
    new webpack.optimize.CommonsChunkPlugin(devServer ? {name: 'common', filename: 'js/common.js'} : {name: ['common', 'webpackAssets']}),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        '_': 'underscore'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new CleanWebpackPlugin(['dist'], {
        root: '',
        verbose: true,
        dry: false
    }),

    new ExtractTextPlugin(devServer ? 'css/[name].css' : 'css/[name]-[chunkhash:8].css', {allChunks: true}),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/src/index.html',
        inject: true,
        chunks: ['common', 'index', 'webpackAssets'],
        chunksSortMode: 'dependency'
    })
]

if (minimize) {
    plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                mangle: { except: ['$super', '$', 'export', 'require', 'module', '_'] },
                compress: { warnings: false },
                output: { comments: false }
            })
        )
}

var config = {
    entry: entry,
    resolveLoader: { root: path.join(__dirname, 'node_modules') },
    output: output,
    module: { loaders: loaders }
    resolve: resolve,
    plugins: plugins
}

/* hrm setting */

if (devServer) {
    config = Merge(
            config,
            {
                plugins: [
                    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
                    new OpenBrowserPlugin({ url: 'http://localhost:8080' + PATHS.publicPath + 'index.html' })
                ],
                devServer: {
                    historyApiFallback: true,
                    hot: true,
                    inline: true,
                    stats: 'errors-only',
                    host: 'localhost',
                    port: '8080',
                    proxy: {
                        '/devApi/*': {
                            target: proxyTarget,
                            secure: true,
                            rewrite: function(req) {
                                req.url = req.url.replace(/^\/devApi/, '')
                            }
                        }
                    }
                }
            }
        )
}

module.exports = validate(config)
