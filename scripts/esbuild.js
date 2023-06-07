const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');

function buildJS (isProduction=false) {
    return new Promise((resolve, reject) => {
		esbuild.build({
			entryPoints: ['src/js/main.js'],
			bundle: true,
			minify: isProduction,
			sourcemap: false,
			define: { DEV_MODE: !isProduction ? "true" : "false" },
			loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
			outfile: 'bundle/main.js',
			plugins: [
				alias({
					'three': __dirname + '/../node_modules/three/build/three.min.js',
				})
			]
		}).then(()=>{
			resolve();
		}).catch((err)=>{
			console.log("Error");
			reject(err);
		});
	})
}

module.exports = {
    buildJS: buildJS
}