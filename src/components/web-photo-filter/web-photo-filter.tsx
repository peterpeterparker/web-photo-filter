import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'web-photo-filter',
  styleUrl: 'web-photo-filter.scss',
  shadow: true
})
export class WebPhotoFilterComponent {

  @Prop() first: string;
  @Prop() last: string;

  render() {
    return (
      <div>
        Hello, World! I'm {this.first} {this.last}
      </div>
    );
  }
}
