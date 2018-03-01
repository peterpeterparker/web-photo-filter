# Web Photo Filter

Web Photo Filter is a web component to apply Instagram-like WebGL filters to photos

## Goals

The main goal of this component is to be implemented in the mobile application [Fluster](https://fluster.io) to let users, while posting their rooms to let and flats, enhance the photos of their offers in order to make them more attractive. 

### Image modification and fast processing

Other web based solutions to filter and modify pictures like CSS (for example [Instagram.css](https://picturepan2.github.io/instagram.css/)) or Javascript were discarded to fulfill the above goal.

A CSS solution would not modify the image itself but "only" applies a layer on it.

Most Javascript based algorithm are not enough performing to be used on mobile device (= the processing should be as fast as possible, almost instantaneous as Instagram is). 

### Supported by major browsers and devices

This component, at least for the moment, February 2018, will use [WebGL](https://caniuse.com/#feat=webgl) because at this time this technology is well supported across browsers and devices.

[WebGL 2](https://caniuse.com/#search=webgl%202) might be use later on, but this technology isn't enough well supported right now.

Furthermore, in order to not produce error, in case WebGL would not be supported, the component will simply display the original image. 

### Lightweight, fast boot time, lazy loading, support across the most popular frontend frameworks

This project is a web component build with the amazing [Stencil](https://stenciljs.com) compiler.

The project framework and structure follows the [stencil-component-starter](https://github.com/ionic-team/stencil-component-starter)

## Installation

    $ npm install web-photo-filter

### Installation in a Ionic project

After having installed the library, proceed with following steps:

1. In the module where you would like to use the component, import and add `CUSTOM_ELEMENTS_SCHEMA` to your list of schemas

        @NgModule({
            declarations: [
                MyPage
            ],
            imports: [
                IonicPageModule.forChild(MyPage)
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        export class MyPageModule {
        }
        
2. In `app.modules` (the main module of your app), import the component. As far as I understood, web component built with Stencil inherit Lazy Loading, therefore, no worries about effect on your boot time

         import 'web-photo-filter';
         
3. At this time, the web component installed under node_modules not gonna be automatically included in the vendor.js bundle. Therefore it need a tricks to be copied. To do so, create a local custom `copy.config.js` (which gonna be processed as another config of [ionic-app-scripts](https://github.com/ionic-team/ionic-app-scripts/blob/master/config/copy.config.js)) and add the following block

       module.exports = {
         copyWebPhotoFilter: {
           src: ['{{ROOT}}/node_modules/web-photo-filter/dist/webphotofilter**/*'],
           dest: '{{BUILD}}'
         }
       } 

Don't forget to also update your `package.json` in order to use your local modified `copy.config.js` file

        "config": {
            "ionic_copy": "./scripts/copy.config.js"
          }

**WARNING** Right now, including a Stencil component like this project in a Ionic app, will fail at runtime on Android >= 7. This has been reported in following issue [https://github.com/ionic-team/stencil/issues/517](https://github.com/ionic-team/stencil/issues/517)   

## Getting Started

The Web Photo Filter Component could be use like following:

    <web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
    
The only mandatory parameter is `src` respectively the source of the image. Right now, the component doesn't support Cors image (like https://url.com/myimage.jpg).

### Filter

Filter is optional. Omitting this attribute or specifying a null value will result in no processing, the source image gonna be displayed.

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
    
### Level

Some filters (brightness, saturation, contrast and hue) are variable. To modifiy their default impact, you could use the variable `level`

    <web-photo-filter src="assets/img/test.jpg" filter="brightness" level="1.2"></web-photo-filter>
    
`level` is a **number** parameter
    

## Showcase

A showcase of all filters is available at [https://web-photo-filter.firebaseapp.com](https://web-photo-filter.firebaseapp.com)  

The above showcase is the `www` folder of this project deployed in Firebase. If you clone the repository you could run it locally using `npm start`

## Credits

This web component would not had been possible without the brilliant [article](https://www.madebymike.com.au/writing/canvas-image-manipulation/) and WebGL core processing code written by [Mike Riethmuller](https://github.com/MadeByMike) :heart:

The sources of nine filters (Brownie, Brightnes, etc.) were adapted from the project [WebGLImageFilter](https://github.com/phoboslab/WebGLImageFilter) by [Dominic Szablewski](http://phoboslab.org/) :+1:

## Limits

Even if WebGL is nowadays well supported by major modern browser, there might be some cases, were the filters ain't gonna work. In my case, I did  implement a fallback scenario, in case WebGL would not be supported.

### iOS (WKWebView)

According my tests, these filters work very well on iPhone >= 6. It's possible to load all of them in a same page without any problems.

### Android (WebView)

According my tests, these filters work very well on Android >= 7. I did test them on a Samsung Edge (Android 7.1), Nexus 5X and Sony (Android 8,1).

But, Android WebView seems to be able to handle less active canvas than iPhones. Therefore I just didn't used all filters in the same pages but only integrated a couple of them.

#### Device detection (Cordova)

I used the Cordova plugin [Device](https://github.com/apache/cordova-plugin-device) to restrict the use of the filters according the devices' models or versions.


## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

