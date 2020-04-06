module.exports = function (bundler) {
  bundler.addAssetType('pug', require.resolve('./RiotAsset'));
};
