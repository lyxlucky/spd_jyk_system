const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { transformElementScss } = require('ele-admin/lib/utils/dynamic-theme');

module.exports = {
  publicPath: '/jyk/',
  outputDir: 'jyk',
  productionSourceMap: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
  configureWebpack: {
    performance: {
      maxAssetSize: 2000000,
      maxEntrypointSize: 2000000
    }
  },
  chainWebpack(config) {
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
        target: 'http://localhost:16416/',
        target: 'http://47.106.243.154:9001',
      }
    },
    // port: 8060
  },
};
