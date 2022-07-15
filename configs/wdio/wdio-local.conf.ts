import merge from 'deepmerge';
let { config } = require('@configs/wdio/wdio-shared.conf.ts');

config = merge(
  config, {
    capabilities: [{
      maxInstances: 1,
      browserName: 'chrome',
      acceptInsecureCerts: true
    }],
    services: [
      [
        'selenium-standalone',
        { skipSeleniumInstall: false }
      ]],
    // 'image-comparison'],
  },
  { clone: false }
);

exports.config = config;