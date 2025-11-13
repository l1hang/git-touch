const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,//用来配置babel-loader是否忽略node_modules中的文件。
  publicPath: './',//用来配置部署应用包时的基本URL。
  outputDir: 'dist', // 用来配置生产环境构建文件的目录。
  assetsDir: 'static',//用来配置放置生成的静态资源（js、css、img、fonts）的目录。
  lintOnSave: process.env.NODE_ENV === 'development',//用来配置是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。
  productionSourceMap: false,//用来配置是否为生产环境构建生成 source map 文件。
  devServer:{
    port:7777,
    host:'0.0.0.0',
    open:true,
    https:false,
  }
})
