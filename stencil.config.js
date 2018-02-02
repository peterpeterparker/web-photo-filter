exports.config = {
  namespace: 'webphotofiltercomponent',
  generateDistribution: true,
  bundles: [
    { components: ['web-photo-filter-component'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
