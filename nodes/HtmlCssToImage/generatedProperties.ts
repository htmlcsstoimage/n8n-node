/*
 * Generated from vendor/html-css-to-image-client/src/types.
 * Do not edit by hand. Run: npm run generate:client
 */
import type { INodeProperties } from 'n8n-workflow';

export const apiNameByParameter = {
  "selector": "selector",
  "deviceScale": "device_scale",
  "viewportHeight": "viewport_height",
  "viewportWidth": "viewport_width",
  "maxWaitMs": "max_wait_ms",
  "msDelay": "ms_delay",
  "renderWhenReady": "render_when_ready",
  "maxRenderOnce": "max_render_once",
  "disableTwemoji": "disable_twemoji",
  "colorScheme": "color_scheme",
  "timezone": "timezone",
  "viewportMobile": "viewport_mobile",
  "viewportTouch": "viewport_touch",
  "viewportLandscape": "viewport_landscape",
  "mediaType": "media_type",
  "proxyId": "proxy_id",
  "jumboMaxWidth": "jumbo_max_width",
  "jumboMaxHeight": "jumbo_max_height",
  "css": "css",
  "googleFonts": "google_fonts",
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
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Adjusts the pixel ratio for the screenshot. The default is 2, which is equivalent to a 4K monitor.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Set the height of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Set the width of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
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
    "displayName": "MS Delay",
    "name": "msDelay",
    "description": "Adds extra time before taking the screenshot, such as when waiting for JavaScript to execute.",
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
    "displayName": "Max Render Once",
    "name": "maxRenderOnce",
    "description": "Ensure the image is only ever rendered and saved one time.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji fallback rendering.",
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
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Select an organization proxy for rendering.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Jumbo Max Width",
    "name": "jumboMaxWidth",
    "description": "Set the maximum width in jumbo mode. jumbo_max_height must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Jumbo Max Height",
    "name": "jumboMaxHeight",
    "description": "Set the maximum height in jumbo mode. jumbo_max_width must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
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
    "displayName": "Full Screen",
    "name": "fullScreen",
    "description": "Indicates whether the screenshot should capture the entire webpage in full height. When set to true, this property ensures that the screenshot includes the full vertical content of the webpage, scrolling beyond the visible portion of the viewport if necessary. If set to false or null, only the visible portion of the webpage within the configured viewport dimensions will be captured.",
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
    "displayName": "Selector",
    "name": "selector",
    "description": "A CSS selector to target a specific element on the page. The API will crop the image to the dimensions of this element.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Adjusts the pixel ratio for the screenshot. The default is 2, which is equivalent to a 4K monitor.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Set the height of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Set the width of Chrome's viewport. This will disable automatic cropping. Viewport width and viewport height must be set together.",
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
    "displayName": "MS Delay",
    "name": "msDelay",
    "description": "Adds extra time before taking the screenshot, such as when waiting for JavaScript to execute.",
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
    "displayName": "Max Render Once",
    "name": "maxRenderOnce",
    "description": "Ensure the image is only ever rendered and saved one time.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji fallback rendering.",
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
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Select an organization proxy for rendering.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Jumbo Max Width",
    "name": "jumboMaxWidth",
    "description": "Set the maximum width in jumbo mode. jumbo_max_height must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null
  },
  {
    "displayName": "Jumbo Max Height",
    "name": "jumboMaxHeight",
    "description": "Set the maximum height in jumbo mode. jumbo_max_width must also be defined. Jumbo max width and jumbo max height must be set together.",
    "type": "number",
    "default": null
  }
];
