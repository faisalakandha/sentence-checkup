'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

// Plugin
const extractTextPluginCss = new ExtractTextPlugin({
    filename: '[name].css?[contenthash]',
    allChunks: true
});

module.exports = {
    context: __dirname,
    entry: {
        style: [
            './assets/src/scss/style.scss'
        ],
        deep_check: [
            './assets/src/scss/deep_check.scss'
        ],
        main: [
            './assets/src/js/main.js',
        ],
        font_awesome: [__dirname + '/node_modules/font-awesome/scss/font-awesome.scss']
    },

    output: {
        path: __dirname + '/assets/dist',
        publicPath: '/assets/dist/',
        filename: '[name].js?[chunkhash]',
        chunkFilename: 'js/chunk/[name].[id].js?[chunkhash]',
        library: '[name]'
    },

    resolve: {
        extensions: ['.js', '.css', '.scss'],
        alias: {}
    },

    externals: {
        "jquery": "jQuery"
    },

    devtool: NODE_ENV === 'development' ? "source-map" : false,

    watchOptions: {
        aggregateTimeout: 300
    },

    module: {
        rules: [
            {
                test: /\.js$/, // include .js files
                enforce: "pre", // preload the jshint loader
                exclude: /node_modules|bower_components|thirdparty|/, // exclude any and all files in the node_modules folder
                use: [
                    {
                        loader: "jshint-loader",
                        options: {
                            camelcase: true,
                            emitErrors: false,
                            failOnHint: false
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ "babel-preset-es2015" ].map(require.resolve)
                    }
                }
            },
            {
                test: /\.css$/,
                use: extractTextPluginCss.extract(['css-loader', 'resolve-url-loader'])
            },
            {
                test: /\.scss$/,
                use: extractTextPluginCss.extract(['css-loader?sourceMap', 'resolve-url-loader?sourceMap', 'sass-loader?sourceMap'])
            },
            {
                test: /\.(gif|png|jpg|svg|ttf|eot|woff|woff2)(\?\S*)?/,
                use: {
                    loader: 'file-loader',
                    options: {
                        filename: '[path][name].[ext]?[hash:6]'
                    }
                }
            }
        ]
    },

    plugins: (function() {
        let plugins = [];

        plugins.push(extractTextPluginCss);

        plugins.push(new AssetsPlugin({
            prettyPrint: true,
            filename: 'assets.json',
            path: __dirname + '/assets/dist'
        }));

        plugins.push(new ConcatPlugin({
            uglify: NODE_ENV === 'production',
            useHash: true, // md5 file
            sourceMap: false, // generate sourceMap
            name: 'jquery', // used in html-webpack-plugin
            fileName: '[name].js?[hash]',
            filesToConcat: [
                __dirname + '/node_modules/jquery/dist/jquery.min.js',
                __dirname + '/node_modules/jquery-migrate/dist/jquery-migrate.min.js',
                __dirname + '/node_modules/what-input/dist/what-input.min.js'
            ]
        }));

        plugins.push(new ConcatPlugin({
            uglify: NODE_ENV === 'production',
            useHash: true, // md5 file
            sourceMap: false, // generate sourceMap
            name: 'bootstrap', // used in html-webpack-plugin
            fileName: '[name].js?[hash]',
            filesToConcat: [
                __dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
            ]
        }));

        if (NODE_ENV === 'production') {
            plugins.push(new UglifyJsPlugin({
                test: /\.js($|\?)/i,
                cache: true,
                parallel: 4,
                sourceMap: true
            }));
        }

        plugins.push(new webpack.LoaderOptionsPlugin({
            debug: NODE_ENV !== 'production',
            preLoaders: [
                {
                    "test": "\\.js$",
                    "include": "src",
                    "exclude": [],
                    "loader": "jshint"
                }
            ]
        }));

        return plugins;
    })()
};
