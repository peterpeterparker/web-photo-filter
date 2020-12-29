# web-photo-filter

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                              | Type                                                                                                                                                                                              | Default     |
| -------- | --------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `filter` | `filter`  | The filter to apply on the source image. | `"bgr" \| "blue_monotone" \| "brightness" \| "contrast" \| "cookie" \| "greyscale" \| "hue" \| "koda" \| "polaroid" \| "saturation" \| "sepia" \| "technicolor" \| "vintage" \| "violent_tomato"` | `undefined` |
| `level`  | `level`   | An optional level to apply the filter.   | `number`                                                                                                                                                                                          | `undefined` |
| `src`    | `src`     | The source of the image.                 | `string`                                                                                                                                                                                          | `undefined` |

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
