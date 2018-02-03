exports.config = {
  namespace: 'webphotofilter',
  generateDistribution: true,
  bundles: [
    { components: ['web-photo-filter', 'lazy-img', 'web-photo-filter-context'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
