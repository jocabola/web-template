const chokidar = require('chokidar');
const isProduction = process.env.ELEVENTY_ENV === 'production';
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { buildJS, buildCSS } = require('./scripts/build/esbuild');

if(!isProduction) {
	const build = () => {
		buildJS(isProduction);
		buildCSS(isProduction);
	}

	const ev = {
		file: null,
		when: 0
	}

	chokidar.watch('src/').on('change', (file, eventType) => {
		if(file === ev.file && Date.now() - ev.when < 300) {
			console.log('ignoring dupliocated file change event...');
			return;
		}
		ev.file = file;
		ev.when = Date.now();

		if(file.indexOf('.ts') > -1) {
			console.log(`Updated JS [${file}]`);
			buildJS(isProduction);
		} else if(file.indexOf('.scss') > -1) {
			console.log(`Updated CSS [${file}]`);
			buildCSS(isProduction);
		}
	});

	build();
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
			data: '../../../data',
			input: 'src/site/pages',
			includes: '../partials',
			layouts: '../base',
			output: 'public'
		},
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
	}
}