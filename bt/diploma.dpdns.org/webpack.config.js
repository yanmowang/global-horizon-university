module.exports = {
  resolve: {
    fallback: {
      punycode: false,
      util: require.resolve('util/'),
    },
  },
  ignoreWarnings: [
    {
      module: /node_modules\/punycode/,
    },
    {
      module: /node_modules\/util/,
    },
  ],
};
