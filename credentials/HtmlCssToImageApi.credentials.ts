import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HtmlCssToImageApi implements ICredentialType {
	name = 'htmlCssToImageApi';

	displayName = 'HTML/CSS to Image API';

	icon = 'file:../nodes/HtmlCssToImage/htmlCssToImage.svg' as const;

	documentationUrl = 'https://docs.htmlcsstoimage.com/getting-started/using-the-api/';

	properties: INodeProperties[] = [
		{
			displayName: 'API ID',
			name: 'apiId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your API ID from the HTML/CSS to Image dashboard',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your API key from the HTML/CSS to Image dashboard',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiId}}',
				password: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://hcti.io',
			url: '/v1/ping',
			method: 'GET',
		},
	};
}
