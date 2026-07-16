import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	HtmlCssToImageClient,
	type CreateTemplatedImageRequest,
} from './htmlCssToImageClient.bundle.js';
import { htmlClientOptions, urlClientOptions } from './generatedProperties';
import {
	addBinaryOutput,
	assertSuccess,
	makeHtmlRequest,
	makeUrlRequest,
	parseTemplateValues,
} from './helpers';

const pdfDimension = (displayName: string, name: string, description: string) => ({
	displayName,
	name,
	type: 'fixedCollection' as const,
	typeOptions: {
		fixedCollection: {
			layout: 'inline' as const,
		},
	},
	default: {},
	description,
	options: [
		{
			displayName,
			name: 'dimension',
			values: [
				{
					displayName: 'Value',
					name: 'value',
					type: 'number' as const,
					default: null,
					typeOptions: {
						minValue: 0,
					},
				},
				{
					displayName: 'Unit',
					name: 'unit',
					type: 'options' as const,
					options: [
						{ name: 'Pixels', value: 'px' },
						{ name: 'Inches', value: 'in' },
						{ name: 'Centimeters', value: 'cm' },
						{ name: 'Millimeters', value: 'mm' },
					],
					default: 'px',
				},
			],
		},
	],
});

const pdfOptions = [
	{
		displayName: 'Print Background',
		name: 'printBackground',
		type: 'boolean' as const,
		default: null,
		description: 'Whether to include background graphics in the PDF',
	},
	{
		displayName: 'Scale',
		name: 'scale',
		type: 'number' as const,
		default: null,
		typeOptions: { minValue: 0.1, maxValue: 2, numberPrecision: 2 },
	},
	pdfDimension('Page Width', 'pageWidth', 'Width of the PDF page'),
	pdfDimension('Page Height', 'pageHeight', 'Height of the PDF page'),
	...['Top', 'Right', 'Bottom', 'Left'].map((side) =>
		pdfDimension(
			`Margin ${side}`,
			`margin${side}`,
			'Set all four margins when using custom PDF margins',
		),
	),
];

const outputProperties = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options' as const,
		options: [
			{ name: 'URL and Metadata', value: 'metadata' },
			{ name: 'Binary File', value: 'binary' },
			{ name: 'URL, Metadata, and Binary File', value: 'both' },
		],
		default: 'metadata',
	},
	{
		displayName: 'File Format',
		name: 'format',
		type: 'options' as const,
		displayOptions: {
			show: {
				output: ['binary', 'both'],
			},
		},
		options: [
			{ name: 'PNG', value: 'png' },
			{ name: 'JPG', value: 'jpg' },
			{ name: 'WebP', value: 'webp' },
			{ name: 'PDF', value: 'pdf' },
		],
		default: 'png',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string' as const,
		displayOptions: {
			show: {
				output: ['binary', 'both'],
			},
		},
		default: 'data',
		description: 'Name of the binary property that receives the generated file',
	},
];

export class HtmlCssToImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML/CSS to Image API',
		name: 'htmlCssToImage',
		icon: {
			light: 'file:htmlCssToImage.svg',
			dark: 'file:htmlCssToImage.dark.svg',
		},
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate images, screenshots, PDFs, and signed URLs',
		defaults: {
			name: 'HTML/CSS to Image API',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'htmlCssToImageApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Image', value: 'image' }],
				default: 'image',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create From HTML/CSS',
						value: 'createHtml',
						action: 'Create an image from HTML and CSS',
						description: 'Render HTML and CSS as an image or PDF',
					},
					{
						name: 'Create From Template',
						value: 'createTemplate',
						action: 'Create an image from a template',
						description: 'Render a saved template with dynamic values',
					},
					{
						name: 'Create From URL',
						value: 'createUrl',
						action: 'Create an image from a URL',
						description: 'Take a screenshot of a webpage',
					},
					{
						name: 'Generate Signed URL',
						value: 'generateSignedUrl',
						action: 'Generate a signed image URL',
						description: 'Create a render-on-demand URL without making an API request',
					},
				],
				default: 'createHtml',
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				typeOptions: {
					editor: 'htmlEditor',
				},
				displayOptions: { show: { operation: ['createHtml'] } },
				default: '',
				required: true,
				description: 'HTML content to render',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: { show: { operation: ['createUrl'] } },
				default: '',
				required: true,
				placeholder: 'https://example.com',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				displayOptions: { show: { operation: ['createTemplate'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Template Values',
				name: 'templateValues',
				type: 'assignmentCollection',
				typeOptions: {
					assignment: {
						defaultType: 'string',
					},
				},
				displayOptions: { show: { operation: ['createTemplate'] } },
				default: {
					assignments: [],
				},
				description: 'Add the named values used by the template',
			},
			{
				displayName: 'Template Version',
				name: 'templateVersion',
				type: 'number',
				displayOptions: { show: { operation: ['createTemplate'] } },
				default: null,
				description: 'Specific template version to render; leave empty for the latest',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: { show: { operation: ['createHtml'] } },
				default: {},
				options: htmlClientOptions,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: { show: { operation: ['createUrl'] } },
				default: {},
				options: urlClientOptions,
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'collection',
				placeholder: 'Add PDF Option',
				displayOptions: { show: { operation: ['createHtml', 'createUrl'] } },
				default: {},
				options: pdfOptions,
			},
			{
				displayName: 'Signed URL Type',
				name: 'signedUrlType',
				type: 'options',
				displayOptions: { show: { operation: ['generateSignedUrl'] } },
				options: [
					{ name: 'Template', value: 'template' },
					{ name: 'Webpage URL', value: 'url' },
				],
				default: 'template',
			},
			{
				displayName: 'Template ID',
				name: 'signedTemplateId',
				type: 'string',
				displayOptions: {
					show: { operation: ['generateSignedUrl'], signedUrlType: ['template'] },
				},
				default: '',
				required: true,
			},
			{
				displayName: 'Template Values',
				name: 'signedTemplateValues',
				type: 'assignmentCollection',
				typeOptions: {
					assignment: {
						defaultType: 'string',
					},
				},
				displayOptions: {
					show: { operation: ['generateSignedUrl'], signedUrlType: ['template'] },
				},
				default: {
					assignments: [],
				},
			},
			{
				displayName: 'Template Version',
				name: 'signedTemplateVersion',
				type: 'number',
				displayOptions: {
					show: { operation: ['generateSignedUrl'], signedUrlType: ['template'] },
				},
				default: null,
			},
			{
				displayName: 'URL',
				name: 'signedUrl',
				type: 'string',
				displayOptions: {
					show: { operation: ['generateSignedUrl'], signedUrlType: ['url'] },
				},
				default: '',
				required: true,
				placeholder: 'https://example.com',
			},
			{
				displayName: 'Options',
				name: 'signedUrlOptions',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: { operation: ['generateSignedUrl'], signedUrlType: ['url'] },
				},
				default: {},
				options: urlClientOptions,
			},
			...outputProperties.map((property) => ({
				...property,
				displayOptions: {
					show: {
						operation: ['createHtml', 'createUrl', 'createTemplate'],
						...(property.displayOptions?.show ?? {}),
					},
				},
			})),
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('htmlCssToImageApi');
		const client = new HtmlCssToImageClient(
			credentials.apiId as string,
			credentials.apiKey as string,
		);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (operation === 'generateSignedUrl') {
					const type = this.getNodeParameter('signedUrlType', itemIndex) as 'template' | 'url';
					const signedUrl =
						type === 'template'
							? client.generateTemplatedImageUrl(
									this.getNodeParameter('signedTemplateId', itemIndex) as string,
									parseTemplateValues(
										this.getNodeParameter('signedTemplateValues', itemIndex),
									),
									(this.getNodeParameter('signedTemplateVersion', itemIndex, 0) as number) ||
										undefined,
								)
							: client.generateCreateAndRenderUrl(
									makeUrlRequest(
										this.getNodeParameter('signedUrl', itemIndex) as string,
										this.getNodeParameter('signedUrlOptions', itemIndex, {}) as IDataObject,
										{},
									),
								);
					returnData.push({ json: { url: signedUrl }, pairedItem: { item: itemIndex } });
					continue;
				}

				let result;
				if (operation === 'createHtml') {
					result = await client.createImage(
						makeHtmlRequest(
							this.getNodeParameter('html', itemIndex) as string,
							this.getNodeParameter('options', itemIndex, {}) as IDataObject,
							this.getNodeParameter('pdfOptions', itemIndex, {}) as IDataObject,
						),
					);
				} else if (operation === 'createUrl') {
					result = await client.createImage(
						makeUrlRequest(
							this.getNodeParameter('url', itemIndex) as string,
							this.getNodeParameter('options', itemIndex, {}) as IDataObject,
							this.getNodeParameter('pdfOptions', itemIndex, {}) as IDataObject,
						),
					);
				} else {
					const request = {
						template_id: this.getNodeParameter('templateId', itemIndex) as string,
						template_values: parseTemplateValues(
							this.getNodeParameter('templateValues', itemIndex),
						),
						template_version:
							(this.getNodeParameter('templateVersion', itemIndex, 0) as number) || undefined,
					} as CreateTemplatedImageRequest;
					Object.defineProperty(request, '__type', {
						value: 'templated',
						enumerable: false,
					});
					result = await client.createImage(request);
				}

				assertSuccess(this, result, itemIndex);
				const output = this.getNodeParameter('output', itemIndex, 'metadata') as
					| 'metadata'
					| 'binary'
					| 'both';
				const outputItem: INodeExecutionData = {
					json: output === 'binary' ? {} : (result as unknown as IDataObject),
					pairedItem: { item: itemIndex },
				};
				if (output !== 'metadata') {
					await addBinaryOutput(
						this,
						outputItem,
						result,
						this.getNodeParameter('format', itemIndex, 'png') as 'png' | 'jpg' | 'webp' | 'pdf',
						this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string,
					);
				}
				returnData.push(outputItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							...items[itemIndex].json,
							error: (error as Error).message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
