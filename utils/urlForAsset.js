const client = require('./sanityClient');
const { buildFileUrl, getFile } = require('@sanity/asset-utils');


function urlForAsset(asset) {
  const file = getFile(asset, client.clientConfig);
  return buildFileUrl(file.asset, client.clientConfig);
}

module.exports = urlForAsset;



