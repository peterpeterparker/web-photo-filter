import { flush, render } from '@stencil/core/testing';
import { WebPhotoFilterComponent } from './web-photo-filter';

describe('web-photo-filter', () => {
  it('should build', () => {
    expect(new WebPhotoFilterComponent()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [WebPhotoFilterComponent],
        html: '<web-photo-filter></web-photo-filter>'
      });
    });

    // Not implement yet
  });
});
