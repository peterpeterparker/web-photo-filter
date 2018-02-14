import {Component, Element, Event, EventEmitter, Prop} from '@stencil/core';

import {WebPhotoFilterType} from '../../types/web-photo-filter/web-photo-filter-type';
import {WebPhotoFilterResult} from '../../types/web-photo-filter/web-photo-filter-result';

@Component({
  tag: 'web-photo-filter',
  styleUrl: 'web-photo-filter.scss'
})
export class WebPhotoFilterComponent {

  srcImgId: string;
  private canvasId: string;

  @Prop() src: string;
  @Prop() alt: string;

  @Prop() filter: string;
  @Prop() level: number;

  @Prop() keep: boolean = false;

  @Event() filterLoad: EventEmitter<WebPhotoFilterResult>;

  @Element() el: HTMLElement;

  componentWillLoad() {
    this.srcImgId = 'webPhotoFilterImg' + Date.now();
    this.canvasId = 'webPhotoFilterCanvas' + Date.now();
  }

  private createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource) {

    let compileShader = (shaderSource, shaderType) => {
      let shader = ctx.createShader(shaderType);
      ctx.shaderSource(shader, shaderSource);
      ctx.compileShader(shader);
      return shader;
    };

    let program = ctx.createProgram();
    ctx.attachShader(program, compileShader(vertexShaderSource, ctx.VERTEX_SHADER));
    ctx.attachShader(program, compileShader(fragmentShaderSource, ctx.FRAGMENT_SHADER));
    ctx.linkProgram(program);
    ctx.useProgram(program);

    return program;

  }

  private vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    uniform vec2 u_resolution;
    varying vec2 v_texCoord;
  
    void main() {
       vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0; // convert the rectangle from pixels to clipspace
       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
       v_texCoord = a_texCoord; // pass the texCoord to the fragment shader
    }
  `;

  private fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_image; // the texture
    uniform mat4 u_matrix;
    uniform vec4 u_multiplier;
    varying vec2 v_texCoord; // the texCoords passed from the vertex shader.
  
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      mat4 colMat = mat4(
      color.r, 0, 0, 0,
      0, color.g, 0, 0,
      0, 0, color.b, 0,
      0, 0, 0, color.a
      );
      mat4 product = colMat * u_matrix;
      color.r = product[0].x + product[0].y + product[0].z + product[0].w + u_multiplier[0];
      color.g = product[1].x + product[1].y + product[1].z + product[1].w + u_multiplier[1];
      color.b = product[2].x + product[2].y + product[2].z + product[2].w + u_multiplier[2];
      color.a = product[3].x + product[3].y + product[3].z + product[3].w  + u_multiplier[3];
      gl_FragColor = color;
    }
  `;

  componentWillUpdate() {
    this.applyFilter();
  }

  private applyFilter() {
    const image: HTMLImageElement = this.el.querySelector('img#' + this.srcImgId);

    if (image == null) {
      return;
    }

    let matrix: number[] = WebPhotoFilterType.getFilter(this.filter, this.level);

    if (matrix === null) {
      // We consider null as NO_FILTER, in that case the img will be emitted
      // Furthermore, we explicity displays it
      image.classList.add('display-no-filter');
      this.emitFilterApplied(image, this.hasValidWegGLContext());
      return;
    }

    this.desaturateImage(image, matrix);
  }

  private emitFilterApplied(result: HTMLElement, webGlState: boolean) {
    this.filterLoad.emit({webGLDetected: webGlState, result: result});
  }

  private createCanvas(image: HTMLImageElement): HTMLCanvasElement {
    let canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.id = this.canvasId;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    image.parentNode.insertBefore(canvas, image);

    return canvas;
  }

  private desaturateImage(image: HTMLImageElement, feColorMatrix: number[]) {
    let canvas: HTMLCanvasElement = this.el.querySelector('canvas#' + this.canvasId);

    if (!canvas) {
      canvas = this.createCanvas(image);
    }

    if (!this.keep) {
      // There might be also cases where it's handy to keep a non displayed version of the image in the dom
      image.parentNode.removeChild(image);
    }

    let ctx: WebGLRenderingContext;
    try {
      ctx = canvas.getContext('webgl');
    } catch (e) {
      // In case we couldn't instantiate WebGL, do nothing
      this.emitFilterApplied(image, false);
      return;
    }

    if (!ctx) {
      // WebGL not supported. A fallback could be 2D methods, but that would not be performing
      this.emitFilterApplied(image, false);
      return;
    }

    let program = this.createWebGLProgram(ctx, this.vertexShaderSource, this.fragmentShaderSource);

    // Expose canvas width and height to shader via u_resolution
    let resolutionLocation = ctx.getUniformLocation(program, 'u_resolution');
    ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Modify the feColorMatrix to fit better with available shader datatypes by putting the multiplier in a separate vector

    // This is a little unrefined but we're dealing with a very specific known data structure

    let cloneFeColorMatrix = feColorMatrix.slice();

    let feMultiplier = [];
    feMultiplier.push(cloneFeColorMatrix.splice(3, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(8, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(12, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(16, 1)[0]);

    // Expose feColorMatrix to shader via u_matrix
    let matrixTransform = ctx.getUniformLocation(program, 'u_matrix');
    ctx.uniformMatrix4fv(matrixTransform, false, new Float32Array(cloneFeColorMatrix));

    let multiplier = ctx.getUniformLocation(program, 'u_multiplier');
    ctx.uniform4f(multiplier, feMultiplier[0], feMultiplier[1], feMultiplier[2], feMultiplier[3]);

    // Position rectangle vertices (2 triangles)
    let positionLocation = ctx.getAttribLocation(program, 'a_position');
    let buffer = ctx.createBuffer();
    ctx.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);
    ctx.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array([
      0, 0,
      image.naturalWidth, 0,
      0, image.naturalHeight,
      0, image.naturalHeight,
      image.naturalWidth, 0,
      image.naturalWidth, image.naturalHeight]), WebGLRenderingContext.STATIC_DRAW);
    ctx.enableVertexAttribArray(positionLocation);
    ctx.vertexAttribPointer(positionLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

    //Position texture
    let texCoordLocation = ctx.getAttribLocation(program, 'a_texCoord');
    let texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0]), WebGLRenderingContext.STATIC_DRAW);
    ctx.enableVertexAttribArray(texCoordLocation);
    ctx.vertexAttribPointer(texCoordLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

    // Create a texture.
    let texture = ctx.createTexture();
    ctx.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
    // Load the image into the texture.
    ctx.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, image);

    // Draw the rectangle.
    ctx.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);

    // The filter was applied, we emit the canvas not the source image
    this.emitFilterApplied(canvas, true);
  }

  private hasValidWegGLContext(): boolean {
    let canvas: HTMLCanvasElement = document.createElement('canvas');

    let ctx: WebGLRenderingContext;
    try {
      ctx = canvas.getContext('webgl');
    } catch (e) {
      return false;
    }

    return ctx && ctx instanceof WebGLRenderingContext;
  }

  render() {
    return (
      <img id={this.srcImgId} src={this.src} alt={this.alt} onLoad={() => this.applyFilter()}></img>
    );
  }
}
