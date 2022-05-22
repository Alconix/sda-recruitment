const { ContextReplacementPlugin } = require("webpack");
const path = require("path");

module.exports = {
  plugins: [new ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)],
  resolve: {
    alias: {
      "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./utils/icons.ts"),
      alias: { moment: `moment/moment.js` },
    },
  },
};
