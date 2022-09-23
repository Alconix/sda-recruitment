const { ContextReplacementPlugin } = require("webpack");
const path = require("path");

module.exports = {
  compiler: { styledComponents: true },
  webpack: (config) => {
    config.plugins.push(new ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/));
    config.resolve.alias["@ant-design/icons/lib/dist$"] = path.resolve(
      __dirname,
      "./utils/icons.ts"
    );

    return config;
  },
};
