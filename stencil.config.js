exports.config = {
  namespace: 'webphotofilter',
  generateDistribution: true,
  bundles: [
    { components: ['web-photo-filter'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
