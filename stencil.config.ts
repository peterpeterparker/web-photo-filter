import {Config} from '@stencil/core';

import {sass} from '@stencil/sass';
import {postcss} from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'webphotofilter',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      baseUrl: 'http://webphotofilter.com',
      serviceWorker: null
    }
  ],
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ]
};
