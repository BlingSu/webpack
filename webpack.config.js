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
