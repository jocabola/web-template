const groq = require('groq');
const client = require('../../utils/sanityClient.js');

async function getSettings() {
  const filter = groq`*[_type == "generalSettings"][0]`;
  const docs = await client.fetch(filter).catch((err) => console.error(err));
  return docs;
}

module.exports = getSettings;
