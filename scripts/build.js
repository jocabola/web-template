const { buildJS } = require("./esbuild");

async function buildJSSync () {
    await buildJS(true);
	console.log("JS built!");
}

buildJSSync();