const client = require('./sanityClient');
const imageUrlBuilder = require('@sanity/image-url');

const builder = imageUrlBuilder(client);

function imageUrl(source) {
  return builder.image(source);
}

module.exports = imageUrl;
