const sanityClient = require("@sanity/client");

const { sanity } = require("../client-config");

module.exports = sanityClient({
  ...sanity,
  useCdn: true,
  apiVersion: '2021-03-25',
  token: '',
});
