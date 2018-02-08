# Web Photo Filter

Web Photo Filter is a Web Component to apply Instagram-like WebGL filters to photos

## Goals

The main goal of this component is to be implemented in the mobile application [Fluster](https://fluster.io) to let users, while posting their rooms to let and flats, enhance the photos of their offers in order to make them more attractive. 

### Image modification and fast processing

Other web based solutions to filter and modify pictures like CSS (for example [Instagram.css](https://picturepan2.github.io/instagram.css/)) or Javascript were discarded to fulfill the above goal.

A CSS solution would not modify the image itself but "only" applies a layer on it.

Most Javascript based algorithm are not enough performing to be used on mobile device (= the processing should be as fast as possible, almost instantaneous as Instagram itself is) 

### Supported by major browsers and devices

This component, at least for the moment, February 2018, will use [WebGL](https://caniuse.com/#feat=webgl) because at this time this technology is well supported

[WebGL 2](https://caniuse.com/#search=webgl%202) might be use later on, but this technology isn't enough well supported right now.

Furthermore, in order to not produce error, in case WebGL would not be supported, the component will simply display the original image. 

* Lightweight, fast boot time, lazy loading, support across the most popular frontend frameworks

This project is a Web Component build with the amazing [Stencil](https://stenciljs.com) compiler

The project framework and structure follows the [stencil-app-starter](https://github.com/ionic-team/stencil-app-starter) 

## Installation

    $ npm install web-photo-filter

### Installation in a Ionic project

After having installed the library, proceed with following steps

1. In the module you would like to use the component, import and add `CUSTOM_ELEMENTS_SCHEMA` to your list of schemas

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
        
2. In `app.modules` (the main module of your app), import the component. As far as I understood, Web Component built with Stencil inherit Lazy Loading, therefore, no worries about effect on your boot time

         import 'web-photo-filter/webphotofilter';
         
3. At this time, the Web Component installed under node_modules not gonna be automatically included in the vendor.js bundle. Therefore it need a tricks to be copied. To do so, overwrite `copy.config.js` from [ionic-app-scripts](https://github.com/ionic-team/ionic-app-scripts/blob/master/config/copy.config.js) and modify the `copySwToolbox` like following

       copySwToolbox: {
           src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js', '{{ROOT}}/node_modules/web-photo-filter/webphotofilter**/*'],
           dest: '{{BUILD}}'
       }

Don't forget to also update your `package.json` in order to use your local modified `copy.config.js` file

        "config": {
            "ionic_copy": "./scripts/copy.config.js"
          }

## Getting Started

The Web Photo Filter Component could be use like following:

    <web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
    
The only mandatory parameter is `src` respectively the source of the image. Right now, the component doesn't support Cors image (like https://url.com/myimage.jpg).

### Filter

Filter is optional. Omitting this attribute or specifying a null value will result in no processing, the source image gonna be displayed.

The list of available filters (TODO: showcase) are available in class `src/types/web-photo-filter-type.tsx`  

#### Example: Sepia

     <web-photo-filter src="assets/img/test.jpg" filter="sepia"></web-photo-filter>
     
Angular example:

     <web-photo-filter src="{{imgURI}}" filter="{{filter}}"></web-photo-filter>     
     
#### Example: No Filter     

     <web-photo-filter src="assets/img/test.jpg" filter="null"></web-photo-filter>
     
or
     
     <web-photo-filter src="assets/img/test.jpg"></web-photo-filter>

### Event

If you would like to start or process the result after the component did finished is processing, an event will be triggered containing the resulting image (no filter) or canvas. 

    <web-photo-filter (filterLoad)="imageLoaded($event)" src="{{imgURI}}" filter="{{filter}}"></web-photo-filter>

### Keep

Sometimes it's handy to keep the source image not displayed in the DOM (for example if you post process the image or the canvas with [cropperjs](https://github.com/fengyuanchen/cropperjs)). To do so, use the optional attribute `keep`

    <web-photo-filter src="assets/img/test.jpg" filter="sepia" keep="true"></web-photo-filter>
    
## Credits

This Web Component would not had been possible without the brilliant [article](https://www.madebymike.com.au/writing/canvas-image-manipulation/) and WebGL core processing code written by [Mike Riethmuller](https://github.com/MadeByMike) :heart:

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

