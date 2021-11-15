const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const sourceMap = isDev ? "source-map" : false;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    };
    if(isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ];
    }
    return config;
};

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`;

const babelOptions = (preset) => {
    const opts = {
        presets: [
            "@babel/preset-env",
        ]
    };
    if(preset) {
        opts.presets.push(preset);
    }
    return opts;
};

const jsLoaders = () => {
    const loaders = [
        {
            loader: "babel-loader",
            options: babelOptions()
        }
    ];
    if (isDev) {
        loaders.push("eslint-loader");
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.ts"]
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    devtool: sourceMap,
    resolve: {
        extensions: [
            ".css",
            ".scss",
            ".less",
            ".js" ,
            ".ts" ,
            ".json",
            ".png",
            ".xml",
            ".csv",
        ],
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@": path.resolve(__dirname, "src"),
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "src"),
            watch: true,
        },
        port: 3000,
        open: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd
            },
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "src/assets/favicon.ico"),
        //             to:path.resolve(__dirname, "dist"),
        //         },
        //     ]
        // }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: babelOptions("@babel/preset-typescript")
                }
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader",
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(xml)$/i,
                use: ["xml-loader"]
            },
            {
                test: /\.(csv)$/i,
                use: ["csv-loader"]
            }
        ]
    },
    optimization: optimization(),
};