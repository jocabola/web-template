const esbuild = require('esbuild');
const chokidar = require('chokidar');
const isProduction = process.env.ELEVENTY_ENV === 'production';
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const fs = require('fs');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const CleanCSS = require('clean-css');

const OUT_CSS = 'bundle/main.css'

// Sanity shortcodes
const urlFor = require('./utils/imageUrl');
const urlForAsset = require('./utils/urlForAsset');
const blockText = require('./utils/blockText');

const buildJS = () => {
	esbuild.buildSync({
		entryPoints: ['src/js/main.js'],
		bundle: true,
		minify: isProduction,
		sourcemap: false,
		define: { DEV_MODE: true },
		loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
		outfile: 'bundle/main.js',
	});
}

const buildCSS = () => {
	sass.render(
		{ file: 'src/styles/main.scss' },
		function (err, result) {
			const css = result.css.toString();
			postcss([autoprefixer])
				.process(css, {
					from: 'src/styles/main.scss',
					to: OUT_CSS,
				})
				.then((result) => {

					const finalCSS = !isProduction ? result.css : new CleanCSS({}).minify(result.css).styles;

					fs.writeFile(OUT_CSS, finalCSS, (error) => {
						if (error) console.log(error);
					});
				});
		}
	);
}

if(!isProduction) {
	chokidar.watch('src/').on('change', (eventType, file) => {
		console.log(`Updated JS [${eventType}]`);
		buildJS();
		buildCSS();
	});
}

buildJS();
buildCSS();

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.setUseGitIgnore(false);
	// browser sync options
	eleventyConfig.setBrowserSyncConfig({
		ghostMode: false,
	});
	eleventyConfig.setWatchJavaScriptDependencies(false);
	eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
	eleventyConfig.addPassthroughCopy("bundle");

	/* eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	}); */

	eleventyConfig.addShortcode('imageUrlFor', (image, width = '400') => {
		if(!image) return;
		return urlFor(image).width(width).auto('format').url();
	});

	// eleventyConfig.addShortcode('assetUrlFor', (asset) => {
	// 		if(!!!asset) return 'no-asset';
	// 		return urlForAsset(asset);
	// });

	eleventyConfig.addShortcode('blockText', (content) => {
			return blockText(content);
	});


	return {
		dir: {
			data: '../data',
			input: 'src/site/pages',
			includes: '../partials',
			layouts: '../base',
			output: 'public'
		},
		templateFormats: ['html', 'njk'],
		htmlTemplateEngine: 'njk',
	}
}