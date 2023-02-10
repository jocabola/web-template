require('dotenv').config('../toolkitconfig.js');
const sanityClient = require("@sanity/client");

const config = {
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: process.env.SANITY_API_VERSION,
    token: process.env.SANITY_TOKEN,
    useCdn: false
  },
};

module.exports.client = sanityClient(config.sanity);