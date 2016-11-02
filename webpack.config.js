var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');
var plugins = [];
var readdir = fs.readdirSync('./src/views/docs/');
for(var file in readdir){
    var conf = {
         title: 'juicleh5',
         filename:readdir[file],
         template: "./src/views/template.html",
         inject: 'body'
    }
    plugins.push(new HtmlwebpackPlugin(conf));
}
module.exports = {
  entry: path.resolve(path.resolve(__dirname), 'app/index.js'),
  output: {
    path: 'dist',
    filename: 'js/index.js',
    hash: true,
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: path.resolve(path.resolve(__dirname), 'src/css')
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less'],
        include: path.resolve(path.resolve(__dirname), 'src/assets/css')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=40000'
      },
      {
        test: /\.html$/, 
        loader: 'html'
      },
      { test: /\.js$/, loader: 'jsx-loader?harmony' } ,
      {test: /\.eot/,loader : 'file?prefix=font/'},
      {test: /\.woff/,loader : 'file?prefix=font/&limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf/, loader : 'file?prefix=font/'}, 
      {test: /\.svg/, loader : 'file?prefix=font/'}
    ]
  },
  externals: {
    'react': 'window.React'
  },
  plugins: plugins
};