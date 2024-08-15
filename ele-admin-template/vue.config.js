const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { transformElementScss } = require('ele-admin/lib/utils/dynamic-theme');
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/jyknw/',
  outputDir: 'jyknw',
  productionSourceMap: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
  configureWebpack: {
    performance: {
      maxAssetSize: 2000000,
      maxEntrypointSize: 2000000
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV !== 'development') {
      // gzip 压缩
      config.plugin('compressionPlugin').use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html)$/,
          threshold: 10240
        })
      );
    }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded',
          importer: transformElementScss()
        }
      }
    }
  },
  // 白名单，跨域问题
  devServer: {
    proxy: {
      '/api': {
        // 这里可以写你自己的后端接口地址，如：
        // target: 'http://localhost:16416/'

        // 北大
        // target: 'http://47.106.243.154:9001',

        // 北大内网
        //  target: 'http://100.100.100.45:8001',

        // 龙华妇幼外网
        // target: 'http://61.145.158.182:10082',

        // 龙华妇幼内网
        // target: 'http://10.88.10.209:82/',

        // 华南医院外网
        // target: 'http://183.62.200.242:82/',

        //萨米医院外网
        // target:'http://120.78.226.92:18002/',

        //萨米医院内网
        target:' http://192.168.8.90:18002',

        //肿瘤外网
        // target: 'http://113.106.170.118:82/'

        //肿瘤内网
        // target: 'http://199.199.197.110:8001'

      }
    }
    // port: 8060
  }
};
