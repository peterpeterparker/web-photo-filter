const sass = require('@stencil/sass');

exports.config = {
  namespace: 'webphotofilter',
  generateDistribution: true,
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
