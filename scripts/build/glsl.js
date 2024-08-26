const fs = require('fs');

const SRC = `${__dirname}/../../src/glsl/includes/`;
const ext = ['glsl', 'vert', 'frag'];

const files = [];

function parse(path) {
	const cnt = fs.readdirSync(path);

	for (const file of cnt) {
		const parts = file.split(".");

		if (parts.length > 1 && ext.indexOf(parts[parts.length - 1]) > -1) {
			// its a file!
			files.push({
				basePath: path.split(SRC)[1],
				file: file
			});
		} else {
			//assume it's a dir
			parse(path + file);
		}
	}
}

parse(SRC);

// console.log(`Found ${files.length} glsl files to include.`);
// console.log('Generating glsl TS lib file...');

const basePath = "../../glsl/includes/";
const filename = __dirname + "/../../src/js/gfx/Shaders.ts";
let content = `import { ShaderChunk } from 'three';

`;

function getFileDesc(file) {
	const parts = file.split('.');
	parts.splice(parts.length - 1, 1);

	return parts.join('_');
}

function getID(file) {
	if (file.basePath.length > 0) {
		const parts = file.basePath.split("/");
		return `${parts.join("_")}_${getFileDesc(file.file)}`;
	}
	return getFileDesc(file.file);
}

for (const file of files) {
	if (file.basePath.length) {
		content += `import ${getID(file)} from '${basePath + file.basePath}/${file.file}';
`;
	} else {
		content += `import ${getID(file)} from '${basePath}${file.file}';
`;
	}

}

content += `
export function initShaders() {`;

for (const file of files) {
	content += `
    ShaderChunk['${getID(file)}'] = ${getID(file)}`;
}

content += `
}`;

fs.writeFileSync(filename, content, { encoding: 'utf-8' });

console.log('Done');