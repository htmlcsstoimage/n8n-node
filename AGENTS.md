# HTML/CSS to Image API n8n integration

## Purpose

This repository publishes the
`@html-css-to-image/n8n-nodes-html-css-to-image` community node. It adapts the
official HTML/CSS to Image TypeScript client to n8n and bundles that client
into the published package.

Keep the n8n experience approachable and typed. Prefer native n8n controls over
asking users to write JSON or encode structured values in strings.

## Architecture

- `nodes/HtmlCssToImage/HtmlCssToImage.node.ts` defines operations, fields, and
  execution.
- `nodes/HtmlCssToImage/helpers.ts` contains n8n-specific mapping, validation,
  error handling, and binary downloads.
- `credentials/HtmlCssToImageApi.credentials.ts` defines API ID/key credentials
  and validates them with authenticated `GET https://hcti.io/v1/ping`.
- `vendor/html-css-to-image-client` is a git submodule pinned to the official
  TypeScript client.
- `scripts/generate-client-properties.mjs` generates primitive n8n options from
  the client request models and JSDoc.
- `scripts/bundle-client.mjs` bundles the pinned client into `dist`; the npm
  package must not require the client as a runtime dependency.
- `tests/generated-properties.test.mjs` contains the integration contract tests.

## Source-of-truth rules

- API request parameters and their TypeScript types belong in the TypeScript
  client first.
- Do not duplicate primitive client parameters manually in the node.
- Do not edit `nodes/HtmlCssToImage/generatedProperties.ts` by hand. Run
  `npm run generate:client`.
- Complex n8n controls and conversions belong in `HtmlCssToImage.node.ts` and
  `helpers.ts`. Examples include PDF dimensions, Google Fonts, and template
  values.
- Update the client repository first, commit/push it, then update this
  repository's submodule pointer to that exact commit.

## Current product decisions

- Initial operations are HTML/CSS, webpage URL, template, and signed URL.
- Batch creation is intentionally not exposed in v1. Do not reintroduce a
  JSON-only batch UI. A future batch UI must support mixed HTML and URL
  variations with a coherent native n8n editor.
- Image listing is intentionally not exposed.
- Template values use `assignmentCollection` so users can add dynamically named,
  typed properties.
- Google Fonts use a repeatable `fixedCollection` and map to `string[]`.
- HTML and CSS fields use `htmlEditor` and `cssEditor`.
- PDF dimensions use a numeric value plus a validated `px`, `in`, `cm`, or `mm`
  unit. Values cannot be negative, and all four margins must be supplied
  together.
- Viewport width/height and jumbo max width/height must each be supplied as
  pairs.
- Optional scalar client fields default to `null` in the n8n UI.
- Credentials and signed URL secrets are server-side only.

## Public and generated files

- Treat `dist/` as generated output; never edit it directly.
- `htmlCssToImageClient.bundle.d.ts` is the local declaration boundary for the
  generated client bundle. Keep it aligned with the client methods used by the
  node.
- The light/dark SVGs are official assets copied from
  `hcti-api-azure/AWSApi/wwwroot/images`.
- The npm package should contain only `dist` and have no runtime `dependencies`.
- Keep the exact `@emnapi/core`, `@emnapi/runtime`, and
  `@emnapi/wasi-threads` dev dependency pins. npm 11 otherwise generates a
  platform-dependent optional-peer lockfile on macOS that `npm ci` rejects on
  GitHub's Linux runners.

## Verification

Run these commands after changes:

```bash
npm run lint
npm test
npm pack --dry-run
```

`scripts/lint.mjs` runs strict n8n linting in a temporary source-only copy so
the vendored client is not scanned. It must never move or remove the client
submodule from the real worktree because Git clients can mistake that temporary
absence for a deletion.

All strict n8n lint errors, TypeScript errors, tests, and `git diff --check`
issues must be resolved before handoff.

## n8n guidance

This is a programmatic node with `n8n.strict` enabled. When changing node UI or
execution behavior, consult:

- `.agents/nodes.md`
- `.agents/properties.md`
- `.agents/nodes-programmatic.md`
- `.agents/credentials.md` when changing credentials
- `.agents/versioning.md` when adding a node version

Prefer official n8n documentation and existing n8n core-node patterns for
property types and UX behavior.
