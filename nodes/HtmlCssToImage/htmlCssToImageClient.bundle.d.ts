export type CreateImageSuccessResponse = {
	success: true;
	id: string;
	url: string;
};

export type CreateImageErrorResponse = {
	success: false;
	error: string;
	message?: string;
	validation_errors?: Array<{ path: string; message: string }>;
};

export type CreateImageResponse = CreateImageSuccessResponse | CreateImageErrorResponse;

export type CreateImageBatchResponse =
	| { success: true; images: CreateImageSuccessResponse[] }
	| CreateImageErrorResponse;

export type PdfValueInput =
	| number
	| { value: number; unit: 'px' | 'in' | 'cm' | 'mm' };

export class PDFOptions {
	constructor(init?: {
		print_background?: boolean;
		scale?: number;
		page_width?: PdfValueInput;
		page_height?: PdfValueInput;
		margins?: {
			top: PdfValueInput;
			right: PdfValueInput;
			bottom: PdfValueInput;
			left: PdfValueInput;
		};
	});
}

export class CreateHtmlCssImageRequest {
	readonly __type: 'html_css';
	constructor(init?: Record<string, unknown>);
}

export class CreateUrlImageRequest {
	readonly __type: 'url';
	constructor(init?: Record<string, unknown>);
}

export type CreateTemplatedImageRequest = {
	readonly __type: 'templated';
	template_id: string;
	template_values: Record<string, unknown>;
	template_version?: number;
};

export class HtmlCssToImageClient {
	constructor(apiId: string, apiKey: string);
	createImage(
		request:
			| CreateHtmlCssImageRequest
			| CreateUrlImageRequest
			| CreateTemplatedImageRequest,
	): Promise<CreateImageResponse>;
	createImageBatch(
		variations: Array<CreateHtmlCssImageRequest | CreateUrlImageRequest>,
		defaultOptions?: CreateHtmlCssImageRequest | CreateUrlImageRequest,
	): Promise<CreateImageBatchResponse>;
	generateCreateAndRenderUrl(request: CreateUrlImageRequest): string;
	generateTemplatedImageUrl(
		templateId: string,
		templateValues: Record<string, unknown>,
		templateVersion?: number,
	): string;
}
