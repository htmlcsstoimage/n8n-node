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
	['html', 'HTML'],
	['id', 'ID'],
	['ms', 'MS'],
	['pdf', 'PDF'],
	['url', 'URL'],
]);

function toDisplayName(value) {
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
		return { ...base, type: 'number', default: null };
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
	serializeProperties([...html, ...shared]),
	null,
	2,
)};

export const urlClientOptions: INodeProperties[] = ${JSON.stringify(
	serializeProperties([...url, ...shared]),
	null,
	2,
)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, contents);
