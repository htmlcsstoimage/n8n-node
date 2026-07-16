import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const generatedPath = path.join(root, 'nodes/HtmlCssToImage/generatedProperties.ts');
const clientFiles = [path.join(root, 'vendor/html-css-to-image-client/src/types/request.ts')];

function primitiveProperties(className) {
	for (const sourcePath of clientFiles) {
		const sourceFile = ts.createSourceFile(
			sourcePath,
			fs.readFileSync(sourcePath, 'utf8'),
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS,
		);
		const declaration = sourceFile.statements.find(
			(statement) => ts.isClassDeclaration(statement) && statement.name?.text === className,
		);
		if (!declaration) continue;

		return declaration.members
			.filter(ts.isPropertyDeclaration)
			.filter((member) => ts.isIdentifier(member.name))
			.filter((member) => member.name.text !== '__type')
			.filter((member) => {
				const type = member.type?.getText(sourceFile) ?? '';
				return (
					type === 'string' ||
					type === 'number' ||
					type === 'boolean' ||
					type === 'string[]' ||
					type.endsWith('Type')
				);
			})
			.map((member) => member.name.text);
	}

	throw new Error(`Missing class ${className}`);
}

test('generated n8n fields include every supported primitive client parameter', () => {
	const generated = fs.readFileSync(generatedPath, 'utf8');
	const expected = [
		...primitiveProperties('BaseCreateImageRequest'),
		...primitiveProperties('CreateHtmlCssImageRequest').filter((name) => name !== 'html'),
		...primitiveProperties('CreateUrlImageRequest').filter((name) => name !== 'url'),
	];

	for (const apiName of expected) {
		assert.match(generated, new RegExp(`"${apiName}"`), `Missing generated field for ${apiName}`);
	}
});

test('published package has no runtime dependencies', () => {
	const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
	assert.equal(packageJson.dependencies, undefined);
});

test('credential validation uses the authenticated ping endpoint', () => {
	const credentialSource = fs.readFileSync(
		path.join(root, 'credentials/HtmlCssToImageApi.credentials.ts'),
		'utf8',
	);
	assert.match(credentialSource, /url:\s*'\/v1\/ping'/);
	assert.doesNotMatch(credentialSource, /\/v1\/images/);
});

test('HTML and CSS fields use their dedicated n8n editors', () => {
	const nodeSource = fs.readFileSync(
		path.join(root, 'nodes/HtmlCssToImage/HtmlCssToImage.node.ts'),
		'utf8',
	);
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	assert.match(nodeSource, /editor:\s*'htmlEditor'/);
	assert.match(generatedSource, /"editor":\s*"cssEditor"/);
});

test('URL screenshot options include the client CSS field', () => {
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	const urlOptions = generatedSource.slice(generatedSource.indexOf('export const urlClientOptions'));
	assert.match(urlOptions, /"displayName":\s*"CSS"/);
	assert.match(urlOptions, /"editor":\s*"cssEditor"/);
});

test('Google Fonts uses a repeatable fixed collection', () => {
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	const googleFontsStart = generatedSource.indexOf('"name": "googleFonts"');
	const googleFontsField = generatedSource.slice(googleFontsStart, googleFontsStart + 900);
	assert.match(googleFontsField, /"type":\s*"fixedCollection"/);
	assert.match(googleFontsField, /"multipleValues":\s*true/);
	assert.match(googleFontsField, /"placeholder":\s*"Add Value"/);
});

test('viewport fields explain that width and height are required together', () => {
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	const matches = generatedSource.match(
		/Viewport width and viewport height must be set together\./g,
	);
	assert.ok(matches && matches.length >= 4);
});

test('jumbo fields explain that width and height are required together', () => {
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	const matches = generatedSource.match(
		/Jumbo max width and jumbo max height must be set together\./g,
	);
	assert.ok(matches && matches.length >= 4);
});

test('generated optional scalar client fields default to null', () => {
	const generatedSource = fs.readFileSync(generatedPath, 'utf8');
	assert.doesNotMatch(generatedSource, /"default":\s*(0|false)/);
	assert.doesNotMatch(generatedSource, /"default":\s*"(light|dark|print|screen)"/);
	assert.match(generatedSource, /"default":\s*null/);
});

test('request adapters require viewport width and height together', () => {
	const require = createRequire(import.meta.url);
	const helpersPath = path.join(root, 'dist/nodes/HtmlCssToImage/helpers.js');
	delete require.cache[helpersPath];
	const { makeHtmlRequest, makeUrlRequest } = require(helpersPath);

	assert.throws(
		() => makeHtmlRequest('<h1>Hello</h1>', { viewportWidth: 1200 }, {}),
		/Viewport width and viewport height must be set together/,
	);
	assert.throws(
		() => makeUrlRequest('https://example.com', { viewportHeight: 800 }, {}),
		/Viewport width and viewport height must be set together/,
	);
	assert.doesNotThrow(() =>
		makeHtmlRequest(
			'<h1>Hello</h1>',
			{ viewportWidth: 1200, viewportHeight: 800 },
			{},
		),
	);
});

test('request adapters require jumbo max width and height together', () => {
	const require = createRequire(import.meta.url);
	const helpersPath = path.join(root, 'dist/nodes/HtmlCssToImage/helpers.js');
	delete require.cache[helpersPath];
	const { makeHtmlRequest, makeUrlRequest } = require(helpersPath);

	assert.throws(
		() => makeHtmlRequest('<h1>Hello</h1>', { jumboMaxWidth: 4000 }, {}),
		/Jumbo max width and jumbo max height must be set together/,
	);
	assert.throws(
		() => makeUrlRequest('https://example.com', { jumboMaxHeight: 3000 }, {}),
		/Jumbo max width and jumbo max height must be set together/,
	);
	assert.doesNotThrow(() =>
		makeHtmlRequest(
			'<h1>Hello</h1>',
			{ jumboMaxWidth: 4000, jumboMaxHeight: 3000 },
			{},
		),
	);
});

test('request adapters map repeatable Google Font values to a string array', () => {
	const require = createRequire(import.meta.url);
	const helpersPath = path.join(root, 'dist/nodes/HtmlCssToImage/helpers.js');
	delete require.cache[helpersPath];
	const { makeHtmlRequest } = require(helpersPath);

	const request = makeHtmlRequest(
		'<h1>Hello</h1>',
		{
			googleFonts: {
				values: [{ value: 'Roboto' }, { value: ' Open Sans ' }, { value: '' }],
			},
		},
		{},
	);

	assert.deepEqual(request.google_fonts, ['Roboto', 'Open Sans']);
});

test('template values use a typed assignment collection', () => {
	const nodeSource = fs.readFileSync(
		path.join(root, 'nodes/HtmlCssToImage/HtmlCssToImage.node.ts'),
		'utf8',
	);
	assert.match(nodeSource, /name:\s*'templateValues'[\s\S]*?type:\s*'assignmentCollection'/);
	assert.match(nodeSource, /name:\s*'signedTemplateValues'[\s\S]*?type:\s*'assignmentCollection'/);
});

test('template value assignments map to a typed object', () => {
	const require = createRequire(import.meta.url);
	const helpersPath = path.join(root, 'dist/nodes/HtmlCssToImage/helpers.js');
	delete require.cache[helpersPath];
	const { parseTemplateValues } = require(helpersPath);

	assert.deepEqual(
		parseTemplateValues({
			assignments: [
				{ name: 'title', value: 'Hello', type: 'string' },
				{ name: 'count', value: 3, type: 'number' },
				{ name: 'featured', value: true, type: 'boolean' },
				{ name: 'author', value: { name: 'Ada' }, type: 'object' },
			],
		}),
		{
			title: 'Hello',
			count: 3,
			featured: true,
			author: { name: 'Ada' },
		},
	);
	assert.deepEqual(parseTemplateValues({ title: 'From an expression' }), {
		title: 'From an expression',
	});
});

test('PDF dimensions use numeric value and unit controls', () => {
	const nodeSource = fs.readFileSync(
		path.join(root, 'nodes/HtmlCssToImage/HtmlCssToImage.node.ts'),
		'utf8',
	);
	assert.match(nodeSource, /const pdfDimension[\s\S]*?type:\s*'number'/);
	assert.match(nodeSource, /const pdfDimension[\s\S]*?minValue:\s*0/);
	assert.match(nodeSource, /displayName:\s*'Unit'[\s\S]*?value:\s*'px'/);
	assert.match(nodeSource, /displayName:\s*'Unit'[\s\S]*?value:\s*'in'/);
	assert.match(nodeSource, /displayName:\s*'Unit'[\s\S]*?value:\s*'cm'/);
	assert.match(nodeSource, /displayName:\s*'Unit'[\s\S]*?value:\s*'mm'/);
});

test('PDF dimension controls map to validated client values', () => {
	const require = createRequire(import.meta.url);
	const helpersPath = path.join(root, 'dist/nodes/HtmlCssToImage/helpers.js');
	delete require.cache[helpersPath];
	const { buildPdfOptions } = require(helpersPath);

	const pdf = buildPdfOptions({
		pageWidth: { dimension: { value: 8.5, unit: 'in' } },
		pageHeight: { dimension: { value: 297, unit: 'mm' } },
		marginTop: { dimension: { value: 1, unit: 'cm' } },
		marginRight: { dimension: { value: 10, unit: 'px' } },
		marginBottom: { dimension: { value: 2, unit: 'mm' } },
		marginLeft: { dimension: { value: 0.25, unit: 'in' } },
	});

	assert.deepEqual(pdf.page_width, { value: 8.5, unit: 'in' });
	assert.deepEqual(pdf.page_height, { value: 297, unit: 'mm' });
	assert.deepEqual(pdf.margins, {
		top: { value: 1, unit: 'cm' },
		right: { value: 10, unit: 'px' },
		bottom: { value: 2, unit: 'mm' },
		left: { value: 0.25, unit: 'in' },
	});
	assert.throws(
		() =>
			buildPdfOptions({
				pageWidth: { dimension: { value: 8.5, unit: 'pt' } },
			}),
		/PDF dimension units must be px, in, cm, or mm/,
	);
	assert.throws(
		() =>
			buildPdfOptions({
				pageWidth: { dimension: { value: -1, unit: 'in' } },
			}),
		/PDF dimension values cannot be negative/,
	);
	assert.throws(
		() => buildPdfOptions({ pageWidth: '8.5in' }),
		/PDF dimensions must include a numeric value and unit/,
	);
});

test('batch operation is not exposed in the initial node version', () => {
	const nodeSource = fs.readFileSync(
		path.join(root, 'nodes/HtmlCssToImage/HtmlCssToImage.node.ts'),
		'utf8',
	);
	assert.doesNotMatch(nodeSource, /createBatch|batchVariations|batchDefaults/);
});

test('bundled client creates requests without a runtime package dependency', async () => {
	const require = createRequire(import.meta.url);
	const bundlePath = path.join(
		root,
		'dist/nodes/HtmlCssToImage/htmlCssToImageClient.bundle.js',
	);
	delete require.cache[bundlePath];
	const { CreateHtmlCssImageRequest, HtmlCssToImageClient } = require(bundlePath);
	const previousFetch = globalThis.fetch;
	let requestBody;

	globalThis.fetch = async (_url, init) => {
		requestBody = JSON.parse(init.body);
		return {
			ok: true,
			json: async () => ({ id: 'image-id', url: 'https://hcti.io/v1/image/image-id' }),
		};
	};

	try {
		const client = new HtmlCssToImageClient('api-id', 'api-key');
		const result = await client.createImage(
			new CreateHtmlCssImageRequest({
				html: '<h1>Hello</h1>',
				viewport_width: 1200,
			}),
		);
		assert.equal(result.success, true);
		assert.equal(requestBody.html, '<h1>Hello</h1>');
		assert.equal(requestBody.viewport_width, 1200);
		assert.equal(requestBody.__type, undefined);
	} finally {
		globalThis.fetch = previousFetch;
	}
});
