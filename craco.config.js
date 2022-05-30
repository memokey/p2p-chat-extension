const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
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
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': JSON.stringify(dotenv.parsed),
                    }),
                    new webpack.optimize.LimitChunkCountPlugin({
                        maxChunks: 1,
                    }),
                    new MiniCssExtractPlugin({
                        filename: 'css/[name].css',
                    }),
                ],
                output: {
                    ...webpackConfig.output,
                    filename: 'js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        },
    }
}