# Web Photo Filter

Web Photo Filter is a web component to apply Instagram-like WebGL filters to photos.

[![GitHub release](https://img.shields.io/github/release/peterpeterparker/web-photo-filter/all?logo=GitHub)](https://github.com/peterpeterparker/web-photo-filter/releases/latest)
[![Tweet](https://img.shields.io/twitter/url?url=https%3A%2F%webphotofilter.com)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fwebphotofilter.com&text=A%20web%20component%20to%20apply%20Instagram-like%20WebGL%20filters%20to%20photos%20by%20%40daviddalbusco)

## Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Limitation](#limitation)
- [Tutorial](#tutorial)

## Introduction

This component has for goal to make Instagram-like filters for photos accessible for the web.

### Image modification solutions and fast processing

Others web based filter solutions often use CSS (for example [Instagram.css](https://picturepan2.github.io/instagram.css/)) or Javascript to modify images.

Applying CSS do not modify the underlying image, and <strong>only</strong> apply a visual layer to it.

Most Javascript based solutions are not always optimized well enough to be used on mobile devices.

I was looking to create an almost instantaneous filter solution, similar to what Instagram leverages in its mobile application.

### Supported by major browsers and devices

As of Feburary 2018, Web Photo Filter utilizes [WebGL](https://caniuse.com/#feat=webgl) based technology because it is well supported across modern browsers and mobile devices.

In the future, Web Photo Filter may use [WebGL 2](https://caniuse.com/#search=webgl%202) when it will be better supported.

In case WebGL would not be supported on a particular platform, and to avoid producing an error, the component will display the original image without modification.

### Lightweight, fast boot time, lazy loading, support across the most popular frontend frameworks

This project is a web component built with the amazing [Stencil](https://stenciljs.com) compiler.

## Installation

```bash
npm install web-photo-filter
```

### React

You can use a [React specific wrapper](https://github.com/peterpeterparker/web-photo-filter-react) for this component.

Install it as following:

```bash
npm install web-photo-filter-react
```

Consume it in your code:

```javascript
import {WebPhotoFilter} from 'web-photo-filter-react/dist';

render() {
    return <WebPhotoFilter/>
}
```

## Usage

The Web Photo Filter Component can be use as following:

```html
<web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
```

The only required parameter is the img `src` tag. It also supports images provided as `https` if the `anonymous` [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) can be use.

### Filter

Filter is an optional parameter. Omitting this attribute or specifying a null value will result in no processing within the component. The source image will be displayed unmodified.

The list of available filters is available in class `src/types/web-photo-filter-type.ts`. Currently: `sepia`, `blue_monotone`, `violent_tomato`, `greyscale`, `desaturate`, `brightness`, `saturation`, `contrast`, `hue`, `cookie`, `vintage`, `koda`, `technicolor`, `polaroid`, `bgr`.

You can provide a unique filter or, a comma separated list of multiple filters.

`filter` is a **string** parameter

#### Example: Sepia

```html
<web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
```

#### Example: Multiple filters

```html
<web-photo-filter src="assets/img/test.jpg" filter="technicolor, saturation(1.6), contrast"></web-photo-filter>
```

### FilterLoad

If you would like to start or process the result after the component did finish is processing, an event will be triggered containing the resulting image (no filter) or canvas. In addition, it contains also an indication telling you if WebGL is supported or not.

```html
<web-photo-filter onFilterLoad={($event) => imageLoaded($event)} src="imgURI" filter="sepia"></web-photo-filter>
```

The description of the event is available in the interface `src/types/web-photo-filter-result.ts`

`filterLoad` emit an **event** of type `WebPhotoFilterResult`

### Level

Some filters (brightness, saturation, contrast and hue) are variable. To modify their default values, you could use the variable `level`.

If multiple filter are provided, it applies to all except if a specific level is provided for a filter, such as for example `saturation(1.1)`.

```html
<web-photo-filter src="assets/img/test.jpg" filter="brightness" level="1.2"></web-photo-filter>
```

`level` is a **number** parameter

## Credits

This web component would not had been possible without the brilliant [article](https://www.madebymike.com.au/writing/canvas-image-manipulation/) and WebGL core processing code written by [Mike Riethmuller](https://github.com/MadeByMike) :heart:

The sources of nine filters (Brownie, Brightnes, etc.) were adapted from the project [WebGLImageFilter](https://github.com/phoboslab/WebGLImageFilter) by [Dominic Szablewski](http://phoboslab.org/) :+1:

## Limitation

WebGL is well supported by most modern browsers, but there may be some use cases where it is not. In the case that WebGL is not supported, there is a fallback scenario implemented in the component.

### iOS (WKWebView)

While testing a couple of years ago, I found out that Web Photo Filter works very well on iPhone 6 and above. It is possible to load all filters on the same page without performance issues.

### Android (WebView)

Likewise I discovered that these filters do not work very well on Android 7 and above. Testing for Android was ran on a Samsung Edge (Android 7.1), Nexus 5X and Sony (Android 8.1).

The Android Webview seems to handle canvas less actively and it's iPhone counterpart. Therefore I do not recommend using all filters on the same page, but only integrating a few of them at a time, otherwise you'll see a negative performance impact.

## Tutorial

[Simon Grimm (@saimon24)](https://github.com/saimon24) published a tutorial ["Ionic Image Filter Like Instagram Using WebGL Filters"](https://ionicacademy.com/ionic-image-filter-webgl/) which displays step by step how to create a Ionic app and include this component easily.

**Note**: to follow this tutorial, version 2 of the component has to be use.

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)
