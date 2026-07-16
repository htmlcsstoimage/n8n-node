import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const entryPoint = path.join(root, 'vendor/html-css-to-image-client/src/index.ts');
const outputFile = path.join(
	root,
	'dist/nodes/HtmlCssToImage/htmlCssToImageClient.bundle.js',
);

if (!fs.existsSync(entryPoint)) {
	throw new Error(
		'TypeScript client submodule is missing. Run "git submodule update --init --recursive".',
	);
}

await build({
	entryPoints: [entryPoint],
	outfile: outputFile,
	bundle: true,
	platform: 'node',
	format: 'cjs',
	target: 'node18',
	define: {
		'process.env.HCTI_API_ID': 'undefined',
		'process.env.HCTI_API_KEY': 'undefined',
	},
	sourcemap: false,
	minify: false,
});

function removeDeclarations(directory) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			removeDeclarations(entryPath);
		} else if (entry.name.endsWith('.d.ts')) {
			fs.rmSync(entryPath);
		}
	}
}

removeDeclarations(path.join(root, 'dist'));
