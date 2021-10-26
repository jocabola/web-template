const BlocksToHtml = require('@sanity/block-content-to-html');
const serializers = require('./serializers');

function blockText(content) {
  console.log('Hola?');
  const text = BlocksToHtml({
    blocks: content,
    serializers,
  });
  return text;
}

module.exports = blockText;
