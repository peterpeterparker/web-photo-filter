import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'web-photo-filter',
  styleUrl: 'web-photo-filter.scss',
  shadow: true
})
export class WebPhotoFilterComponent {

  @Prop() src: string;
  @Prop() alt: string;

  render() {
    return (
      <lazy-img src={this.src} alt={this.alt}></lazy-img>
    );
  }
}
