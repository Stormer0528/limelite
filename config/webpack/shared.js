// Additional config shared among all environments
const webpack = require("webpack");
const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
      },
      {
        test: /\.js$/,
        include: /node_modules\/react-dom/,
        use: ["react-hot-loader/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".gql", ".graphql"],
    alias: {
      "@shared": path.resolve(
        __dirname,
        "../../app/javascript/components/shared/"
      ),
      "@sagas": path.resolve(__dirname, "../../app/javascript/sagas/"),
      "@components": path.resolve(
        __dirname,
        "../../app/javascript/components/"
      ),
      searchable_table: path.resolve(
        __dirname,
        "../../app/javascript/components/searchable_table/"
      ),
      "@columns": path.resolve(
        __dirname,
        "../../app/javascript/components/searchable_table/components/defaults/"
      ),
      searchable_table_infinite: path.resolve(
        __dirname,
        "../../app/javascript/components/searchable_table_infinite/"
      ),
      "@graphql": path.resolve(__dirname, "../../app/javascript/graphql/"),
      "@actions": path.resolve(__dirname, "../../app/javascript/actions/"),
      "@selectors": path.resolve(__dirname, "../../app/javascript/selectors/"),
      "@packs": path.resolve(__dirname, "../../app/javascript/packs/"),
      "@reducers": path.resolve(__dirname, "../../app/javascript/reducers/"),
      "@utils": path.resolve(__dirname, "../../app/javascript/utils.js"),
    },
  },
  plugins: [
    new WorkerPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      React: "react",
      ReactDOM: "react-dom",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG || false),
    }),
  ],
};
