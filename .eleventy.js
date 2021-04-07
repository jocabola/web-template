const esbuild = require('esbuild');
const chokidar = require('chokidar');

const buildJS = () => {
	esbuild.buildSync({
		entryPoints: ['src/main.js'],
		bundle: true,
		minify: false,
		sourcemap: false,
		define: { DEV_MODE: true },
		loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
		outfile: 'bundle/main.js',
	});
}

chokidar.watch('src/').on('change', (eventType, file) => {
	console.log(`Updated JS [${eventType}]`);
	buildJS();
});

buildJS();

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);
	// browser sync options
	eleventyConfig.setBrowserSyncConfig({
		ghostMode: false,
	});
	eleventyConfig.setWatchJavaScriptDependencies(false);
	eleventyConfig.addPassthroughCopy("bundle");
}