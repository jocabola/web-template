const groq = require('groq');
const client = require('../../utils/sanityClient.js');

async function getProjects() {
  const filter = groq`*[_type == "project"]`;
  const projection = '';
  const order = ``;
  const query = [filter, projection, order].join(' ');
  const docs = await client.fetch(query).catch((err) => console.error(err));
  return docs;
}

module.exports = getProjects;
