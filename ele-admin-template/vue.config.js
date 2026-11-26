const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { transformElementScss } = require('ele-admin/lib/utils/dynamic-theme');
const path = require('path');
const { resolveHospitalAssetFiles } = require('./src/config/hospital-assets.js');

function resolve(dir) {
  return path.join(__dirname, dir);
}

function resolveHospitalAssetPaths(env) {
  const files = resolveHospitalAssetFiles(env);
  const empty = resolve('src/config/hospital-asset-empty.js');
  return {
    logoPath: resolve(`src/assets/${files.logoFile}`),
    sealPath: files.sealFile ? resolve(`src/assets/${files.sealFile}`) : empty,
    loginBgPath: files.loginBgFile
      ? resolve(`src/assets/${files.loginBgFile}`)
      : empty
  };
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
  bjwwnew: {
    target: 'http://39.107.78.98:6049/',
    publicPath: '/jykww/',
    outputDir: 'jykww'
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
    target: 'https://nat.sch-szu.com/spdapi/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  hnnw: {
    target: 'https://172.16.1.66:82/',
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
  chrmyyww: {
    target: 'http://121.11.24.194:18011/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  chrmyynw: {
    target: 'http://192.168.199.48:18011/',
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
  lgnw: {
    target: 'http://10.0.149.12:8001/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  sebb: {
    target: 'http://10.173.128.80:18101/sebb/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  sebbww: {
    target: 'http://47.106.243.154:18101/sebb/',
    publicPath: '/sebb/jyk/',
    outputDir: 'jyk'
  },
  sedp: {
    target: 'http://10.173.128.80:18105/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  sedpww: {
    target: 'http://47.106.243.154:18101/sedp/',
    publicPath: '/sedp/jyk/',
    outputDir: 'jyk'
  },
  selh: {
    target: 'http://10.173.128.80:18103/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  selhww: {
    target: 'http://47.106.243.154:18101/selh/',
    publicPath: '/selh/jyk/',
    outputDir: 'jyk'
  },
  xhww: {
    target: 'http://47.106.243.154:891/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  xhnw: {
    target: 'http://172.21.153.10:891/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  lglsww: {
    target: 'https://spd.lg3h.com:16004/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  lglsnw: {
    target: 'http://192.168.2.113:16002/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  lglssk: {
    target: 'http://172.31.71.152:16002/',
    publicPath: '/jyksk/',
    outputDir: 'jyksk'
  },
  stse: {
    target: 'http://172.30.254.9:82/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  stseww: {
    target: 'http://120.197.247.20:45192/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  gzbjww: {
    target: 'http://192.168.250.192:17501/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  gzbjnw: {
    target: 'http://192.168.250.192:17501/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  szssww: {
    target: 'http://47.113.126.25:17002/',
    publicPath: '/jyk/',
    outputDir: 'jyk'
  },
  szssnw: {
    target: 'http://172.25.172.210:17002/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  },
  yzrmnw: {
    target: 'http://192.168.102.84:17701/',
    publicPath: '/jyknw/',
    outputDir: 'jyknw'
  }
}

const currentEnv = process.env.VUE_APP_ENV || 'local';
const config = envConfig[currentEnv] || envConfig.local;
const hospitalAssetPaths = resolveHospitalAssetPaths(currentEnv);

module.exports = {
  // 开发不跑 ESLint，生产构建仍检查
  lintOnSave: process.env.NODE_ENV === 'production',
  publicPath: process.env.VUE_APP_BASE_URL || config.publicPath,
  outputDir: config.outputDir,
  productionSourceMap: false,
  runtimeCompiler: false,
  // Node 22 下 thread-loader 易 spawn/崩溃，关闭并行编译保证打包稳定
  parallel: false,
  transpileDependencies: ['element-ui', 'ele-admin', 'vue-i18n'],
  configureWebpack: config => {
    config.performance = {
      maxAssetSize: 2000000,
      maxEntrypointSize: 2000000
    }

    if (process.env.NODE_ENV === 'development') {
      // 减轻 source map 内存
      config.devtool = 'eval'
      // 只用磁盘缓存
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 0,
        memoryCacheUnaffected: false
      }
      // 页面首次打开时再编译
      config.experiments = {
        ...(config.experiments || {}),
        lazyCompilation: {
          entries: false,
          imports: true,
          test: /[\\/]src[\\/]views[\\/]/,
          backend: {
            listen: {
              host: '127.0.0.1',
              port: 0
            }
          }
        }
      }
    } else {
      config.cache = false
    }
  },
  chainWebpack(config) {
    // 按当前 VUE_APP_ENV 只打包该医院 logo / 院徽 / 登录背景
    config.resolve.alias
      .set('hospital-logo', hospitalAssetPaths.logoPath)
      .set('hospital-seal', hospitalAssetPaths.sealPath)
      .set('hospital-login-bg', hospitalAssetPaths.loginBgPath);

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
      config.output
        .filename('js/[name].[contenthash:8].js')
        .chunkFilename('js/[name].[contenthash:8].js');

      config.plugin('extract-css').tap(args => {
        args[0].filename = 'css/[name].[contenthash:8].css';
        args[0].chunkFilename = 'css/[name].[contenthash:8].css';
        return args;
      });

      config.optimization.runtimeChunk('single');

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vueLib: {
            name: 'vue-lib',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex|vue-i18n)[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          element: {
            name: 'element',
            test: /[\\/]node_modules[\\/](element-ui|ele-admin)[\\/]/,
            priority: 9,
            chunks: 'initial'
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 8,
            chunks: 'initial',
            minSize: 30000,
            minChunks: 1
          }
        }
      });

      config.plugin('compressionPlugin').use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html)$/,
          threshold: 10240
        })
      );
    }

    if (process.env.NODE_ENV === 'development') {
      const { codeInspectorPlugin } = require('code-inspector-plugin');
      config.plugin('code-inspector-plugin').use(
        codeInspectorPlugin({
          bundler: 'webpack',
          editor: 'webstorm', // code/cursor/webstorm
          showSwitch: true,
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
  // host: '0.0.0.0' 允许局域网用本机 IP 访问；本机仍可用 http://127.0.0.1:8060
  devServer: {
    host: '0.0.0.0',
    port: 8060,
    allowedHosts: 'all',
    client: {
      // 局域网打开时 HMR websocket 连到访问者用的主机名/IP
      webSocketURL: 'auto://0.0.0.0:0/ws'
    },
    proxy: {
      '/api': {
        target: config.target,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/Upload': {
        target: config.target,
        changeOrigin: true,
        secure: false
      },
      '/Excel': {
        target: config.target,
        changeOrigin: true,
        secure: false
      }
    }
  }
};
