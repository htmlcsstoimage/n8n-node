import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { HtmlCssToImage } = require('../dist/nodes/HtmlCssToImage/HtmlCssToImage.node.js');
const {
	makeRecordingRequest,
	mapRecordingActions,
} = require('../dist/nodes/HtmlCssToImage/helpers.js');
const generated = require('../dist/nodes/HtmlCssToImage/generatedProperties.js');
const { NodeHelpers } = require('n8n-workflow');
const node = new HtmlCssToImage();
const nodeData = {
	name: 'HTML/CSS to Image API',
	type: 'htmlCssToImage',
	typeVersion: 1,
	position: [0, 0],
	parameters: {},
};

function resolve(parameters) {
	return NodeHelpers.getNodeParameters(
		node.description.properties,
		parameters,
		true,
		false,
		nodeData,
		node.description,
	);
}

function jsonResponse(value, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

async function execute(parameters, transport, continueOnFail = false) {
	const previousFetch = globalThis.fetch;
	globalThis.fetch = transport;
	try {
		return await node.execute.call({
			getInputData: () => parameters.map((_, index) => ({ json: { input: index } })),
			getCredentials: async () => ({ apiId: 'api-id', apiKey: 'api-key' }),
			getNodeParameter: (name, index, fallback) => parameters[index][name] ?? fallback,
			getNode: () => nodeData,
			continueOnFail: () => continueOnFail,
			helpers: {
				prepareBinaryData: async (buffer, fileName, mimeType) => ({
					data: buffer.toString('base64'),
					fileName,
					mimeType,
				}),
			},
		});
	} finally {
		globalThis.fetch = previousFetch;
	}
}

const created = {
	success: true,
	id: 'recording-id',
	status_url: 'https://hcti.io/v1/recordings/recording-id/status',
	recording_url: 'https://hcti.io/v1/recording/recording-id.mp4',
};

test('recording resource is additive and existing image workflows resolve the same defaults', () => {
	assert.equal(node.description.version, 1);
	assert.deepEqual(
		resolve({ resource: 'image', operation: 'createUrl', url: 'https://example.com' }),
		{
			resource: 'image',
			operation: 'createUrl',
			url: 'https://example.com',
			options: {},
			pdfOptions: {},
			requestOverrides: {},
			output: 'metadata',
		},
	);
	const recording = resolve({
		resource: 'recording',
		operation: 'createUrlRecording',
		recordingUrl: 'https://example.com',
		durationMs: 5000,
	});
	assert.equal(recording.output, 'metadata');
	assert.equal(recording.durationMs, 5000);
	assert.equal(recording.pdfOptions, undefined);
	assert.equal(recording.format, undefined);
	assert.equal(
		node.description.properties.find((property) => property.name === 'durationMs').required,
		true,
	);
	const operations = node.description.properties
		.filter((property) => property.name === 'operation')
		.flatMap((property) => property.options.map((option) => option.value));
	assert.deepEqual(operations, [
		'createHtml',
		'createTemplate',
		'createUrl',
		'deleteImage',
		'generateSignedUrl',
		'createHtmlRecording',
		'createUrlRecording',
		'deleteRecording',
		'fetchRecordingStatus',
	]);
});

test('nullable recording scalar fields stay synchronized with client classes', () => {
	const source = ts.createSourceFile(
		'request.ts',
		fs.readFileSync(
			path.join(import.meta.dirname, '../vendor/html-css-to-image-client/src/types/request.ts'),
			'utf8',
		),
		ts.ScriptTarget.Latest,
		true,
	);
	for (const [className, options, excluded] of [
		['BaseCreateRecordingRequest', generated.htmlRecordingClientOptions, ['duration_ms']],
		['CreateHtmlCssRecordingRequest', generated.htmlRecordingClientOptions, ['html']],
		['CreateUrlRecordingRequest', generated.urlRecordingClientOptions, ['url']],
	]) {
		const model = source.statements.find(
			(statement) => ts.isClassDeclaration(statement) && statement.name?.text === className,
		);
		for (const member of model.members.filter(ts.isPropertyDeclaration)) {
			const name = member.name.getText(source);
			if (excluded.includes(name) || name === '__type') continue;
			const type = member.type.getText(source).replace(/\s*\|\s*null/g, '');
			if (
				!['string', 'number', 'boolean', 'string[]'].includes(type) &&
				!['ColorSchemeType', 'MediaType', 'RecordingDurationMode'].includes(type)
			)
				continue;
			const field = options.find((option) => generated.apiNameByParameter[option.name] === name);
			assert.ok(field, `Missing recording field ${className}.${name}`);
			assert.deepEqual(field.default, type === 'string[]' ? {} : null);
		}
	}
	assert.equal(
		generated.htmlRecordingClientOptions.find((field) => field.name === 'css').typeOptions.editor,
		'cssEditor',
	);
	assert.deepEqual(
		generated.recordingFields.RecordingOutputOptions.find((field) => field.name === 'format')
			.options.map((option) => option.value)
			.sort(),
		['gif', 'mp4', 'webm'],
	);
});

test('shared action field names keep each action type\'s own description', () => {
	const actions = node.description.properties.find((property) => property.name === 'recordingActions');
	const values = actions.options[0].values;
	for (const [model, name] of [
		['RecordingLocateSelectorAction', 'selector'],
		['RecordingClickAction', 'selector'],
		['RecordingLocateSelectorAction', 'timeoutMs'],
		['RecordingClickAction', 'timeoutMs'],
		['RecordingExecuteJavaScriptAction', 'timeoutMs'],
	]) {
		const type = Object.keys(generated.recordingActionModels).find(
			(key) => generated.recordingActionModels[key] === model,
		);
		const expected = generated.recordingFields[model].find((field) => field.name === name);
		const shown = values.filter(
			(field) => field.name === name && field.displayOptions.show.type.includes(type),
		);
		assert.equal(shown.length, 1, `${type}.${name} should be shown exactly once`);
		assert.equal(shown[0].description, expected.description);
	}
});

test('native editors map nested branches, timed scroll steps and zero/false values to API types', () => {
	const parameters = resolve({
		resource: 'recording',
		operation: 'createHtmlRecording',
		recordingHtml: '<p>Hello</p>',
		durationMs: 5000,
		recordingOptions: {
			css: 'p { color: red; }',
			viewportWidth: 800,
			viewportHeight: 600,
			deviceScale: 1.5,
			googleFonts: { values: [{ value: 'Roboto' }] },
			deferRender: false,
			dedupeDurationS: 0,
			skipScrollPreload: false,
			durationMode: 'fixed',
		},
		recordingMediaOptions: { format: 'gif', fps: 15, scale: 0.5 },
		recordingTrigger: { trigger: { type: 'element_visible', selector: '.ready', timeoutMs: 1000 } },
		recordingActions: {
			action: [
				{
					type: 'locate_selector',
					selector: '.start',
					timeoutMs: 0,
					ifFound: {
						action: [
							{
								type: 'click',
								selector: '.start',
								delayMs: 0,
								offsetX: 0,
								offsetY: -10,
								ifNotFound: { action: [{ type: 'error' }] },
							},
						],
					},
				},
				{
					type: 'scroll',
					containerSelector: '.panel',
					steps: {
						step: [
							{
								durationMs: 1500,
								easing: 'linear',
								to: {
									target: {
										type: 'selector',
										selector: '#end',
										offsetY: 0,
										ifNotFound: { action: [{ type: 'stall', durationMs: 200 }] },
									},
								},
							},
						],
					},
				},
				{ type: 'simple_scroll', scrollDistance: '900', msBetweenScrolls: 0 },
				{
					type: 'execute_javascript',
					script: 'await window.animate();',
					timeoutMs: 0,
					ignoreScriptErrors: true,
				},
			],
		},
		requestOverrides: { rule: [{ url: '*://analytics.example.com/*', resourceTypes: ['script'] }] },
	});
	const request = makeRecordingRequest(
		'html',
		parameters.recordingHtml,
		parameters.durationMs,
		parameters.recordingOptions,
		parameters.recordingMediaOptions,
		parameters.recordingTrigger,
		parameters.recordingActions,
		parameters.requestOverrides,
	);
	assert.equal(request.__type, 'html_css');
	assert.equal(request.html, '<p>Hello</p>');
	assert.equal(request.duration_ms, 5000);
	assert.equal(request.device_scale, 1.5);
	assert.deepEqual(request.google_fonts, ['Roboto']);
	assert.equal(request.defer_render, false);
	assert.equal(request.dedupe_duration_s, 0);
	assert.equal(request.skip_scroll_preload, false);
	assert.equal(request.duration_mode, 'fixed');
	assert.deepEqual(request.output, { format: 'gif', fps: 15, scale: 0.5 });
	assert.deepEqual(request.trigger, {
		type: 'element_visible',
		selector: '.ready',
		timeout_ms: 1000,
	});
	assert.deepEqual(request.actions, [
		{
			type: 'locate_selector',
			selector: '.start',
			timeout_ms: 0,
			if_found: [
				{
					type: 'click',
					selector: '.start',
					delay_ms: 0,
					offset_x: 0,
					offset_y: -10,
					if_not_found: [{ type: 'error' }],
				},
			],
		},
		{
			type: 'scroll',
			container_selector: '.panel',
			steps: [
				{
					duration_ms: 1500,
					easing: 'linear',
					to: {
						type: 'selector',
						selector: '#end',
						offset_y: 0,
						if_not_found: [{ type: 'stall', duration_ms: 200 }],
					},
				},
			],
		},
		{ type: 'simple_scroll', scroll_distance: 900, ms_between_scrolls: 0 },
		{ type: 'execute_javascript', script: 'await window.animate();', timeout_ms: 0, if_error: [] },
	]);
	assert.deepEqual(request.request_overrides, [
		{ action: 'block', url: '*://analytics.example.com/*', resource_types: ['script'] },
	]);
});

test('script error semantics survive empty native editors and explicit expression arrays', () => {
	for (const ifError of [undefined, {}, { action: [] }]) {
		assert.deepEqual(
			mapRecordingActions({
				action: [{ type: 'execute_javascript', script: 'throw 1;', ifError }],
			}),
			[{ type: 'execute_javascript', script: 'throw 1;' }],
		);
	}
	assert.deepEqual(
		mapRecordingActions([{ type: 'execute_javascript', script: 'throw 1;', if_error: [] }]),
		[{ type: 'execute_javascript', script: 'throw 1;', if_error: [] }],
	);
	const action = {
		type: 'locate_selector',
		selector: '.x',
		if_found: [{ type: 'stall', duration_ms: 0 }],
	};
	for (let depth = 0; depth < 5; depth++)
		action.if_found = [{ ...action, if_found: action.if_found }];
	assert.deepEqual(mapRecordingActions([action]), [action]);
	assert.deepEqual(
		mapRecordingActions([
			{
				type: 'scroll',
				steps: [
					{ duration_ms: 1, to: { type: 'position', position: 'bottom' } },
					{ duration_ms: 2, to: { type: 'coordinates', x: 0, y: 500 } },
				],
			},
		]),
		[
			{
				type: 'scroll',
				steps: [
					{ duration_ms: 1, to: { type: 'position', position: 'bottom' } },
					{ duration_ms: 2, to: { type: 'coordinates', x: 0, y: 500 } },
				],
			},
		],
	);
});

test('creation uses the bundled client and returns per-item metadata without downloading media', async () => {
	const calls = [];
	const parameters = [
		{ operation: 'createHtmlRecording', recordingHtml: '<p>Hello</p>', durationMs: 5000 },
		{
			operation: 'createUrlRecording',
			recordingUrl: 'https://example.com',
			durationMs: 6000,
			recordingOptions: {
				headers: { header: [{ name: 'Authorization', value: 'Bearer test' }] },
				additionalHeaderOrigins: { values: [{ value: 'https://assets.example.com' }] },
				includeHeadersOnSubrequests: false,
			},
		},
	];
	const [items] = await execute(parameters, async (url, init) => {
		calls.push({ url, init, body: JSON.parse(init.body) });
		return jsonResponse({ ...created, id: `recording-${calls.length}` });
	});
	assert.equal(calls.length, 2);
	for (const call of calls) {
		assert.equal(call.url, 'https://hcti.io/v1/recording');
		assert.equal(call.init.method, 'POST');
		assert.equal(
			call.init.headers.Authorization,
			`Basic ${Buffer.from('api-id:api-key').toString('base64')}`,
		);
		assert.equal(call.body.__type, undefined);
		assert.equal(call.body.output, undefined);
		assert.equal(call.body.trigger, undefined);
		assert.equal(call.body.actions, undefined);
	}
	assert.equal(calls[0].body.html, '<p>Hello</p>');
	assert.equal(calls[0].body.duration_ms, 5000);
	assert.equal(calls[1].body.url, 'https://example.com');
	assert.equal(calls[1].body.duration_ms, 6000);
	assert.deepEqual(calls[1].body.headers, { Authorization: 'Bearer test' });
	assert.deepEqual(calls[1].body.additional_header_origins, ['https://assets.example.com']);
	assert.equal(calls[1].body.include_headers_on_subrequests, false);
	assert.deepEqual(
		items.map((item) => item.pairedItem),
		[{ item: 0 }, { item: 1 }],
	);
	assert.deepEqual(
		items.map((item) => item.json.id),
		['recording-1', 'recording-2'],
	);
	assert.ok(items.every((item) => !item.binary));
});

test('status fetches once for each ID, accepts HTTP 200/202 and preserves lifecycle errors', async () => {
	const states = [
		'processing',
		'pending_retry',
		'ready',
		'failed',
		'cancelled',
		'awaiting_render',
		'future_status',
	];
	let calls = 0;
	const [items] = await execute(
		states.map((status, i) => ({ operation: 'fetchRecordingStatus', recordingId: `id-${i}` })),
		async (url, init) => {
			const index = calls++;
			assert.equal(url, `https://hcti.io/v1/recordings/id-${index}/status`);
			assert.equal(init.method, 'GET');
			return jsonResponse(
				{
					success: true,
					id: `id-${index}`,
					recording_url: created.recording_url,
					status: states[index],
					status_entered_at: '2026-11-17T12:00:00Z',
					attempt_count: 2,
					stored_duration_ms: null,
					error: {
						code: 'action_failed',
						message: 'Missing element',
						occurred_at: '2026-11-17T12:00:00Z',
						retryable: true,
						action_path: 'actions[0]',
					},
				},
				index % 2 ? 200 : 202,
			);
		},
	);
	assert.equal(calls, states.length);
	assert.deepEqual(
		items.map((item) => item.json.status),
		[...states.slice(0, -1), 'unknown'],
	);
	assert.equal(items[3].json.error.action_path, 'actions[0]');
	assert.equal(items[3].json.attempt_count, 2);
	assert.equal(items[3].json.stored_duration_ms, null);
});

test('deletion handles empty successful responses and processes multiple input IDs', async () => {
	const calls = [];
	const [items] = await execute(
		['first', 'second'].map((recordingId) => ({ operation: 'deleteRecording', recordingId })),
		async (url, init) => {
			calls.push({ url, method: init.method });
			return new Response(null, { status: 204 });
		},
	);
	assert.deepEqual(calls, [
		{ url: 'https://hcti.io/v1/recordings/first', method: 'DELETE' },
		{ url: 'https://hcti.io/v1/recordings/second', method: 'DELETE' },
	]);
	assert.deepEqual(items, [
		{ json: { success: true }, pairedItem: { item: 0 } },
		{ json: { success: true }, pairedItem: { item: 1 } },
	]);
});

test('API failures and transport errors respect continueOnFail and item pairing', async () => {
	for (const operation of ['createHtmlRecording', 'fetchRecordingStatus', 'deleteRecording']) {
		const parameters = {
			operation,
			recordingId: 'id',
			recordingHtml: '<p>Hello</p>',
			durationMs: 5000,
		};
		const failure = () =>
			jsonResponse(
				{
					success: false,
					error: 'invalid_request',
					message: 'Invalid duration',
					validation_errors: [{ path: 'duration_ms', message: 'Too short' }],
				},
				400,
			);
		await assert.rejects(execute([parameters], failure), /Invalid duration/);
		const [items] = await execute([parameters, parameters], failure, true);
		assert.deepEqual(
			items.map((item) => item.pairedItem),
			[{ item: 0 }, { item: 1 }],
		);
		assert.ok(items.every((item) => item.json.error.includes('Invalid duration')));
		assert.deepEqual(
			items.map((item) => item.json.input),
			[0, 1],
		);
	}
	const [items] = await execute(
		[{ operation: 'fetchRecordingStatus', recordingId: 'id' }],
		() => {
			throw new Error('Connection failed');
		},
		true,
	);
	assert.match(items[0].json.error, /Connection failed/);
});

test('binary creation downloads the exact media URL with the correct format, MIME and output mode', async () => {
	for (const [format, mimeType, output] of [
		['mp4', 'video/mp4', 'both'],
		['webm', 'video/webm', 'binary'],
		['gif', 'image/gif', 'both'],
	]) {
		const url = `https://hcti.io/v1/recording/recording-id.${format}?download=1`;
		let calls = 0;
		const [items] = await execute(
			[
				{
					operation: 'createUrlRecording',
					recordingUrl: 'https://example.com',
					durationMs: 5000,
					recordingMediaOptions: { format },
					output,
					binaryPropertyName: 'video',
				},
			],
			async (requestUrl, init) => {
				calls++;
				if (init) {
					assert.deepEqual(JSON.parse(init.body).output, { format });
					return jsonResponse({ ...created, recording_url: url });
				}
				assert.equal(requestUrl, url);
				return new Response('media');
			},
		);
		assert.equal(calls, 2);
		assert.deepEqual(items[0].json, output === 'binary' ? {} : { ...created, recording_url: url });
		assert.deepEqual(items[0].binary.video, {
			data: Buffer.from('media').toString('base64'),
			fileName: `recording-id.${format}`,
			mimeType,
		});
	}
	const [items] = await execute(
		[
			{
				operation: 'createHtmlRecording',
				recordingHtml: '<p>Hello</p>',
				durationMs: 5000,
				output: 'binary',
			},
		],
		async (_url, init) => (init ? jsonResponse(created) : new Response('Failed', { status: 500 })),
		true,
	);
	assert.match(items[0].json.error, /Could not download generated MP4 file/);
});
