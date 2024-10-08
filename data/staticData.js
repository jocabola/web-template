const staticData = {

	// Get global "isProduction"
	isProduction: process.env.ELEVENTY_ENV === 'production',
	baseURL: "/",
    title: "Hello World",
	description: "Lorem ipsum."
}

module.exports = staticData;