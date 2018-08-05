import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import * as autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'webphotofilter',
  outputTargets: [
    {type: 'dist'},
    {type: 'www'}
  ],
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
