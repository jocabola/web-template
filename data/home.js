const groq = require('groq');
const client = require('../../utils/sanityClient.js');

async function getPage() {
  const filter = groq`*[_type == "home"][0]`;
  const docs = await client.fetch(filter).catch((err) => console.error(err));
  return docs;
}

module.exports = getPage;
