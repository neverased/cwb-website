// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const PugPlugin = require("pug-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV == "production";

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : "source-map",
    entry: {
      index: "src/pug/index.pug",
      about: "src/pug/pages/about.pug",
      contact: "src/pug/pages/contact.pug",
      home: "src/pug/pages/home.pug",
      404: "src/pug/pages/404.pug",
      prices: "src/pug/pages/prices.pug",
      work: "src/pug/pages/work.pug",
    },
    output: {
      path: path.join(__dirname, "dist"),
    },

    resolve: {
      alias: {
        // use Webpack aliases instead of relative paths like ../../
        Images: path.join(__dirname, "assets/images/"),
      },
    },

    plugins: [
      new PugPlugin({
        pretty: true, // formatting HTML, useful for development mode
        js: {
          // output filename of extracted JS file from source script
          filename: "assets/js/[name].[contenthash:8].js",
        },
        css: {
          // output filename of extracted CSS file from source style
          filename: "assets/css/[name].[contenthash:8].css",
        },
      }),
      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
      rules: [
        // templates
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ["css-loader", "sass-loader"],
        },

        // images
        {
          test: /[\\/]images[\\/].+\.(png|svg|jpe?g|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/imgages/[name].[hash:8][ext]",
          },
        },
      ],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      //open: true, // open in default browser
      watchFiles: {
        paths: ["src/**/*.*"],
        options: {
          usePolling: true,
        },
      },
    },
  };
};
