module.exports = {
  webpack: {
      configure: (webpackConfig, {env, paths}) => {
          return {
                resolve: {
                    fallback: {
                        util: require.resolve("util/"),
                        stream: require.resolve("stream-browserify"),
                        buffer: require.resolve("buffer")
                    }
                },
              ...webpackConfig,
              entry: {
                  main: [env === 'development' &&
                  require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                  content: './src/chrome/content.ts',
              },
              output: {
                  ...webpackConfig.output,
                  filename: 'static/js/[name].js',
              },
              optimization: {
                  ...webpackConfig.optimization,
                  runtimeChunk: false,
              }
          }
      },
  }
}