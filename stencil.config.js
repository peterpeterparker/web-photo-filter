const sass = require('@stencil/sass');

exports.config = {
  namespace: 'webphotofilter',
  outputTargets:[
    { type: 'dist' },
    { type: 'www' }
  ],
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
