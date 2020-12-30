# web-photo-filter

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                                                                                                           | Type     | Default     |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `filter` | `filter`  | A comma separated list of filter to apply on the source image. If no filter is provided, the source image as it will be displayed. Current filter are supported: 'sepia', 'blue_monotone', 'violent_tomato', 'greyscale', 'desaturate', 'brightness', 'saturation', 'contrast', 'hue', 'cookie', 'vintage', 'koda', 'technicolor', 'polaroid', 'bgr'. | `string` | `undefined` |
| `level`  | `level`   | An optional level to apply the filter. If multiple filter are provided, it applies to all except if a specific level is provided for a filter, such as saturation(1.1)                                                                                                                                                                                | `number` | `undefined` |
| `src`    | `src`     | The source of the image.                                                                                                                                                                                                                                                                                                                              | `string` | `undefined` |

## Events

| Event        | Description                                                                                                                                                                                           | Type                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `filterLoad` | An event emitted each times a filter is applied. It provides information about the webgl context (is is supported?) and emit either the image, if filter can not be applied, or the resulting canvas. | `CustomEvent<WebPhotoFilterResult>` |

## Shadow Parts

| Part       | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `"canvas"` | The part attribute to access the resulting filtered canvas |
| `"img"`    | The part attribute to access the source image              |

---

_Built with [StencilJS](https://stenciljs.com/)_
