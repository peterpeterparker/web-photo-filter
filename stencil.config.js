exports.config = {
  namespace: 'webphotofilter',
  generateDistribution: true,
  bundles: [
    { components: ['web-photo-filter', 'lazy-img'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
