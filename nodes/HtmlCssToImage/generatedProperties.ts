/*
 * Generated from vendor/html-css-to-image-client/src/types.
 * Do not edit by hand. Run: npm run generate:client
 */
import type { INodeProperties } from 'n8n-workflow';

export const apiNameByParameter = {
  "format": "format",
  "selector": "selector",
  "deviceScale": "device_scale",
  "viewportHeight": "viewport_height",
  "viewportWidth": "viewport_width",
  "maxWaitMs": "max_wait_ms",
  "msDelay": "ms_delay",
  "renderWhenReady": "render_when_ready",
  "maxRenderOnce": "max_render_once",
  "dedupeDurationS": "dedupe_duration_s",
  "disableTwemoji": "disable_twemoji",
  "colorScheme": "color_scheme",
  "timezone": "timezone",
  "viewportMobile": "viewport_mobile",
  "viewportTouch": "viewport_touch",
  "viewportLandscape": "viewport_landscape",
  "mediaType": "media_type",
  "proxyId": "proxy_id",
  "storageDestinationId": "storage_destination_id",
  "jumboMaxWidth": "jumbo_max_width",
  "jumboMaxHeight": "jumbo_max_height",
  "transparentBackground": "transparent_background",
  "css": "css",
  "googleFonts": "google_fonts",
  "headers": "headers",
  "additionalHeaderOrigins": "additional_header_origins",
  "includeHeadersOnSubrequests": "include_headers_on_subrequests",
  "identifyAsHcti": "identify_as_hcti",
  "fullScreen": "full_screen",
  "blockConsentBanners": "block_consent_banners"
} as const;

export const htmlClientOptions: INodeProperties[] = [
  {
    "displayName": "CSS",
    "name": "css",
    "description": "A variable representing optional CSS styles. This can be used to define custom styling rules that are applied to a component or element. The value should be a valid CSS string or undefined.",
    "type": "string",
    "default": null,
    "typeOptions": {
      "editor": "cssEditor"
    }
  },
  {
    "displayName": "Google Fonts",
    "name": "googleFonts",
    "description": "An optional array of strings representing the names of Google Fonts to be used in the application. This variable allows specifying one or more Google Fonts that can be dynamically loaded for styling purposes. Each entry in the array should be the name of a valid font available from Google Fonts. If undefined or empty, no Google Fonts will be loaded.",
    "type": "fixedCollection",
    "typeOptions": {
      "multipleValues": true
    },
    "placeholder": "Add Value",
    "default": {},
    "options": [
      {
        "displayName": "Values",
        "name": "values",
        "values": [
          {
            "displayName": "Value",
            "name": "value",
            "type": "string",
            "default": ""
          }
        ]
      }
    ]
  },
  {
    "displayName": "Selector",
    "name": "selector",
    "description": "A CSS selector to target a specific element on the page. The API will crop the image to the dimensions of this element.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Set the width of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Set the height of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Adjusts the pixel ratio for the screenshot. The default is 2, which is equivalent to a 4K monitor.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Format",
    "name": "format",
    "description": "The file format used in the URL returned by the image creation request. This option is supported for HTML/CSS and URL requests, including batch requests. It only changes the extension of the initially returned URL; it does not change the stored image definition or prevent the image from being rendered in another supported format. When omitted, the API returns its default image URL.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "JPG",
        "value": "jpg"
      },
      {
        "name": "PDF",
        "value": "pdf"
      },
      {
        "name": "PNG",
        "value": "png"
      },
      {
        "name": "WebP",
        "value": "webp"
      }
    ]
  },
  {
    "displayName": "Transparent Background",
    "name": "transparentBackground",
    "description": "Render the image with a transparent background.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "MS Delay",
    "name": "msDelay",
    "description": "Adds extra time before taking the screenshot, such as when waiting for JavaScript to execute.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Max Wait MS",
    "name": "maxWaitMs",
    "description": "Sets a limit on time to wait until the screenshot is taken.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Render When Ready",
    "name": "renderWhenReady",
    "description": "Wait until ScreenshotReady() is called from JavaScript before taking the screenshot.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Color Scheme",
    "name": "colorScheme",
    "description": "Render as if the user has selected light or dark mode.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "Dark",
        "value": "dark"
      },
      {
        "name": "Light",
        "value": "light"
      }
    ]
  },
  {
    "displayName": "Timezone",
    "name": "timezone",
    "description": "Set the browser timezone using an IANA timezone name.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Media Type",
    "name": "mediaType",
    "description": "Set the rendering media type.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "Print",
        "value": "print"
      },
      {
        "name": "Screen",
        "value": "screen"
      }
    ]
  },
  {
    "displayName": "Viewport Mobile",
    "name": "viewportMobile",
    "description": "Render as if the viewport is a mobile device.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Touch",
    "name": "viewportTouch",
    "description": "Enable touch interactions within the viewport.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Landscape",
    "name": "viewportLandscape",
    "description": "Render the viewport in landscape orientation.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Select an organization proxy for rendering.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Storage Destination ID",
    "name": "storageDestinationId",
    "description": "Save rendered images to one of the organization's configured storage destinations.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Dedupe Duration (Seconds)",
    "name": "dedupeDurationS",
    "description": "Reuse an identical image created within this many seconds without consuming image credits. HTML/CSS defaults vary by plan, while URL requests default to 0. Set to 0 to disable deduplication. This applies only to standard single-image POST creation requests. It does not apply to image batch requests and is not included in signed create-and-render URLs generated by the client.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Max Render Once",
    "name": "maxRenderOnce",
    "description": "Ensure the image is only ever rendered and saved one time.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Jumbo Max Width",
    "name": "jumboMaxWidth",
    "description": "Set the maximum width in jumbo mode. jumbo_max_height must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Jumbo Max Height",
    "name": "jumboMaxHeight",
    "description": "Set the maximum height in jumbo mode. jumbo_max_width must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji fallback rendering.",
    "type": "boolean",
    "default": null
  }
];

export const urlClientOptions: INodeProperties[] = [
  {
    "displayName": "CSS",
    "name": "css",
    "description": "Custom CSS rules to inject into the target webpage before rendering. Use this to override existing styles or customize specific elements.",
    "type": "string",
    "default": null,
    "typeOptions": {
      "editor": "cssEditor"
    }
  },
  {
    "displayName": "Selector",
    "name": "selector",
    "description": "A CSS selector to target a specific element on the page. The API will crop the image to the dimensions of this element.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Full Screen",
    "name": "fullScreen",
    "description": "Indicates whether the screenshot should capture the entire webpage in full height. When set to true, this property ensures that the screenshot includes the full vertical content of the webpage, scrolling beyond the visible portion of the viewport if necessary. If set to false or null, only the visible portion of the webpage within the configured viewport dimensions will be captured.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Set the width of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Set the height of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Adjusts the pixel ratio for the screenshot. The default is 2, which is equivalent to a 4K monitor.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Format",
    "name": "format",
    "description": "The file format used in the URL returned by the image creation request. This option is supported for HTML/CSS and URL requests, including batch requests. It only changes the extension of the initially returned URL; it does not change the stored image definition or prevent the image from being rendered in another supported format. When omitted, the API returns its default image URL.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "JPG",
        "value": "jpg"
      },
      {
        "name": "PDF",
        "value": "pdf"
      },
      {
        "name": "PNG",
        "value": "png"
      },
      {
        "name": "WebP",
        "value": "webp"
      }
    ]
  },
  {
    "displayName": "Transparent Background",
    "name": "transparentBackground",
    "description": "Render the image with a transparent background.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "MS Delay",
    "name": "msDelay",
    "description": "Adds extra time before taking the screenshot, such as when waiting for JavaScript to execute.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Max Wait MS",
    "name": "maxWaitMs",
    "description": "Sets a limit on time to wait until the screenshot is taken.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Render When Ready",
    "name": "renderWhenReady",
    "description": "Wait until ScreenshotReady() is called from JavaScript before taking the screenshot.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Block Consent Banners",
    "name": "blockConsentBanners",
    "description": "Attempt to block cookie/consent banners from displaying.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Color Scheme",
    "name": "colorScheme",
    "description": "Render as if the user has selected light or dark mode.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "Dark",
        "value": "dark"
      },
      {
        "name": "Light",
        "value": "light"
      }
    ]
  },
  {
    "displayName": "Timezone",
    "name": "timezone",
    "description": "Set the browser timezone using an IANA timezone name.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Media Type",
    "name": "mediaType",
    "description": "Set the rendering media type.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "Print",
        "value": "print"
      },
      {
        "name": "Screen",
        "value": "screen"
      }
    ]
  },
  {
    "displayName": "Viewport Mobile",
    "name": "viewportMobile",
    "description": "Render as if the viewport is a mobile device.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Touch",
    "name": "viewportTouch",
    "description": "Enable touch interactions within the viewport.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Landscape",
    "name": "viewportLandscape",
    "description": "Render the viewport in landscape orientation.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Additional Header Origins",
    "name": "additionalHeaderOrigins",
    "description": "Additional exact HTTP or HTTPS origins allowed to receive custom headers.",
    "type": "fixedCollection",
    "typeOptions": {
      "multipleValues": true
    },
    "placeholder": "Add Value",
    "default": {},
    "options": [
      {
        "displayName": "Values",
        "name": "values",
        "values": [
          {
            "displayName": "Value",
            "name": "value",
            "type": "string",
            "default": ""
          }
        ]
      }
    ]
  },
  {
    "displayName": "Include Headers on Subrequests",
    "name": "includeHeadersOnSubrequests",
    "description": "Also send custom headers with subrequests to allowed origins.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Identify As HCTI",
    "name": "identifyAsHcti",
    "description": "Add X-HCTI-SCREENSHOT: 1 to the top-level page request.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Select an organization proxy for rendering.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Storage Destination ID",
    "name": "storageDestinationId",
    "description": "Save rendered images to one of the organization's configured storage destinations.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Dedupe Duration (Seconds)",
    "name": "dedupeDurationS",
    "description": "Reuse an identical image created within this many seconds without consuming image credits. HTML/CSS defaults vary by plan, while URL requests default to 0. Set to 0 to disable deduplication. This applies only to standard single-image POST creation requests. It does not apply to image batch requests and is not included in signed create-and-render URLs generated by the client.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Max Render Once",
    "name": "maxRenderOnce",
    "description": "Ensure the image is only ever rendered and saved one time.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Jumbo Max Width",
    "name": "jumboMaxWidth",
    "description": "Set the maximum width in jumbo mode. jumbo_max_height must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Jumbo Max Height",
    "name": "jumboMaxHeight",
    "description": "Set the maximum height in jumbo mode. jumbo_max_width must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji fallback rendering.",
    "type": "boolean",
    "default": null
  }
];
