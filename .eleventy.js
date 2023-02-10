const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const chokidar = require('chokidar');
const isProduction = process.env.ELEVENTY_ENV === 'production';
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const fs = require('fs');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const CleanCSS = require('clean-css');

// Sanity shortcodes
const urlFor = require('./utils/imageUrl');
const urlForAsset = require('./utils/urlForAsset');
const blockText = require('./utils/blockText');

const OUT_BUNDLE = 'bundle';

const buildJS = () => {
	esbuild.build({
		entryPoints: ['src/js/main.js'],
		bundle: true,
		minify: isProduction,
		sourcemap: false,
		define: { DEV_MODE: "true" },
		loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
		outfile: `${OUT_BUNDLE}/main.js`,
		plugins: [
			alias({
				'three': __dirname + '/node_modules/three/build/three.min.js',
			})
		]
	});
}

const buildCSS = () => {
	const result = sass.compile('./src/styles/main.scss');
	const css = result.css.toString();
	postcss([autoprefixer])
		.process(css, {
			from: 'src/styles/main.scss',
			to: `${OUT_BUNDLE}/main.css`,
		})
		.then((result) => {
			const finalCSS = !isProduction ? result.css : new CleanCSS({}).minify(result.css).styles;
			fs.writeFile(`${OUT_BUNDLE}/main.css`, finalCSS, (err) => {
				if (err) console.log(err);
			});
		})
}

if (!isProduction) {
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
		middleware: [
			(req, res, next) => {
				if (req.url.endsWith('.json.gz')) {
				res.setHeader('Content-Type', 'application/json');
				res.setHeader('Content-Encoding', 'gzip');
				}
				next();
			},
		],
	});
	eleventyConfig.setWatchJavaScriptDependencies(false);
	eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
	eleventyConfig.addPassthroughCopy(OUT_BUNDLE);

	eleventyConfig.addShortcode('imageUrlFor', (image, max = '400', format = 'webp') => {
		if (!image) return;
		// const max = isProduction ? maxSize : maxSize;
		return urlFor(image).height(max).fit('max').format(format).quality(95).url();
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