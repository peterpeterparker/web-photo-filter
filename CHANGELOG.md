<a name="3.1.1"></a>

# [3.1.1](https://github.com/peterpeterparker/web-photo-filter/compare/v3.1.0...v3.1.1) (2021-01-01)

### Fix

- on src change

<a name="3.1.0"></a>

# [3.1.0](https://github.com/peterpeterparker/web-photo-filter/compare/v3.0.0...v3.1.0) (2020-12-30)

### Features

- multiple filters support
- new filter "desaturate"

<a name="3.0.0"></a>

# [3.0.0](https://github.com/peterpeterparker/web-photo-filter/compare/v2.3.0...v3.0.0) (2020-12-29)

### Breaking changes

- drop support of IE11, Edge 16-18 and Safari 10
- component is now `shadowed` and therefore is a proper Web Components
- feature `keep` removed
- both shadowed image and canvas role set as `img` and to `aria-hidden`. for a11y, provide information on the host component.

### Features

- update dependencies (Stencil v2)
- component exposes two parts, `img` and `canvas`, for styling purpose
- supports image from `https` (source image `crossorigin` set to `anonymous`) ([#14](https://github.com/peterpeterparker/web-photo-filter/issues/14))
- add React bindings

### Chore

- use prettier to format code

<a name="2.3.0"></a>

# [2.3.0](https://github.com/peterpeterparker/web-photo-filter/compare/v2.1.1...v2.2.0) (2020-08-15)

### Chore

- update dependencies (Stencil v1.17.x)
- add GitHub actions to deploy to Firebase
- prerender the demo webapp
- repo move to my personal GitHub account

<a name="2.2.1"></a>

# [2.2.1](https://github.com/peterpeterparker/web-photo-filter/compare/v2.1.0...v2.1.1) (2018-08-23)

### Fix

- resolve build warning ([3443abb4276def0ed448e6042ce6b32bd912b815](https://github.com/peterpeterparker/web-photo-filter/commit/3443abb4276def0ed448e6042ce6b32bd912b815))

<a name="2.2.0"></a>

# [2.2.0](https://github.com/peterpeterparker/web-photo-filter/compare/v2.1.0...v2.2.0) (2018-08-20)

## Fixes

- there was a typo in the filter's name "violen_tomato" fixed with "violen**t**\_tomato" ([#7](https://github.com/peterpeterparker/web-photo-filter/issues/7))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/peterpeterparker/web-photo-filter/compare/v2.0.0...v2.1.0) (2018-08-19)

### Libs

- update Stencil ([#5](https://github.com/peterpeterparker/web-photo-filter/issues/5))
- target ES2017 ([#6](https://github.com/peterpeterparker/web-photo-filter/issues/6))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/peterpeterparker/web-photo-filter/compare/v1.1.1...v2.0.0) (2018-08-12)

## Features

- **breaking changes**: Update the component in order to be compatible with **Ionic v4** and **Angular v6**

### Important note

I did not gave a try but this version might no be suitable anymore for Ionic v3 and Angular v5. If you are using the web-photo-filter component in such apps, you might better not upgrade and stick to the component version v1.1.1
