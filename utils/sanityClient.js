const sanityClient = require("@sanity/client");

const { sanity } = require("../sanity-config");

module.exports = sanityClient({
  ...sanity,
  useCdn: true,
  apiVersion: '2021-03-25',
  token: '',
});
