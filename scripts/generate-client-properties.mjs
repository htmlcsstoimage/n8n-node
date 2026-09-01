import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const clientRoot = path.join(root, 'vendor/html-css-to-image-client/src');
const outputPath = path.join(root, 'nodes/HtmlCssToImage/generatedProperties.ts');
const sourcePaths = [path.join(clientRoot, 'types/request.ts')];

const sourceFiles = sourcePaths.map((sourcePath) => {
	if (!fs.existsSync(sourcePath)) {
		throw new Error(
			`Missing TypeScript client source at ${sourcePath}. Run "git submodule update --init --recursive".`,
		);
	}

	return ts.createSourceFile(
		sourcePath,
		fs.readFileSync(sourcePath, 'utf8'),
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);
});

const aliases = new Map();
const classes = new Map();

for (const sourceFile of sourceFiles) {
	for (const statement of sourceFile.statements) {
		if (ts.isTypeAliasDeclaration(statement)) {
			aliases.set(statement.name.text, statement.type.getText(sourceFile));
		}
		if (ts.isClassDeclaration(statement) && statement.name) {
			classes.set(statement.name.text, { declaration: statement, sourceFile });
		}
	}
}

function getProperties(className) {
	const entry = classes.get(className);
	if (!entry) throw new Error(`Could not find client class ${className}`);

	return entry.declaration.members
		.filter(ts.isPropertyDeclaration)
		.filter((member) => ts.isIdentifier(member.name))
		.filter((member) => member.name.text !== '__type')
		.map((member) => ({
			apiName: member.name.text,
			type: member.type?.getText(entry.sourceFile) ?? 'string',
			required: !member.questionToken && !member.exclamationToken,
			description:
				ts
					.getJSDocCommentsAndTags(member)
					.filter(ts.isJSDoc)
					.map((doc) =>
						typeof doc.comment === 'string'
							? doc.comment
							: (doc.comment ?? []).map((part) => part.text).join(''),
					)
					.join(' ')
					.replace(/\s+/g, ' ')
					.trim() || undefined,
		}));
}

function toCamelCase(value) {
	return value.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
}

const initialisms = new Map([
	['css', 'CSS'],
	['hcti', 'HCTI'],
	['html', 'HTML'],
	['id', 'ID'],
	['jpg', 'JPG'],
	['ms', 'MS'],
	['pdf', 'PDF'],
	['png', 'PNG'],
	['url', 'URL'],
	['webp', 'WebP'],
]);

const displayNameOverrides = new Map([
	['dedupe_duration_s', 'Dedupe Duration (Seconds)'],
	['include_headers_on_subrequests', 'Include Headers on Subrequests'],
]);

function toDisplayName(value) {
	const override = displayNameOverrides.get(value);
	if (override) return override;
	return value
		.split('_')
		.map((part) => initialisms.get(part) ?? `${part[0].toUpperCase()}${part.slice(1)}`)
		.join(' ');
}

function resolveType(type) {
	return aliases.get(type) ?? type;
}

function toN8nProperty(property) {
	const resolvedType = resolveType(property.type);
	const pairedDimensionDescription =
		property.apiName === 'viewport_width' || property.apiName === 'viewport_height'
			? ' Viewport width and viewport height must be set together.'
			: property.apiName === 'jumbo_max_width' || property.apiName === 'jumbo_max_height'
				? ' Jumbo max width and jumbo max height must be set together.'
			: '';
	const base = {
		displayName: toDisplayName(property.apiName),
		name: toCamelCase(property.apiName),
		description: `${property.description ?? ''}${pairedDimensionDescription}`.trim(),
	};

	if (resolvedType === 'boolean') {
		return { ...base, type: 'boolean', default: null };
	}

	if (resolvedType === 'number') {
		const nonNegative = new Set([
			'dedupe_duration_s',
			'jumbo_max_height',
			'jumbo_max_width',
			'viewport_height',
			'viewport_width',
		]);
		return {
			...base,
			type: 'number',
			default: null,
			...(nonNegative.has(property.apiName) ? { typeOptions: { minValue: 0 } } : {}),
		};
	}

	if (resolvedType === 'string[]') {
		return {
			...base,
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Value',
			default: {},
			options: [
				{
					displayName: 'Values',
					name: 'values',
					values: [
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		};
	}

	const stringUnionValues = [...resolvedType.matchAll(/'([^']+)'/g)].map((match) => match[1]);
	if (stringUnionValues.length > 0) {
		return {
			...base,
			type: 'options',
			default: null,
			options: stringUnionValues
				.map((value) => ({
					name: toDisplayName(value),
					value,
				}))
				.sort((left, right) => left.name.localeCompare(right.name)),
		};
	}

	if (resolvedType === 'string') {
		return {
			...base,
			type: 'string',
			default: null,
			...(property.apiName === 'css'
				? {
						typeOptions: {
							editor: 'cssEditor',
						},
					}
				: {}),
		};
	}

	return undefined;
}

const shared = getProperties('BaseCreateImageRequest').filter(
	(property) => property.apiName !== 'pdf_options',
);
const html = getProperties('CreateHtmlCssImageRequest').filter(
	(property) => property.apiName !== 'html',
);
const url = getProperties('CreateUrlImageRequest').filter((property) => property.apiName !== 'url');
const generatedProperties = [...shared, ...html, ...url];

const optionOrder = [
	'css',
	'google_fonts',
	'selector',
	'full_screen',
	'viewport_width',
	'viewport_height',
	'device_scale',
	'format',
	'transparent_background',
	'ms_delay',
	'max_wait_ms',
	'render_when_ready',
	'block_consent_banners',
	'color_scheme',
	'timezone',
	'media_type',
	'viewport_mobile',
	'viewport_touch',
	'viewport_landscape',
	'headers',
	'additional_header_origins',
	'include_headers_on_subrequests',
	'identify_as_hcti',
	'proxy_id',
	'storage_destination_id',
	'dedupe_duration_s',
	'max_render_once',
	'jumbo_max_width',
	'jumbo_max_height',
	'disable_twemoji',
];

const optionOrderIndex = new Map(optionOrder.map((name, index) => [name, index]));

function sortProperties(properties) {
	return properties
		.map((property, index) => ({ property, index }))
		.sort((left, right) => {
			const leftOrder = optionOrderIndex.get(left.property.apiName) ?? Number.MAX_SAFE_INTEGER;
			const rightOrder = optionOrderIndex.get(right.property.apiName) ?? Number.MAX_SAFE_INTEGER;
			return leftOrder - rightOrder || left.index - right.index;
		})
		.map(({ property }) => property);
}

const apiNameByParameter = Object.fromEntries(
	generatedProperties.map((property) => [toCamelCase(property.apiName), property.apiName]),
);

function serializeProperties(properties) {
	return properties.map(toN8nProperty).filter(Boolean);
}

const banner = `/*
 * Generated from vendor/html-css-to-image-client/src/types.
 * Do not edit by hand. Run: npm run generate:client
 */`;

const contents = `${banner}
import type { INodeProperties } from 'n8n-workflow';

export const apiNameByParameter = ${JSON.stringify(apiNameByParameter, null, 2)} as const;

export const htmlClientOptions: INodeProperties[] = ${JSON.stringify(
	serializeProperties(sortProperties([...html, ...shared])),
	null,
	2,
)};

export const urlClientOptions: INodeProperties[] = ${JSON.stringify(
	serializeProperties(sortProperties([...url, ...shared])),
	null,
	2,
)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, contents);
