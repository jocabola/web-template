const chokidar = require('chokidar');
const isProduction = process.env.ELEVENTY_ENV === 'production';
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { buildJS } = require('./scripts/build/esbuild');

if(!isProduction) {
	chokidar.watch('src/').on('change', (eventType, file) => {
		console.log(`Updated JS [${eventType}]`);
		buildJS(isProduction);
	});

	buildJS(isProduction);
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.setUseGitIgnore(false);
	// browser sync options
	eleventyConfig.setServerOptions({
		module: "@11ty/eleventy-server-browsersync",
		ghostMode: false
	});
	eleventyConfig.setWatchJavaScriptDependencies(false);
	eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
	eleventyConfig.addPassthroughCopy("bundle");

	/* eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	}); */

	return {
		dir: {
			data: '../data',
			input: 'src/site/pages',
			includes: '../partials',
			layouts: '../base',
			output: 'public'
		},
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
	}
}