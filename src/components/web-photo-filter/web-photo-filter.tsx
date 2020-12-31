import {Component, Event, EventEmitter, Prop, h, Fragment, State, Watch, getAssetPath} from '@stencil/core';

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
  assetsDirs: ['assets'],
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

  @Watch('filter')
  async onFilterChange() {
    await this.applyFilter();
  }

  @Watch('src')
  async onSrcChange() {
    await this.applyFilter();
  }

  private async applyFilter() {
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

    await this.desaturate(matrix);
  }

  private async desaturate(matrix: number[][]) {
    // let ctx: WebGLRenderingContext;
    // try {
    //   ctx = this.canvasRef.getContext('webgl', {preserveDrawingBuffer: true});
    // } catch (e) {
    //   // In case we couldn't instantiate WebGL, do nothing
    //   this.emitFilterApplied(this.imgRef, false);
    //   return;
    // }
    //
    // if (!ctx) {
    //   // WebGL not supported. A fallback could be 2D methods, but that would not be performing
    //   this.emitFilterApplied(this.imgRef, false);
    //   return;
    // }

    // In case the filter is applied after having displayed no filter
    this.imgRef?.classList.remove('display-no-filter');

    const offscreen: OffscreenCanvas = new OffscreenCanvas(this.imgRef.naturalWidth, this.imgRef.naturalHeight);

    const worker = new Worker(getAssetPath(`./assets/desaturate.worker.js`));

    worker.onmessage = ($event) => {
      this.updateCanvasSize();

      const ctx: CanvasRenderingContext2D = this.canvasRef.getContext('2d');
      ctx.drawImage($event.data, 0, 0, this.imgRef.naturalWidth, this.imgRef.naturalHeight);
    };

    worker.postMessage({canvas: offscreen, matrix, img: await createImageBitmap(this.imgRef)}, [offscreen]);
    // await desaturateImage(offscreen, matrix, {texture, naturalWidth: this.imgRef.naturalWidth, naturalHeight: this.imgRef.naturalHeight});

    // offscreen.transferToImageBitmap();

    this.canvasDisplay = 'block';

    // The filter was applied, we emit the canvas not the source image
    this.emitFilterApplied(this.canvasRef, true);
  }

  private emitFilterApplied(result: HTMLElement, webGlState: boolean) {
    this.filterLoad.emit({webGLDetected: webGlState, result: result});
  }

  private updateCanvasSize() {
    if (!this.canvasRef) {
      return;
    }

    this.canvasRef.width = this.imgRef?.naturalWidth;
    this.canvasRef.height = this.imgRef?.naturalHeight;
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
      onLoad={async () => await this.applyFilter()}></img>
  }
}
