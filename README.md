# Web Photo Filter learn from home 
# learn with Peterpeterparker
# help to improve your skills

Web Photo Filter is a web component to apply Instagram-like WebGL filters to photos

[![GitHub](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/peterpeterparker/web-photo-filter)
[![npm](https://img.shields.io/npm/dm/web-photo-filter.svg)]()

## Goals

This component was originally implemented for the deprecated mobile application [Fluster](https://github.com/fluster). It had for goal to let users enhance photos of their rooms and flats, to make their listings more attractive. 

### Image modification solutions and fast processing

Others web based filter solutions use CSS (for example [Instagram.css](https://picturepan2.github.io/instagram.css/)) or Javascript to modify images.

CSS solutions do not modify the underlying image, and <strong>only</strong> apply a visual layer to it. 

Most Javascript based solutions are not optimized well enough to be used on mobile devices, and speed was a top priority. We wanted to create an almost instantaneous filter solution, similar to what Instagram leverages in it's mobile applications. 

### Supported by major browsers and devices

As of Feburary 2018, Web Photo Filter utilizes [WebGL](https://caniuse.com/#feat=webgl) based technology because it is well supported across modern browsers and mobile devices. 

In the future, Web Photo Filter may use [WebGL 2](https://caniuse.com/#search=webgl%202) when it is better supported.

In the case that WebGL is not supported on a partciular platform, and to avoid producing an error, the component will display the original image without modifications.

### Lightweight, fast boot time, lazy loading, support across the most popular frontend frameworks

This project is a web component built with the amazing [Stencil](https://stenciljs.com) compiler.

The project framework and structure follows the [stencil-component-starter](https://github.com/ionic-team/stencil-component-starter) project structure.

## Installation

    $ npm install web-photo-filter

### Installation in a Ionic v4 project

> Please note that I was not able to integrate the library in an Ionic v4 app in a traditional way as described in the [Stencil documentation](https://stenciljs.com/docs/framework-integration)

However, I was able to integrate the library as described below. 

After you install the library, please proceed with the following steps:

1. In the module where you would like to use the component, add `CUSTOM_ELEMENTS_SCHEMA` to your list of schemas.

        @NgModule({
            declarations: [
                MyPage
            ],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        export class MyPageModule {
        }
        
2. In `index.html` import the component. As far as I understood, web component built with Stencil inherit Lazy Loading, therefore, no worries about effect on your boot time

         <script async src="webphotofilter.js"></script>
         
3. Finally add the following to your `assets` configuration in your `angular.json` files in oder to include the component in your bundle

       "assets": [
           {
             "glob": "webphotofilter.js",
             "input": "node_modules/web-photo-filter/dist",
             "output": "./"
           },
           {
             "glob": "webphotofilter/*",
             "input": "node_modules/web-photo-filter/dist",
             "output": "./"
           }
       ]

## Getting Started

The Web Photo Filter Component could be use like following:

    <web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>

The only required parameter is the img `src` tag. Right now, the component does not support URL based images such as `https://url.com/myimage.jpg`

### Filter

Filter is an optional parameter. Omitting this attribute or specifying a null value will result in no processing within the component. The source image will be displayed unmodified.

The list of available filters is available in class `src/types/web-photo-filter-type.tsx`  

`filter` is a **string** parameter

#### Example: Sepia

     <web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
     
Angular example:

     <web-photo-filter src="{{imgURI}}" filter="{{filter}}"></web-photo-filter>     
     
#### Example: No Filter     

     <web-photo-filter src="assets/img/test.jpg" filter="null"></web-photo-filter>
     
or
     
     <web-photo-filter src="assets/img/test.jpg"></web-photo-filter>

### FilterLoad

If you would like to start or process the result after the component did finished is processing, an event will be triggered containing the resulting image (no filter) or canvas and an indication telling you if WebGL is supported or not. 

    <web-photo-filter (filterLoad)="imageLoaded($event)" src="{{imgURI}}" filter="{{filter}}"></web-photo-filter>
    
The description of the event is available in the interface `src/types/web-photo-filter-result.tsx`

`filterLoad` emit an **event** of type `WebPhotoFilterResult`

### Keep

Sometimes it's handy to keep the source image not displayed in the DOM (for example if you post process the image or the canvas with [cropperjs](https://github.com/fengyuanchen/cropperjs)). To do so, use the optional attribute `keep`

    <web-photo-filter src="assets/img/test.jpg" filter="sepia" keep="true"></web-photo-filter>
    
`keep` is a **boolean** parameter

#### Hide the source image

If you want to hide the source image you kept, you could for example proceed like following

1. Include in your app the filters in a div

          <div id="preview">
                 <web-photo-filter src="assets/img/test.jpg" filter="sepia" keep="true"></web-photo-filter>
          </div>

2. Add the following scss code to your app

        #preview {
             web-photo-filter {
                 > img:first-of-type, > canvas:first-of-type {
                     max-width: 100%;
                     display: none;
                 }
             }
        }
                     
    
### Level

Some filters (brightness, saturation, contrast and hue) are variable. To modify their default values, you could use the 
variable `level`

    <web-photo-filter src="assets/img/test.jpg" filter="brightness" level="1.2"></web-photo-filter>
    
`level` is a **number** parameter
    

## Showcase

A showcase of all filters is available at [https://webphotofilter.com](https://webphotofilter.com)  

The above showcase is the `www` folder of this project deployed in Firebase. If you clone the repository you could run it locally using `npm start`

## Credits

This web component would not had been possible without the brilliant [article](https://www.madebymike.com.au/writing/canvas-image-manipulation/) and WebGL core processing code written by [Mike Riethmuller](https://github.com/MadeByMike) :heart:

The sources of nine filters (Brownie, Brightnes, etc.) were adapted from the project [WebGLImageFilter](https://github.com/phoboslab/WebGLImageFilter) by [Dominic Szablewski](http://phoboslab.org/) :+1:

## Limits

WebGL is well supported by most modern browsers, but there may be some use cases where it is not. In the case that WebGL is not supported, there is a fallback scenario implemented in the component.

### iOS (WKWebView)

During testing I found that Web Photo Filter works very well on iPhone 6 and above. It is possible to load all filters on the same page without performance issues.

### Android (WebView)

During testing I found that these filters do not work very well on Android 7 and above. Testing for Android was ran on a Samsung Edge (Android 7.1), Nexus 5X and Sony (Android 8.1). 

The Android Webview seems to handle canvas less actively and it's iPhone counterpart. Therefore I do not recommend using all filters on the same page, but only integrating a few of them at a time, otherwise you'll see a negative performance impact.

#### Device detection (Cordova)

I used the Cordova plugin [Device](https://github.com/apache/cordova-plugin-device) to restrict the use of the filters according the devices' models or versions.

## Tutorial

[Simon Grimm (@saimon24)](https://github.com/saimon24) published a walkthrough tutorial ["Ionic Image Filter Like Instagram Using WebGL Filters"](https://ionicacademy.com/ionic-image-filter-webgl/) which displays step by step how to create a Ionic app and include this component easily 

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

