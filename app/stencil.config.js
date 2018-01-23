exports.config = {
  bundles: [
    { components: ['subdomain-registry-app', 'subdomain-registrations'] } 
  ],
  collections: [
    { name: '@stencil/router' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
