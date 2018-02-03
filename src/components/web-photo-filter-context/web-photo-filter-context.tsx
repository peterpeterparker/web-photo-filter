import {Component, Event, EventEmitter, State} from '@stencil/core';

@Component({
  tag: 'web-photo-filter-context',
  styleUrl: 'web-photo-filter-context.scss',
  shadow: true
})
export class WebPhotoFilterContextComponent {

  @State() webGLCxtDetected: boolean = false;

  @Event() webGLDetected: EventEmitter<boolean>;

  componentDidLoad() {
    this.checkWegGLContext();
  }

  private checkWegGLContext() {
    let canvas: HTMLCanvasElement = document.createElement("canvas");

    let ctx;
    try {
      ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      this.webGLDetected.emit(false);
      return;
    }

    this.webGLCxtDetected = ctx && ctx instanceof WebGLRenderingContext;
    this.webGLDetected.emit(this.webGLCxtDetected);
  }

  render() {
    // This content will not be displayed (see related scss)
    return (
      <span>{this.webGLCxtDetected ? 'WebGL' : 'No WebGL'}</span>
    );
  }
}
