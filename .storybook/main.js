const webpack = require("webpack");
const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  stories: ["../app/javascript/components/**/*.stories.@(js|mdx)"],
  addons: [
    "@storybook/addon-knobs",
    "@storybook/addon-actions",
    "@storybook/addon-viewport/register",
    "@storybook/addon-docs/preset",
    "@storybook/addon-postcss",
    // "@storybook/preset-create-react-app",
    // "@storybook/addon-a11y/register",
    // "storybook-addon-material-ui/register",
    // "@storybook/addon-links",
  ],
  webpackFinal: async (config, {configType}) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: "react",
        ReactDOM: "react-dom",
      })
    );

    config.plugins.push(new WorkerPlugin());

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    config.resolve = {
      extensions: [".js", ".jsx", ".gql", ".graphql"],
      alias: {
        "@shared": path.resolve(
          __dirname,
          "../app/javascript/components/shared/"
        ),
        "@sagas": path.resolve(__dirname, "../app/javascript/sagas/"),
        "@components": path.resolve(__dirname, "../app/javascript/components/"),
        searchable_table: path.resolve(
          __dirname,
          "../app/javascript/components/searchable_table/"
        ),
        "@columns": path.resolve(
          __dirname,
          "../app/javascript/components/searchable_table/components/defaults/"
        ),
        searchable_table_infinite: path.resolve(
          __dirname,
          "../app/javascript/components/searchable_table_infinite/"
        ),
        "@graphql": path.resolve(__dirname, "../app/javascript/graphql/"),
        "@actions": path.resolve(__dirname, "../app/javascript/actions/"),
        "@selectors": path.resolve(__dirname, "../app/javascript/selectors/"),
        "@packs": path.resolve(__dirname, "../app/javascript/packs/"),
        "@reducers": path.resolve(__dirname, "../app/javascript/reducers/"),
        "@utils": path.resolve(__dirname, "../app/javascript/utils.js"),
      },
    };

    console.log(__dirname);
    configType.resolve = {
      extensions: [".js", ".jsx", ".gql", ".graphql"],
      alias: {
        "@shared": path.resolve(
          __dirname,
          "../../app/javascript/components/shared/"
        ),
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
        "@selectors": path.resolve(
          __dirname,
          "../../app/javascript/selectors/"
        ),
        "@packs": path.resolve(__dirname, "../../app/javascript/packs/"),
        "@reduders": path.resolve(__dirname, "../../app/javascript/reduders/"),
        "@utils": path.resolve(__dirname, "../../app/javascript/utils.js"),
      },
    };

    // Return the altered config
    return config;
  },
};

// Addons
//----------------------------------------------

// Props Combinations
// https://github.com/evgenykochetkov/react-storybook-addon-props-combinations

// GraphQL Story Decorator
// https://github.com/abhiaiyer91/apollo-storybook-decorator
