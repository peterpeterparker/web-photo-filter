import { flush, render } from '@stencil/core/testing';
import { WebPhotoFilterComponent } from './web-photo-filter-component.spec';

describe('web-photo-filter-component', () => {
  it('should build', () => {
    expect(new WebPhotoFilterComponent()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [WebPhotoFilterComponent],
        html: '<web-photo-filter-component></web-photo-filter-component>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
    });

    it('should work with a first name', async () => {
      element.first = 'Peter';
      await flush(element);
      expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter');
    });

    it('should work with a last name', async () => {
      element.last = 'Parker';
      await flush(element);
      expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
    });

    it('should work with both a first and a last name', async () => {
      element.first = 'Peter'
      element.last = 'Parker';
      await flush(element);
      expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
    });
  });
});
