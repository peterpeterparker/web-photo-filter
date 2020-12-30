import {Component, Event, EventEmitter, Prop, h, Fragment, State, Watch} from '@stencil/core';

import {WebPhotoFilterType} from '../../types/web-photo-filter/web-photo-filter-type';
import {WebPhotoFilterResult} from '../../types/web-photo-filter/web-photo-filter-result';

/**
 * @part img - The part attribute to access the source image
 * @part canvas - The part attribute to access the resulting filtered canvas
 */
@Component({
  tag: 'web-photo-filter',
  styleUrl: 'web-photo-filter.scss',
  shadow: true,
})
export class WebPhotoFilterComponent {
  /**
   * The source of the image.
   */
  @Prop() src: string;

  /**
   * A comma separated list of filter to apply on the source image. If no filter is provided, the source image as it will be displayed. Current filter are supported: 'sepia', 'blue_monotone', 'violent_tomato', 'greyscale', 'desaturate', 'brightness', 'saturation', 'contrast', 'hue', 'cookie', 'vintage', 'koda', 'technicolor', 'polaroid', 'bgr'.
   */
  @Prop() filter: string;

  /**
   * An optional level to apply the filter. If multiple filter are provided, it applies to all except if a specific level is provided for a filter, such as saturation(1.1)
   */
  @Prop() level: number;

  /**
   * An event emitted each times a filter is applied. It provides information about the webgl context (is is supported?) and emit either the image, if filter can not be applied, or the resulting canvas.
   */
  @Event() filterLoad: EventEmitter<WebPhotoFilterResult>;

  @State()
  private canvasDisplay: 'none' | 'block' = 'none';

  private imgRef!: HTMLImageElement;
  private canvasRef!: HTMLCanvasElement;

  private createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource) {
    const compileShader = (shaderSource, shaderType) => {
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

  private readonly vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    uniform vec2 u_resolution;
    varying vec2 v_texCoord;
    uniform float flipY;

    void main() {
       vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0; // convert the rectangle from pixels to clipspace
       gl_Position = vec4(clipSpace * vec2(1, flipY), 0, 1);
       v_texCoord = a_texCoord; // pass the texCoord to the fragment shader
    }
  `;

  private readonly fragmentShaderSource = `
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

  @Watch('filter')
  onFilterChange() {
    this.applyFilter();
  }

  @Watch('src')
  onSrcChange() {
    this.applyFilter();
  }

  applyFilter() {
    const filterList: string[] = this.filter?.split(',');

    const matrix: number[][] = filterList
      ?.map((filter: string) => {
        const extractLevel = /\((.*)\)/;
        const matches = extractLevel.exec(filter);

        const level: number | undefined = matches && matches.length >= 1 ? parseFloat(matches[1]) : this.level;

        return WebPhotoFilterType.getFilter(filter?.replace(/\((.*)\)/, '')?.trim(), level);
      })
      ?.filter((matrix: number[] | null) => matrix !== null);

    if (matrix === undefined) {
      // We consider null as NO_FILTER, in that case the img will be emitted
      // Furthermore, we explicity displays it
      this.imgRef?.classList.add('display-no-filter');
      this.emitFilterApplied(this.imgRef, this.hasValidWegGLContext());
      return;
    }

    this.desaturateImage(matrix);
  }

  private emitFilterApplied(result: HTMLElement, webGlState: boolean) {
    this.filterLoad.emit({webGLDetected: webGlState, result: result});
  }

  private updateCanvasSize() {
    this.canvasRef.width = this.imgRef?.naturalWidth;
    this.canvasRef.height = this.imgRef?.naturalHeight;
  }

  private desaturateImage(matrix: number[][]) {
    if (!this.canvasRef) {
      return;
    }

    this.updateCanvasSize();

    let ctx: WebGLRenderingContext;
    try {
      ctx = this.canvasRef.getContext('webgl', {preserveDrawingBuffer: true});
    } catch (e) {
      // In case we couldn't instantiate WebGL, do nothing
      this.emitFilterApplied(this.imgRef, false);
      return;
    }

    if (!ctx) {
      // WebGL not supported. A fallback could be 2D methods, but that would not be performing
      this.emitFilterApplied(this.imgRef, false);
      return;
    }

    // Create a texture.
    const texture = this.createRootTexture(ctx);

    const steps = matrix.map(() => this.createFramebufferTexture(ctx));

    matrix.forEach((mat: number[], index: number) => {
      this.applyMatrix(ctx, mat, index < matrix.length - 1 ? steps[index].target : null, index > 0 ? steps[index - 1].source : texture);
    });

    this.canvasDisplay = 'block';

    // The filter was applied, we emit the canvas not the source image
    this.emitFilterApplied(this.canvasRef, true);
  }

  private createRootTexture(ctx: WebGLRenderingContext): WebGLTexture {
    const texture: WebGLTexture = ctx.createTexture();
    ctx.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);
    ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
    // Load the image into the texture.
    ctx.texImage2D(
      WebGLRenderingContext.TEXTURE_2D,
      0,
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.UNSIGNED_BYTE,
      this.imgRef
    );
    return texture;
  }

  private applyMatrix(ctx: WebGLRenderingContext, feColorMatrix: number[], target: WebGLFramebuffer | null, source: WebGLTexture) {
    const program = this.createWebGLProgram(ctx, this.vertexShaderSource, this.fragmentShaderSource);

    // Expose canvas width and height to shader via u_resolution
    const resolutionLocation = ctx.getUniformLocation(program, 'u_resolution');
    ctx.uniform2f(resolutionLocation, this.canvasRef.width, this.canvasRef.height);

    // Modify the feColorMatrix to fit better with available shader datatypes by putting the multiplier in a separate vector

    // This is a little unrefined but we're dealing with a very specific known data structure

    const cloneFeColorMatrix = feColorMatrix.slice();

    const feMultiplier = [];
    feMultiplier.push(cloneFeColorMatrix.splice(3, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(8, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(12, 1)[0]);
    feMultiplier.push(cloneFeColorMatrix.splice(16, 1)[0]);

    // Expose feColorMatrix to shader via u_matrix
    const matrixTransform = ctx.getUniformLocation(program, 'u_matrix');
    ctx.uniformMatrix4fv(matrixTransform, false, new Float32Array(cloneFeColorMatrix));

    const multiplier = ctx.getUniformLocation(program, 'u_multiplier');
    ctx.uniform4f(multiplier, feMultiplier[0], feMultiplier[1], feMultiplier[2], feMultiplier[3]);

    // Position rectangle vertices (2 triangles)
    const positionLocation = ctx.getAttribLocation(program, 'a_position');
    const buffer = ctx.createBuffer();
    ctx.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      WebGLRenderingContext.ARRAY_BUFFER,
      new Float32Array([
        0,
        0,
        this.imgRef.naturalWidth,
        0,
        0,
        this.imgRef.naturalHeight,
        0,
        this.imgRef.naturalHeight,
        this.imgRef.naturalWidth,
        0,
        this.imgRef.naturalWidth,
        this.imgRef.naturalHeight,
      ]),
      WebGLRenderingContext.STATIC_DRAW
    );
    ctx.enableVertexAttribArray(positionLocation);
    ctx.vertexAttribPointer(positionLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

    //Position texture
    const texCoordLocation = ctx.getAttribLocation(program, 'a_texCoord');
    const texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(
      WebGLRenderingContext.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      WebGLRenderingContext.STATIC_DRAW
    );
    ctx.enableVertexAttribArray(texCoordLocation);
    ctx.vertexAttribPointer(texCoordLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

    // Bind the source and target and draw the two triangles
    ctx.bindTexture(WebGLRenderingContext.TEXTURE_2D, source);
    ctx.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, target);

    // We may have to flip if last target
    const flipY = target === null;
    const uniformFlipY = ctx.getUniformLocation(program, 'flipY');
    ctx.uniform1f(uniformFlipY, flipY ? -1 : 1);

    // Draw the rectangle.
    ctx.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);
  }

  private createFramebufferTexture(ctx: WebGLRenderingContext): {target: WebGLFramebuffer; source: WebGLTexture} {
    const fbo: WebGLFramebuffer = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);

    const renderbuffer = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderbuffer);

    const texture: WebGLTexture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.imgRef.naturalWidth, this.imgRef.naturalHeight, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);

    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, 0);

    ctx.bindTexture(ctx.TEXTURE_2D, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

    return {target: fbo, source: texture};
  }

  private hasValidWegGLContext(): boolean {
    let canvas: HTMLCanvasElement = document.createElement('canvas');

    let ctx: WebGLRenderingContext;
    try {
      ctx = canvas.getContext('webgl', {preserveDrawingBuffer: true});
    } catch (e) {
      return false;
    }

    return ctx && ctx instanceof WebGLRenderingContext;
  }

  render() {
    return (
      <Fragment>
        <canvas
          ref={(el) => (this.canvasRef = el as HTMLCanvasElement)}
          part="canvas"
          style={{display: this.canvasDisplay}}
          role="img"
          aria-hidden={true}></canvas>

        {this.renderImage()}
      </Fragment>
    );
  }

  private renderImage() {
    // prettier-ignore
    // @ts-ignore
    return <img crossOrigin={'anonymous'}
      ref={(el) => (this.imgRef = el as HTMLImageElement)}
      part="img"
      src={this.src}
      role="img"
      aria-hidden={true}
      onLoad={() => this.applyFilter()}></img>
  }
}
