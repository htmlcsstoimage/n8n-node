import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	CreateHtmlCssImageRequest,
	CreateHtmlCssRecordingRequest,
	CreateUrlImageRequest,
	CreateUrlRecordingRequest,
	PDFOptions,
} from './htmlCssToImageClient.bundle.js';
import type {
	CreateImageErrorResponse,
	CreateImageSuccessResponse,
	CreateRecordingSuccessResponse,
	DeleteImageResponse,
} from './htmlCssToImageClient.bundle.js';
import {
	apiNameByParameter,
	recordingFields,
	recordingComplexFields,
	recordingActionModels,
	recordingTriggerModels,
	scrollTargetModels,
} from './generatedProperties';

type ClientOptions = Record<string, unknown>;
type PdfUnit = 'px' | 'in' | 'cm' | 'mm';
type PdfValue = { value: number; unit: PdfUnit };

function hasValue(value: unknown): boolean {
	if (value === undefined || value === null || value === '') return false;
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
	if (Array.isArray(value)) {
		const values = value
			.filter((entry): entry is string => typeof entry === 'string')
			.map((entry) => entry.trim())
			.filter(Boolean);
		return values.length ? values : undefined;
	}
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

function mapHeaders(value: unknown): Record<string, string> | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;

	const entries = (value as { header?: unknown }).header;
	if (!Array.isArray(entries)) {
		const headers = Object.fromEntries(
			Object.entries(value).filter(
				(entry): entry is [string, string] =>
					entry[0].trim().length > 0 && typeof entry[1] === 'string',
			),
		);
		return Object.keys(headers).length > 0 ? headers : undefined;
	}

	const headers: Record<string, string> = {};
	for (const entry of entries) {
		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
		const name = (entry as { name?: unknown }).name;
		const headerValue = (entry as { value?: unknown }).value;
		if (typeof name !== 'string' || name.trim().length === 0) continue;
		if (typeof headerValue !== 'string') continue;
		headers[name.trim()] = headerValue;
	}
	return Object.keys(headers).length > 0 ? headers : undefined;
}

function mapRequestOverrides(value: unknown): unknown[] | undefined {
	if (!value || typeof value !== 'object') return undefined;

	const entries = Array.isArray(value) ? value : (value as { rule?: unknown }).rule;
	if (!Array.isArray(entries) || entries.length === 0) return undefined;

	return entries.map((entry) => {
		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
			return entry;
		}

		const rule = entry as Record<string, unknown>;
		const rawResourceTypes = rule.resourceTypes ?? rule.resource_types;
		const hasResourceTypes = Array.isArray(rawResourceTypes)
			? rawResourceTypes.length > 0
			: rawResourceTypes !== undefined;

		return {
			action: 'block',
			...(rule.url !== undefined && rule.url !== '' ? { url: rule.url } : {}),
			...(hasResourceTypes ? { resource_types: rawResourceTypes } : {}),
		};
	});
}

export function mapClientOptions(options: IDataObject): ClientOptions {
	validateDimensions(options);
	const mapped: ClientOptions = {};

	for (const [parameterName, value] of Object.entries(options)) {
		if (!hasValue(value)) continue;
		const apiName =
			apiNameByParameter[parameterName as keyof typeof apiNameByParameter] ?? parameterName;
		if (apiName === 'google_fonts' || apiName === 'additional_header_origins') {
			const values = mapStringArray(value);
			if (values) mapped[apiName] = values;
			continue;
		}
		if (apiName === 'headers') {
			const headers = mapHeaders(value);
			if (headers) mapped[apiName] = headers;
			continue;
		}
		if (apiName === 'request_overrides') {
			const requestOverrides = mapRequestOverrides(value);
			if (requestOverrides) mapped[apiName] = requestOverrides;
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

	if (hasMargins && [top, right, bottom, left].some((value) => value === undefined)) {
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
	requestOverrides?: unknown,
): CreateHtmlCssImageRequest {
	const mapped = mapClientOptions(options);
	const mappedRequestOverrides = mapRequestOverrides(requestOverrides);
	if (mappedRequestOverrides) mapped.request_overrides = mappedRequestOverrides;
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
	requestOverrides?: unknown,
): CreateUrlImageRequest {
	const mapped = mapClientOptions(options);
	const mappedRequestOverrides = mapRequestOverrides(requestOverrides);
	if (mappedRequestOverrides) mapped.request_overrides = mappedRequestOverrides;
	return new CreateUrlImageRequest({
		...mapped,
		url,
		pdf_options: buildPdfOptions(pdfOptions),
	});
}

function asObject(value: unknown): IDataObject {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Recording settings must be an object');
	}
	return value as IDataObject;
}

function mapRecordingModel(value: unknown, model: string): ClientOptions {
	const object = asObject(value);
	const scalarFields: IDataObject = {};
	for (const field of recordingFields[model]) {
		const apiName = apiNameByParameter[field.name as keyof typeof apiNameByParameter] ?? field.name;
		scalarFields[field.name] = object[field.name] ?? object[apiName];
	}
	const mapped = mapClientOptions(scalarFields);
	for (const apiName of recordingComplexFields[model]) {
		const parameterName = apiName.replace(/_([a-z])/g, (_, character: string) =>
			character.toUpperCase(),
		);
		const nested = object[parameterName] ?? object[apiName];
		if (nested === undefined || nested === null) continue;
		if (apiName === 'to') {
			const target = asObject(nested);
			mapped.to = mapRecordingVariant(target.target ?? target, scrollTargetModels);
		} else if (apiName === 'steps') {
			const steps = Array.isArray(nested) ? nested : asObject(nested).step;
			if (Array.isArray(steps))
				mapped.steps = steps.map((step) => mapRecordingModel(step, 'ScrollStep'));
		} else {
			const actions = mapRecordingActions(nested);
			if (actions !== undefined) mapped[apiName] = actions;
		}
	}
	if (
		typeof mapped.scroll_distance === 'string' &&
		/^-?\d+(?:\.\d+)?$/.test(mapped.scroll_distance)
	) {
		mapped.scroll_distance = Number(mapped.scroll_distance);
	}
	if (
		object.type === 'execute_javascript' &&
		object.ignoreScriptErrors === true &&
		mapped.if_error === undefined
	) {
		mapped.if_error = [];
	}
	return mapped;
}

function mapRecordingVariant(value: unknown, models: Record<string, string>): ClientOptions {
	const object = asObject(value);
	const model = typeof object.type === 'string' ? models[object.type] : undefined;
	if (!model) throw new Error('Select a recording action, trigger, or scroll target type');
	return mapRecordingModel(object, model);
}

export function mapRecordingActions(value: unknown): ClientOptions[] | undefined {
	if (value === undefined || value === null) return undefined;
	const entries = Array.isArray(value) ? value : asObject(value).action;
	if (entries === undefined) return undefined;
	if (!Array.isArray(entries)) throw new Error('Recording actions must be an array');
	// An empty native editor means no override. An explicit API [] can opt out of script errors.
	if (!Array.isArray(value) && entries.length === 0) return undefined;
	return entries.map((entry) => mapRecordingVariant(entry, recordingActionModels));
}

export function makeRecordingRequest(
	type: 'html' | 'url',
	source: string,
	duration: number,
	options: IDataObject,
	output: IDataObject,
	trigger: IDataObject,
	actions: unknown,
	requestOverrides?: unknown,
): CreateHtmlCssRecordingRequest | CreateUrlRecordingRequest {
	const mapped = mapClientOptions(options);
	const mappedOutput = mapRecordingModel(output, 'RecordingOutputOptions');
	const mappedTrigger = trigger.trigger ?? (trigger.type ? trigger : undefined);
	const mappedActions = mapRecordingActions(actions);
	const overrides = mapRequestOverrides(requestOverrides);
	const request = {
		...mapped,
		duration_ms: duration,
		...(Object.keys(mappedOutput).length ? { output: mappedOutput } : {}),
		...(mappedTrigger
			? { trigger: mapRecordingVariant(mappedTrigger, recordingTriggerModels) }
			: {}),
		...(mappedActions !== undefined ? { actions: mappedActions } : {}),
		...(overrides ? { request_overrides: overrides } : {}),
	};
	return type === 'html'
		? new CreateHtmlCssRecordingRequest({ ...request, html: source })
		: new CreateUrlRecordingRequest({ ...request, url: source });
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

export function assertSuccess<T extends { success: true }>(
	executeFunctions: IExecuteFunctions,
	result: T | CreateImageErrorResponse,
	itemIndex: number,
): asserts result is T {
	if (result.success) return;
	const validation = result.validation_errors
		?.map((error) => `${error.path}: ${error.message}`)
		.join('; ');
	throw new NodeOperationError(executeFunctions.getNode(), result.message ?? result.error, {
		itemIndex,
		description: validation ?? result.error,
	});
}

export function assertDeleteSuccess(
	executeFunctions: IExecuteFunctions,
	result: DeleteImageResponse,
	itemIndex: number,
): asserts result is { success: true } {
	assertSuccess(executeFunctions, result, itemIndex);
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
	const imageUrl = image.url.replace(/\.(?:png|jpe?g|webp|pdf)$/i, '');
	const response = await fetch(`${imageUrl}.${file.extension}`);
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

export async function addRecordingBinaryOutput(
	executeFunctions: IExecuteFunctions,
	item: INodeExecutionData,
	recording: CreateRecordingSuccessResponse,
	binaryPropertyName: string,
): Promise<void> {
	const mediaTypes: Record<string, string> = {
		mp4: 'video/mp4',
		webm: 'video/webm',
		gif: 'image/gif',
	};
	const extension = new URL(recording.recording_url).pathname.split('.').pop() ?? '';
	const mimeType = mediaTypes[extension];
	if (!mimeType) throw new Error('Recording URL must identify an MP4, WebM, or GIF file');
	const response = await fetch(recording.recording_url);
	if (!response.ok) throw new Error(`Could not download generated ${extension.toUpperCase()} file`);
	item.binary = {
		...(item.binary ?? {}),
		[binaryPropertyName]: await executeFunctions.helpers.prepareBinaryData(
			Buffer.from(await response.arrayBuffer()),
			`${recording.id}.${extension}`,
			mimeType,
		),
	};
}
