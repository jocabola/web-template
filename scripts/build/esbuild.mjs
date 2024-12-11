import esbuild from 'esbuild';
// import alias from 'esbuild-plugin-alias';

import * as sass from 'sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import CleanCSS from 'clean-css';

import fs from 'fs';

export function buildJS (isProduction=false) {
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

export const buildCSS = (isProduction=false) => {
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