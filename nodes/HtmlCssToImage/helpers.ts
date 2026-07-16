import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	CreateHtmlCssImageRequest,
	CreateUrlImageRequest,
	PDFOptions,
} from './htmlCssToImageClient.bundle.js';
import type { CreateImageResponse, CreateImageSuccessResponse } from './htmlCssToImageClient.bundle.js';
import { apiNameByParameter } from './generatedProperties';

type ClientOptions = Record<string, unknown>;
type PdfUnit = 'px' | 'in' | 'cm' | 'mm';
type PdfValue = { value: number; unit: PdfUnit };

function hasValue(value: unknown): boolean {
	if (value === undefined || value === null || value === '') return false;
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value !== 0;
	return true;
}

function validatePairedDimensions(
	options: Record<string, unknown>,
	widthNames: [string, string],
	heightNames: [string, string],
	message: string,
): void {
	const width = options[widthNames[0]] ?? options[widthNames[1]];
	const height = options[heightNames[0]] ?? options[heightNames[1]];
	const hasWidth = hasValue(width);
	const hasHeight = hasValue(height);

	if (hasWidth !== hasHeight) {
		throw new Error(message);
	}
}

function validateDimensions(options: Record<string, unknown>): void {
	validatePairedDimensions(
		options,
		['viewport_width', 'viewportWidth'],
		['viewport_height', 'viewportHeight'],
		'Viewport width and viewport height must be set together',
	);
	validatePairedDimensions(
		options,
		['jumbo_max_width', 'jumboMaxWidth'],
		['jumbo_max_height', 'jumboMaxHeight'],
		'Jumbo max width and jumbo max height must be set together',
	);
}

function mapStringArray(value: unknown): string[] | undefined {
	if (typeof value === 'string') {
		const values = value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
		return values.length > 0 ? values : undefined;
	}
	if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;

	const entries = (value as { values?: unknown }).values;
	if (!Array.isArray(entries)) return undefined;
	const values = entries
		.map((entry) =>
			entry && typeof entry === 'object' && !Array.isArray(entry)
				? (entry as { value?: unknown }).value
				: undefined,
		)
		.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
		.map((item) => item.trim());
	return values.length > 0 ? values : undefined;
}

export function mapClientOptions(options: IDataObject): ClientOptions {
	validateDimensions(options);
	const mapped: ClientOptions = {};

	for (const [parameterName, value] of Object.entries(options)) {
		if (!hasValue(value)) continue;
		const apiName =
			apiNameByParameter[parameterName as keyof typeof apiNameByParameter] ?? parameterName;
		if (apiName === 'google_fonts') {
			const fonts = mapStringArray(value);
			if (fonts) mapped[apiName] = fonts;
			continue;
		}
		mapped[apiName] = value;
	}

	return mapped;
}

function parsePdfValue(value: unknown): PdfValue | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	if (typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('PDF dimensions must include a numeric value and unit');
	}

	const dimension = (value as { dimension?: unknown }).dimension;
	if (!dimension || typeof dimension !== 'object' || Array.isArray(dimension)) {
		return undefined;
	}
	const numericValue = (dimension as { value?: unknown }).value;
	const unit = (dimension as { unit?: unknown }).unit;
	if (numericValue === undefined || numericValue === null || numericValue === '') {
		return undefined;
	}
	if (typeof numericValue !== 'number') {
		throw new Error('PDF dimension values must be numbers');
	}
	if (numericValue < 0) {
		throw new Error('PDF dimension values cannot be negative');
	}
	if (unit !== 'px' && unit !== 'in' && unit !== 'cm' && unit !== 'mm') {
		throw new Error('PDF dimension units must be px, in, cm, or mm');
	}
	return { value: numericValue, unit };
}

export function buildPdfOptions(options: IDataObject): PDFOptions | undefined {
	if (Object.keys(options).length === 0) return undefined;

	const top = parsePdfValue(options.marginTop);
	const right = parsePdfValue(options.marginRight);
	const bottom = parsePdfValue(options.marginBottom);
	const left = parsePdfValue(options.marginLeft);
	const hasMargins = [top, right, bottom, left].some((value) => value !== undefined);

	if (
		hasMargins &&
		[top, right, bottom, left].some((value) => value === undefined)
	) {
		throw new Error('Set all four PDF margins when using custom margins');
	}

	return new PDFOptions({
		print_background:
			typeof options.printBackground === 'boolean' ? options.printBackground : undefined,
		scale: typeof options.scale === 'number' && options.scale !== 0 ? options.scale : undefined,
		page_width: parsePdfValue(options.pageWidth),
		page_height: parsePdfValue(options.pageHeight),
		margins: hasMargins
			? {
					top: top as PdfValue,
					right: right as PdfValue,
					bottom: bottom as PdfValue,
					left: left as PdfValue,
				}
			: undefined,
	});
}

export function makeHtmlRequest(
	html: string,
	options: IDataObject,
	pdfOptions: IDataObject,
): CreateHtmlCssImageRequest {
	const mapped = mapClientOptions(options);
	return new CreateHtmlCssImageRequest({
		...mapped,
		html,
		pdf_options: buildPdfOptions(pdfOptions),
	});
}

export function makeUrlRequest(
	url: string,
	options: IDataObject,
	pdfOptions: IDataObject,
): CreateUrlImageRequest {
	const mapped = mapClientOptions(options);
	return new CreateUrlImageRequest({
		...mapped,
		url,
		pdf_options: buildPdfOptions(pdfOptions),
	});
}

export function parseTemplateValues(value: unknown): IDataObject {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Template Values must be an object');
	}

	const assignments = (value as { assignments?: unknown }).assignments;
	if (!Array.isArray(assignments)) return value as IDataObject;

	const templateValues: IDataObject = {};
	for (const assignment of assignments) {
		if (!assignment || typeof assignment !== 'object' || Array.isArray(assignment)) continue;
		const { name, value: assignmentValue } = assignment as {
			name?: unknown;
			value?: unknown;
		};
		if (typeof name !== 'string' || name.trim().length === 0) continue;
		templateValues[name.trim()] = assignmentValue as IDataObject[string];
	}
	return templateValues;
}

export function assertSuccess(
	executeFunctions: IExecuteFunctions,
	result: CreateImageResponse,
	itemIndex: number,
): asserts result is CreateImageSuccessResponse {
	if (result.success) return;
	const validation = result.validation_errors
		?.map((error) => `${error.path}: ${error.message}`)
		.join('; ');
	throw new NodeOperationError(executeFunctions.getNode(), result.message ?? result.error, {
		itemIndex,
		description: validation ?? result.error,
	});
}

const formats = {
	png: { extension: 'png', mimeType: 'image/png' },
	jpg: { extension: 'jpg', mimeType: 'image/jpeg' },
	webp: { extension: 'webp', mimeType: 'image/webp' },
	pdf: { extension: 'pdf', mimeType: 'application/pdf' },
} as const;

export async function addBinaryOutput(
	executeFunctions: IExecuteFunctions,
	item: INodeExecutionData,
	image: CreateImageSuccessResponse,
	format: keyof typeof formats,
	binaryPropertyName: string,
): Promise<void> {
	const file = formats[format];
	const response = await fetch(`${image.url}.${file.extension}`);
	if (!response.ok) {
		throw new Error(`Could not download generated ${file.extension.toUpperCase()} file`);
	}

	item.binary = {
		...(item.binary ?? {}),
		[binaryPropertyName]: await executeFunctions.helpers.prepareBinaryData(
			Buffer.from(await response.arrayBuffer()),
			`${image.id}.${file.extension}`,
			file.mimeType,
		),
	};
}
