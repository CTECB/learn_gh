import merge from 'deepmerge';
let { config } = require('@configs/wdio/wdio-shared.conf.ts');

config = merge(
  config, {
    capabilities: [{
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: ['--headless', '--disable-gpu', 'no-sandbox', '--window-size=1920,1080'],
      },
      acceptInsecureCerts: true
    }],
  },
  { clone: false }
);

exports.config = config;