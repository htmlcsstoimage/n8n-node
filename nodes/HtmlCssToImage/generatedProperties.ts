/*
 * Generated from vendor/html-css-to-image-client/src/types.
 * Do not edit by hand. Run: npm run generate:client
 */
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

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
  "requestOverrides": "request_overrides",
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
  "blockConsentBanners": "block_consent_banners",
  "durationMs": "duration_ms",
  "trigger": "trigger",
  "actions": "actions",
  "output": "output",
  "durationMode": "duration_mode",
  "deferRender": "defer_render",
  "skipScrollPreload": "skip_scroll_preload",
  "fps": "fps",
  "scale": "scale",
  "type": "type",
  "timeoutMs": "timeout_ms",
  "scrollDurationMs": "scroll_duration_ms",
  "msBetweenScrolls": "ms_between_scrolls",
  "scrollDistance": "scroll_distance",
  "easing": "easing",
  "stallAtEndMs": "stall_at_end_ms",
  "containerSelector": "container_selector",
  "steps": "steps",
  "ifNotFound": "if_not_found",
  "ifFound": "if_found",
  "button": "button",
  "count": "count",
  "delayMs": "delay_ms",
  "offsetX": "offset_x",
  "offsetY": "offset_y",
  "script": "script",
  "ifError": "if_error",
  "position": "position",
  "x": "x",
  "y": "y",
  "to": "to"
} as const;

export const requestOverrideResourceValues = [
  "beacon",
  "document",
  "stylesheet",
  "image",
  "image_set",
  "media",
  "font",
  "script",
  "text_track",
  "xhr",
  "fetch",
  "event_source",
  "manifest",
  "ping",
  "img",
  "other"
] as const;

export const requestOverrideResourceOptions: INodePropertyOptions[] = [
  {
    "name": "Beacon",
    "value": "beacon"
  },
  {
    "name": "Document",
    "value": "document"
  },
  {
    "name": "Stylesheet",
    "value": "stylesheet"
  },
  {
    "name": "Image",
    "value": "image"
  },
  {
    "name": "Image Set",
    "value": "image_set"
  },
  {
    "name": "Media",
    "value": "media"
  },
  {
    "name": "Font",
    "value": "font"
  },
  {
    "name": "Script",
    "value": "script"
  },
  {
    "name": "Text Track",
    "value": "text_track"
  },
  {
    "name": "XHR",
    "value": "xhr"
  },
  {
    "name": "Fetch",
    "value": "fetch"
  },
  {
    "name": "Event Source",
    "value": "event_source"
  },
  {
    "name": "Manifest",
    "value": "manifest"
  },
  {
    "name": "Ping",
    "value": "ping"
  },
  {
    "name": "Img",
    "value": "img"
  },
  {
    "name": "Other",
    "value": "other"
  }
];

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
    "default": null,
    "typeOptions": {
      "numberPrecision": 2
    }
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
    "description": "HTML/CSS images use Twemoji by default; true disables it. URL images inject Twemoji only when explicitly false; omission or true leaves the page's emoji handling unchanged.",
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
    "default": null,
    "typeOptions": {
      "numberPrecision": 2
    }
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
    "description": "HTML/CSS images use Twemoji by default; true disables it. URL images inject Twemoji only when explicitly false; omission or true leaves the page's emoji handling unchanged.",
    "type": "boolean",
    "default": null
  }
];

export const recordingDurationProperty: INodeProperties = {
  "displayName": "Duration MS",
  "name": "durationMs",
  "description": "Requested duration in milliseconds: 500–30000, or up to 90000 in target mode. duration_mode controls how actions fit into this duration.",
  "type": "number",
  "default": null,
  "required": true
};

export const htmlRecordingClientOptions: INodeProperties[] = [
  {
    "displayName": "CSS",
    "name": "css",
    "description": "CSS to style HTML content or inject into a URL page after it loads.",
    "type": "string",
    "default": null,
    "typeOptions": {
      "editor": "cssEditor"
    }
  },
  {
    "displayName": "Google Fonts",
    "name": "googleFonts",
    "description": "Google Fonts to load. Set font-family in your CSS to use them.",
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
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Viewport width in CSS pixels. Supply both dimensions to set the recording size. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Viewport height in CSS pixels. Supply both dimensions to set the recording size. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Capture pixel density. Defaults to 2 for HTML/CSS and 1 for URL recordings.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "numberPrecision": 2
    }
  },
  {
    "displayName": "Color Scheme",
    "name": "colorScheme",
    "description": "Chrome's preferred light or dark color scheme while recording.",
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
    "description": "Browser timezone as an IANA identifier, such as 'America/New_York'.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Media Type",
    "name": "mediaType",
    "description": "CSS media type used while recording.",
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
    "description": "Enable mobile viewport behavior, including the page's viewport meta tag.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Touch",
    "name": "viewportTouch",
    "description": "Emulate a viewport that supports touch events.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Landscape",
    "name": "viewportLandscape",
    "description": "Emulate landscape orientation.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Organization proxy to use while recording.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Storage Destination ID",
    "name": "storageDestinationId",
    "description": "Storage destination to receive the recording.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Dedupe Duration (Seconds)",
    "name": "dedupeDurationS",
    "description": "Reuse an identical recording created within this many seconds. Set to 0 to disable deduplication.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji for HTML/CSS when true. URL recordings inject it only when explicitly false.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Duration Mode",
    "name": "durationMode",
    "description": "How duration_ms limits the timeline. Defaults to at_most.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "At Least",
        "value": "at_least"
      },
      {
        "name": "At Most",
        "value": "at_most"
      },
      {
        "name": "Fixed",
        "value": "fixed"
      },
      {
        "name": "Target",
        "value": "target"
      }
    ]
  },
  {
    "displayName": "Defer Render",
    "name": "deferRender",
    "description": "Wait to render until media or storage is requested. Defaults to false; does not reset deduplicated recordings.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Skip Scroll Preload",
    "name": "skipScrollPreload",
    "description": "Skip the preparation scroll that loads lazy content. Scrolling actions still run. Defaults to false.",
    "type": "boolean",
    "default": null
  }
];

export const urlRecordingClientOptions: INodeProperties[] = [
  {
    "displayName": "CSS",
    "name": "css",
    "description": "CSS to style HTML content or inject into a URL page after it loads.",
    "type": "string",
    "default": null,
    "typeOptions": {
      "editor": "cssEditor"
    }
  },
  {
    "displayName": "Viewport Width",
    "name": "viewportWidth",
    "description": "Viewport width in CSS pixels. Supply both dimensions to set the recording size. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Viewport Height",
    "name": "viewportHeight",
    "description": "Viewport height in CSS pixels. Supply both dimensions to set the recording size. Viewport width and viewport height must be set together.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Device Scale",
    "name": "deviceScale",
    "description": "Capture pixel density. Defaults to 2 for HTML/CSS and 1 for URL recordings.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "numberPrecision": 2
    }
  },
  {
    "displayName": "Block Consent Banners",
    "name": "blockConsentBanners",
    "description": "Attempt to hide cookie and consent banners before recording.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Color Scheme",
    "name": "colorScheme",
    "description": "Chrome's preferred light or dark color scheme while recording.",
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
    "description": "Browser timezone as an IANA identifier, such as 'America/New_York'.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Media Type",
    "name": "mediaType",
    "description": "CSS media type used while recording.",
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
    "description": "Enable mobile viewport behavior, including the page's viewport meta tag.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Touch",
    "name": "viewportTouch",
    "description": "Emulate a viewport that supports touch events.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Viewport Landscape",
    "name": "viewportLandscape",
    "description": "Emulate landscape orientation.",
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
    "description": "Send custom headers with subrequests to allowed origins. Defaults to false.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Identify As HCTI",
    "name": "identifyAsHcti",
    "description": "Add X-HCTI-SCREENSHOT: 1 to the top-level navigation.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Proxy ID",
    "name": "proxyId",
    "description": "Organization proxy to use while recording.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Storage Destination ID",
    "name": "storageDestinationId",
    "description": "Storage destination to receive the recording.",
    "type": "string",
    "default": null
  },
  {
    "displayName": "Dedupe Duration (Seconds)",
    "name": "dedupeDurationS",
    "description": "Reuse an identical recording created within this many seconds. Set to 0 to disable deduplication.",
    "type": "number",
    "default": null,
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Disable Twemoji",
    "name": "disableTwemoji",
    "description": "Disable Twemoji for HTML/CSS when true. URL recordings inject it only when explicitly false.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Duration Mode",
    "name": "durationMode",
    "description": "How duration_ms limits the timeline. Defaults to at_most.",
    "type": "options",
    "default": null,
    "options": [
      {
        "name": "At Least",
        "value": "at_least"
      },
      {
        "name": "At Most",
        "value": "at_most"
      },
      {
        "name": "Fixed",
        "value": "fixed"
      },
      {
        "name": "Target",
        "value": "target"
      }
    ]
  },
  {
    "displayName": "Defer Render",
    "name": "deferRender",
    "description": "Wait to render until media or storage is requested. Defaults to false; does not reset deduplicated recordings.",
    "type": "boolean",
    "default": null
  },
  {
    "displayName": "Skip Scroll Preload",
    "name": "skipScrollPreload",
    "description": "Skip the preparation scroll that loads lazy content. Scrolling actions still run. Defaults to false.",
    "type": "boolean",
    "default": null
  }
];

export const recordingFields: Record<string, INodeProperties[]> = {
  "RecordingOutputOptions": [
    {
      "displayName": "Format",
      "name": "format",
      "description": "Media format. Defaults to mp4.",
      "type": "options",
      "default": null,
      "options": [
        {
          "name": "GIF",
          "value": "gif"
        },
        {
          "name": "MP4",
          "value": "mp4"
        },
        {
          "name": "WebM",
          "value": "webm"
        }
      ]
    },
    {
      "displayName": "FPS",
      "name": "fps",
      "description": "Frames per second. Defaults to 15 for GIF and 30 for video. GIF supports 10–50; video supports 10–120.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Scale",
      "name": "scale",
      "description": "Scales captured pixels without changing page layout. Defaults to 1; 0.5 halves both dimensions.",
      "type": "number",
      "default": null,
      "typeOptions": {
        "numberPrecision": 2
      }
    }
  ],
  "RecordingImmediateTrigger": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "immediate",
      "options": [
        {
          "name": "Immediate",
          "value": "immediate"
        }
      ],
      "required": true
    }
  ],
  "RecordingElementVisibleTrigger": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "element_visible",
      "options": [
        {
          "name": "Element Visible",
          "value": "element_visible"
        }
      ],
      "required": true
    },
    {
      "displayName": "Selector",
      "name": "selector",
      "description": "CSS selector for the element to wait for.",
      "type": "string",
      "default": "",
      "required": true
    },
    {
      "displayName": "Timeout MS",
      "name": "timeoutMs",
      "description": "Maximum wait in milliseconds. Defaults to 1000; minimum 100. Plan limits apply.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingFunctionCallTrigger": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "function_call",
      "options": [
        {
          "name": "Function Call",
          "value": "function_call"
        }
      ],
      "required": true
    },
    {
      "displayName": "Timeout MS",
      "name": "timeoutMs",
      "description": "Maximum wait in milliseconds. Defaults to 1000; minimum 100. Plan limits apply.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingSimpleScrollAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "simple_scroll",
      "options": [
        {
          "name": "Simple Scroll",
          "value": "simple_scroll"
        }
      ],
      "required": true
    },
    {
      "displayName": "Scroll Duration MS",
      "name": "scrollDurationMs",
      "description": "Duration of each movement in milliseconds. Defaults to 800.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "MS Between Scrolls",
      "name": "msBetweenScrolls",
      "description": "Pause between movements in milliseconds. Defaults to 400; 0 scrolls continuously.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Scroll Distance",
      "name": "scrollDistance",
      "description": "CSS pixels as a number, or a string such as '900px' or '50vh'. Omit or use null to use API defaults.",
      "type": "string",
      "default": null
    },
    {
      "displayName": "Easing",
      "name": "easing",
      "description": "Movement easing. Omit or use null to use API defaults.",
      "type": "options",
      "default": null,
      "options": [
        {
          "name": "Ease In Back",
          "value": "ease_in_back"
        },
        {
          "name": "Ease In Bounce",
          "value": "ease_in_bounce"
        },
        {
          "name": "Ease In Circ",
          "value": "ease_in_circ"
        },
        {
          "name": "Ease In Cubic",
          "value": "ease_in_cubic"
        },
        {
          "name": "Ease In Elastic",
          "value": "ease_in_elastic"
        },
        {
          "name": "Ease In Expo",
          "value": "ease_in_expo"
        },
        {
          "name": "Ease In Out Back",
          "value": "ease_in_out_back"
        },
        {
          "name": "Ease In Out Bounce",
          "value": "ease_in_out_bounce"
        },
        {
          "name": "Ease In Out Circ",
          "value": "ease_in_out_circ"
        },
        {
          "name": "Ease In Out Cubic",
          "value": "ease_in_out_cubic"
        },
        {
          "name": "Ease In Out Elastic",
          "value": "ease_in_out_elastic"
        },
        {
          "name": "Ease In Out Expo",
          "value": "ease_in_out_expo"
        },
        {
          "name": "Ease In Out Quad",
          "value": "ease_in_out_quad"
        },
        {
          "name": "Ease In Out Quart",
          "value": "ease_in_out_quart"
        },
        {
          "name": "Ease In Out Quint",
          "value": "ease_in_out_quint"
        },
        {
          "name": "Ease In Out Sine",
          "value": "ease_in_out_sine"
        },
        {
          "name": "Ease In Quad",
          "value": "ease_in_quad"
        },
        {
          "name": "Ease In Quart",
          "value": "ease_in_quart"
        },
        {
          "name": "Ease In Quint",
          "value": "ease_in_quint"
        },
        {
          "name": "Ease In Sine",
          "value": "ease_in_sine"
        },
        {
          "name": "Ease Out Back",
          "value": "ease_out_back"
        },
        {
          "name": "Ease Out Bounce",
          "value": "ease_out_bounce"
        },
        {
          "name": "Ease Out Circ",
          "value": "ease_out_circ"
        },
        {
          "name": "Ease Out Cubic",
          "value": "ease_out_cubic"
        },
        {
          "name": "Ease Out Elastic",
          "value": "ease_out_elastic"
        },
        {
          "name": "Ease Out Expo",
          "value": "ease_out_expo"
        },
        {
          "name": "Ease Out Quad",
          "value": "ease_out_quad"
        },
        {
          "name": "Ease Out Quart",
          "value": "ease_out_quart"
        },
        {
          "name": "Ease Out Quint",
          "value": "ease_out_quint"
        },
        {
          "name": "Ease Out Sine",
          "value": "ease_out_sine"
        },
        {
          "name": "Linear",
          "value": "linear"
        }
      ]
    },
    {
      "displayName": "Stall At End MS",
      "name": "stallAtEndMs",
      "description": "Time to hold at the bottom in milliseconds, limited by remaining recording time. Defaults to 0.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingScrollAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "scroll",
      "options": [
        {
          "name": "Scroll",
          "value": "scroll"
        }
      ],
      "required": true
    },
    {
      "displayName": "Container Selector",
      "name": "containerSelector",
      "description": "Scrollable container's CSS selector. Omit or use null to scroll the document.",
      "type": "string",
      "default": null
    }
  ],
  "RecordingStallAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "stall",
      "options": [
        {
          "name": "Stall",
          "value": "stall"
        }
      ],
      "required": true
    },
    {
      "displayName": "Duration MS",
      "name": "durationMs",
      "description": "Wait in milliseconds. The recording deadline can end it early.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingLocateSelectorAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "locate_selector",
      "options": [
        {
          "name": "Locate Selector",
          "value": "locate_selector"
        }
      ],
      "required": true
    },
    {
      "displayName": "Selector",
      "name": "selector",
      "description": "CSS selector to find.",
      "type": "string",
      "default": "",
      "required": true
    },
    {
      "displayName": "Timeout MS",
      "name": "timeoutMs",
      "description": "Maximum wait in milliseconds. Defaults to 0 for a single check.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingClickAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "click",
      "options": [
        {
          "name": "Click",
          "value": "click"
        }
      ],
      "required": true
    },
    {
      "displayName": "Selector",
      "name": "selector",
      "description": "CSS selector of the element to click.",
      "type": "string",
      "default": "",
      "required": true
    },
    {
      "displayName": "Timeout MS",
      "name": "timeoutMs",
      "description": "Maximum wait in milliseconds. Defaults to 0 for a single check.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Button",
      "name": "button",
      "description": "Mouse button. Defaults to left.",
      "type": "options",
      "default": null,
      "options": [
        {
          "name": "Back",
          "value": "back"
        },
        {
          "name": "Forward",
          "value": "forward"
        },
        {
          "name": "Left",
          "value": "left"
        },
        {
          "name": "Middle",
          "value": "middle"
        },
        {
          "name": "Right",
          "value": "right"
        }
      ]
    },
    {
      "displayName": "Count",
      "name": "count",
      "description": "Event click count, from 1 to 3. Defaults to 1; this does not repeat the action.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Delay MS",
      "name": "delayMs",
      "description": "Delay between mouse down and up, in milliseconds. Defaults to 0; maximum 5000.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Offset X",
      "name": "offsetX",
      "description": "CSS pixels from the element's top-left. Supplying either offset makes the other default to 0.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Offset Y",
      "name": "offsetY",
      "description": "CSS pixels from the element's top-left. Omit both offsets to use the default clickable point.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingExecuteJavaScriptAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "execute_javascript",
      "options": [
        {
          "name": "Execute JavaScript",
          "value": "execute_javascript"
        }
      ],
      "required": true
    },
    {
      "displayName": "Script",
      "name": "script",
      "description": "Function body supporting await. Its return value is ignored.",
      "type": "string",
      "default": "",
      "required": true
    },
    {
      "displayName": "Timeout MS",
      "name": "timeoutMs",
      "description": "Maximum execution time in milliseconds. Zero or omitted uses the page timeout; maximum 90000.",
      "type": "number",
      "default": null
    }
  ],
  "RecordingErrorAction": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "error",
      "options": [
        {
          "name": "Error",
          "value": "error"
        }
      ],
      "required": true
    }
  ],
  "PositionScrollTarget": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "position",
      "options": [
        {
          "name": "Position",
          "value": "position"
        }
      ],
      "required": true
    },
    {
      "displayName": "Position",
      "name": "position",
      "description": "Edge to scroll to. Defaults to top.",
      "type": "options",
      "default": null,
      "options": [
        {
          "name": "Bottom",
          "value": "bottom"
        },
        {
          "name": "Left",
          "value": "left"
        },
        {
          "name": "Right",
          "value": "right"
        },
        {
          "name": "Top",
          "value": "top"
        }
      ]
    }
  ],
  "CoordinatesScrollTarget": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "coordinates",
      "options": [
        {
          "name": "Coordinates",
          "value": "coordinates"
        }
      ],
      "required": true
    },
    {
      "displayName": "X",
      "name": "x",
      "description": "Horizontal position. Defaults to 0.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Y",
      "name": "y",
      "description": "Vertical position. Defaults to 0.",
      "type": "number",
      "default": null
    }
  ],
  "SelectorScrollTarget": [
    {
      "displayName": "Type",
      "name": "type",
      "description": "",
      "type": "options",
      "default": "selector",
      "options": [
        {
          "name": "Selector",
          "value": "selector"
        }
      ],
      "required": true
    },
    {
      "displayName": "Selector",
      "name": "selector",
      "description": "",
      "type": "string",
      "default": "",
      "required": true
    },
    {
      "displayName": "Offset X",
      "name": "offsetX",
      "description": "Horizontal offset from the element. Defaults to 0.",
      "type": "number",
      "default": null
    },
    {
      "displayName": "Offset Y",
      "name": "offsetY",
      "description": "Vertical offset from the element. Defaults to 0.",
      "type": "number",
      "default": null
    }
  ],
  "ScrollStep": [
    {
      "displayName": "Duration MS",
      "name": "durationMs",
      "description": "Required movement duration in milliseconds, at least 1. The recording deadline can cut it short.",
      "type": "number",
      "default": null,
      "required": true
    },
    {
      "displayName": "Easing",
      "name": "easing",
      "description": "Movement easing. Defaults to linear.",
      "type": "options",
      "default": null,
      "options": [
        {
          "name": "Ease In Back",
          "value": "ease_in_back"
        },
        {
          "name": "Ease In Bounce",
          "value": "ease_in_bounce"
        },
        {
          "name": "Ease In Circ",
          "value": "ease_in_circ"
        },
        {
          "name": "Ease In Cubic",
          "value": "ease_in_cubic"
        },
        {
          "name": "Ease In Elastic",
          "value": "ease_in_elastic"
        },
        {
          "name": "Ease In Expo",
          "value": "ease_in_expo"
        },
        {
          "name": "Ease In Out Back",
          "value": "ease_in_out_back"
        },
        {
          "name": "Ease In Out Bounce",
          "value": "ease_in_out_bounce"
        },
        {
          "name": "Ease In Out Circ",
          "value": "ease_in_out_circ"
        },
        {
          "name": "Ease In Out Cubic",
          "value": "ease_in_out_cubic"
        },
        {
          "name": "Ease In Out Elastic",
          "value": "ease_in_out_elastic"
        },
        {
          "name": "Ease In Out Expo",
          "value": "ease_in_out_expo"
        },
        {
          "name": "Ease In Out Quad",
          "value": "ease_in_out_quad"
        },
        {
          "name": "Ease In Out Quart",
          "value": "ease_in_out_quart"
        },
        {
          "name": "Ease In Out Quint",
          "value": "ease_in_out_quint"
        },
        {
          "name": "Ease In Out Sine",
          "value": "ease_in_out_sine"
        },
        {
          "name": "Ease In Quad",
          "value": "ease_in_quad"
        },
        {
          "name": "Ease In Quart",
          "value": "ease_in_quart"
        },
        {
          "name": "Ease In Quint",
          "value": "ease_in_quint"
        },
        {
          "name": "Ease In Sine",
          "value": "ease_in_sine"
        },
        {
          "name": "Ease Out Back",
          "value": "ease_out_back"
        },
        {
          "name": "Ease Out Bounce",
          "value": "ease_out_bounce"
        },
        {
          "name": "Ease Out Circ",
          "value": "ease_out_circ"
        },
        {
          "name": "Ease Out Cubic",
          "value": "ease_out_cubic"
        },
        {
          "name": "Ease Out Elastic",
          "value": "ease_out_elastic"
        },
        {
          "name": "Ease Out Expo",
          "value": "ease_out_expo"
        },
        {
          "name": "Ease Out Quad",
          "value": "ease_out_quad"
        },
        {
          "name": "Ease Out Quart",
          "value": "ease_out_quart"
        },
        {
          "name": "Ease Out Quint",
          "value": "ease_out_quint"
        },
        {
          "name": "Ease Out Sine",
          "value": "ease_out_sine"
        },
        {
          "name": "Linear",
          "value": "linear"
        }
      ]
    }
  ]
};

export const recordingComplexFields: Record<string, string[]> = {
  "RecordingOutputOptions": [],
  "RecordingImmediateTrigger": [],
  "RecordingElementVisibleTrigger": [],
  "RecordingFunctionCallTrigger": [],
  "RecordingSimpleScrollAction": [],
  "RecordingScrollAction": [
    "steps",
    "if_not_found"
  ],
  "RecordingStallAction": [],
  "RecordingLocateSelectorAction": [
    "if_found",
    "if_not_found"
  ],
  "RecordingClickAction": [
    "if_not_found"
  ],
  "RecordingExecuteJavaScriptAction": [
    "if_error"
  ],
  "RecordingErrorAction": [],
  "PositionScrollTarget": [],
  "CoordinatesScrollTarget": [],
  "SelectorScrollTarget": [
    "if_not_found"
  ],
  "ScrollStep": [
    "to"
  ]
};

export const recordingActionModels: Record<string, string> = {
  "simple_scroll": "RecordingSimpleScrollAction",
  "scroll": "RecordingScrollAction",
  "stall": "RecordingStallAction",
  "locate_selector": "RecordingLocateSelectorAction",
  "click": "RecordingClickAction",
  "execute_javascript": "RecordingExecuteJavaScriptAction",
  "error": "RecordingErrorAction"
};
export const recordingTriggerModels: Record<string, string> = {
  "immediate": "RecordingImmediateTrigger",
  "element_visible": "RecordingElementVisibleTrigger",
  "function_call": "RecordingFunctionCallTrigger"
};
export const scrollTargetModels: Record<string, string> = {
  "position": "PositionScrollTarget",
  "coordinates": "CoordinatesScrollTarget",
  "selector": "SelectorScrollTarget"
};
