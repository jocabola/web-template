const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');

const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const CleanCSS = require('clean-css');

const fs = require('fs');

function buildJS (isProduction=false) {
    return new Promise((resolve, reject) => {
		esbuild.build({
			entryPoints: ['src/js/main.js'],
			bundle: true,
			minify: isProduction,
			sourcemap: false,
			define: { 
				DEV_MODE: !isProduction ? "true" : "false",
			},
			loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
			outfile: 'bundle/main.js',
			/* plugins: [
				alias({
					'three': __dirname + '/../node_modules/three/build/three.min.js',
				})
			] */
		}).then(()=>{
			resolve();
		}).catch((err)=>{
			console.log("Error");
			reject(err);
		});
	})
}

const buildCSS = (isProduction=false) => {
	return new Promise((resolve, reject) => {
		const result = sass.compile('./src/styles/main.scss');
		const css = result.css.toString();
		postcss([autoprefixer])
			.process(css, {
				from: 'src/styles/main.scss',
				to: `bundle/main.css`,
			})
			.then((result) => {
				const finalCSS = !isProduction ? result.css : new CleanCSS({}).minify(result.css).styles;
				if(isProduction) {
					fs.writeFileSync(`bundle/main.css`, finalCSS, (err) => {
						if (err) console.log(err);
					});
				} else {
					fs.writeFile(`bundle/main.css`, finalCSS, (err) => {
						if (err) console.log(err);
					});
				}
				resolve();
			}).catch(err => {
				reject(err);
			});
	})
}

module.exports = {
    buildJS,
	buildCSS
}