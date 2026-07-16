# HTML/CSS to Image API for n8n

Generate images, website screenshots, PDFs, and signed render-on-demand URLs
with the [HTML/CSS to Image API](https://htmlcsstoimage.com).

[n8n](https://n8n.io/) is a workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

The community package name is:

```text
@html-css-to-image/n8n-nodes-html-css-to-image
```

## Operations

- Create an image or PDF from HTML and CSS
- Take a screenshot of a webpage URL
- Render a saved template with JSON values
- Generate signed template or webpage URLs that render on demand
- Return image metadata, a binary PNG/JPG/WebP/PDF, or both

## Credentials

Create an HTML/CSS to Image API account, then copy the API ID and API Key from the
[dashboard](https://htmlcsstoimage.com/dashboard). The credential uses HTTP Basic
authentication and n8n stores both values in its encrypted credential store.

## Compatibility

This package is built and tested using the current `@n8n/node-cli` scaffolding and
Node.js LTS.

## Usage

All fields support n8n expressions. For example, HTML from an earlier node can be
rendered with `{{$json.html}}`. Choose binary output when the next node expects a
file attachment, such as email, Slack, S3, or Google Drive.

Template values use n8n's typed field editor. Add each template variable by name
and choose its value type, or use an expression that resolves to an object.

## Example workflows

### Render HTML from an earlier node

1. Add an **HTML/CSS to Image API** node.
2. Select **Create From HTML/CSS**.
3. Set **HTML** to `{{$json.html}}`.
4. Add CSS or rendering options as needed.
5. Leave **Output** as **URL and Metadata**, or select a binary output for file-based nodes.

### Take a webpage screenshot

1. Select **Create From URL**.
2. Set **URL** to a fixed URL or an expression such as `{{$json.url}}`.
3. Add viewport width and height together when a fixed viewport is required.
4. Use the CSS option to inject page-specific overrides before rendering.

### Render a saved template

1. Select **Create From Template** and enter the template ID.
2. Under **Template Values**, add fields matching the variables in the template.
3. Choose the appropriate value type for each field, such as string, number, boolean,
   array, or object.
4. Optionally provide a template version; otherwise the latest version is used.

### Send the result as a file

1. Set **Output** to **Binary File** or **URL, Metadata, and Binary File**.
2. Choose PNG, JPG, WebP, or PDF.
3. Set **Binary Property** to the property expected by the next node, such as `data`.
4. Connect the node to an email, Slack, cloud storage, or other file-capable node.

## TypeScript client synchronization

The official [TypeScript client](https://github.com/htmlcsstoimage/ts-client) is a
git submodule under `vendor/html-css-to-image-client`. It is compiled into this
package, so the published community node has no runtime dependencies.

The n8n option fields are generated from the client request types and their JSDoc:

```bash
git submodule update --init --recursive
npm run generate:client
```

When an API parameter is added to the TypeScript client, update the submodule and
run the generator. Primitive string, number, boolean, string-array, and string-union
parameters are added to the n8n UI automatically. Complex client types need an
n8n-specific UI adapter only when their editor representation requires one.

To update the client:

```bash
git submodule update --remote vendor/html-css-to-image-client
npm run generate:client
npm test
```

## Development

```bash
npm install
npm run lint
npm run build
npm test
npm run dev
```

## Releasing

Releases are published by GitHub Actions from version tags. Do not run
`npm publish` locally.

For the initial `0.1.0` release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

For later releases, update `CHANGELOG.md`, create the version commit and tag,
then push both:

```bash
npm version patch
git push origin main --follow-tags
```

## Resources

- [HTML/CSS to Image API documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)
