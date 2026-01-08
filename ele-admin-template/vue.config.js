const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { transformElementScss } = require('ele-admin/lib/utils/dynamic-theme');
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 环境配置映射
const envConfig = {
  local: {
    target: 'http://localhost:16416/',
    publicPath: '/',
    outputDir: 'dist'
  },
  test: {
    target: 'http://120.79.135.98:891/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  bjww: {
    target: 'http://39.107.78.98:6049/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  bjnw: {
    target: 'http://172.27.2.102:18002/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  bjnwhttps: {
    target: 'https://spd.pkuph.cn:10082/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  bdww: {
    target: 'http://47.106.243.154:9001/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  bdnw: {
    target: 'http://100.100.100.45:8001/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  lhfyww: {
    target: 'http://61.145.158.182:10082/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  lhfynw: {
    target: 'http://10.88.10.209:82/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  hnww: {
    target: 'http://183.62.200.242:82/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  hnnw: {
    target: 'http://172.16.4.59:82/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  smww: {
    target: 'http://120.78.226.92:18002/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  smnw: {
    target: 'http://192.168.8.90:18002/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  stzlww: {
    target: 'http://113.106.170.118:82/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  stzlnw: {
    target: 'http://199.199.197.110:8001/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  zxww: {
    target: 'http://47.106.243.154:831/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  zxnw: {
    target: 'http://172.16.0.99:82/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  lgww: {
    target: 'http://218.17.60.162:10052/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  se2bb: {
    target: 'http://10.173.128.80:18101/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  se2bbww: {
    target: 'http://47.106.243.154:18101/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  dpyq: {
    target: 'http://10.173.128.80:18105/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  lhyq: {
    target: 'http://10.173.128.80:18103/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  }
}

const currentEnv = process.env.VUE_APP_ENV || 'local';
const config = envConfig[currentEnv] || envConfig.local;

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL || config.publicPath,
  outputDir: config.outputDir,
  productionSourceMap: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
  configureWebpack: {
    performance: {
      maxAssetSize: 2000000,
      maxEntrypointSize: 2000000
    },
    cache: {
      type: 'filesystem',
    },
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
  },  // 白名单，跨域问题
  devServer: {
    proxy: {
      '/api': {
        target: config.target,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
    // port: 8060
  }
};
