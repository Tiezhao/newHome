const CracoLessPlugin = require('craco-less');
const path = require('path')
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl)
const { ESLINT_MODES } = require('@craco/craco');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const TerserPlugin = require('terser-webpack-plugin')


module.exports = {

  eslint: {
    mode: ESLINT_MODES.file
  },
  webpack: {
    alias: {
      '@@': pathResolve('.'),
      '@': pathResolve('src'),
      '@assets': pathResolve('src/assets'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@img': path.resolve(__dirname, './src/assets/img'),
      '@components': pathResolve('src/components'),
      '@hooks': pathResolve('src/hooks'),
      '@pages': pathResolve('src/pages'),
      '@stores': pathResolve('src/stores'),
      '@utils': pathResolve('src/utils'),
      '@service': path.resolve(__dirname, './src/service'),
      '@configs': path.resolve(__dirname, './src/configs'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@router': path.resolve(__dirname, './src/router'),
      '@locales': path.resolve(__dirname, './src/assets/locales'),
      '@theme': path.resolve(__dirname, './src/theme'),

    },
    plugins: [
      // 压缩gz
      new CompressionWebpackPlugin({
        deleteOriginalAssets: false,
        test: /\.js$|\.css$/, // 处理文件
        threshold: 1024, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8// 只有压缩率比这个值小的资源才会被处理
      }),
      new WebpackBuildNotifierPlugin({
        logo: path.resolve('./img/logo512.png'),
        suppressSuccess: true
      }),

      new TerserPlugin({
        terserOptions: process.env.NODE_ENV !==  'development' ? {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] // 移除console
          }
        } : {},
      }),
    ],
    configure: (webpackConfig, { env, paths }) => {

      webpackConfig.devtool = process.env.NODE_ENV ===  'development' ? 'cheap-module-source-map' : 'cheap-module-source-map'
      return webpackConfig;

    }


  },

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    }
  ],
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  }
};
