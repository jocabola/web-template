const imageUrl = require('@sanity/image-url');
const sanityClient = require('./sanityClient');

// Learn more: https://www.sanity.io/docs/asset-pipeline/image-urls
function urlFor(source) {
  return imageUrl(sanityClient).image(source);
}

module.exports = urlFor;

// Learn more on https://www.sanity.io/guides/introduction-to-portable-text
module.exports = {
  types: {
    authorReference: ({ node }) =>
      `[${node.name}](/authors/${node.slug.current})`,
    code: ({ node }) => '```' + node.language + '\n' + node.code + '\n```',
    mainImage: ({ node }) => `![${node.alt}](${urlFor(node).width(600).url()})`,
  },
};
