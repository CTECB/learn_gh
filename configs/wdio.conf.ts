import { desktopSuites } from '@configs/desktop-suites';
import { getTestSpecs } from '@configs/getTestSpecs';

const GRID = process.env.GRID || 'localhost:4444';
const GRID_PATHS = GRID.split(':');
const GRID_HOST = GRID_PATHS[0];
const GRID_PORT = GRID.includes(':') ? parseInt(GRID_PATHS[1], 10) : 4444;
// const drivers = {
//   chrome: { version: process.env.CHROMEDRIVER_VERSION }, // https://chromedriver.chromium.org/
// };

export const config: WebdriverIO.Config = {
  protocol: 'http',
  hostname: GRID_HOST,
  port: GRID_PORT,
  path: '/wd/hub',

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.json',
      require: ['tsconfig-paths/register'],
    }
  },
  specs: getTestSpecs(desktopSuites),
  // @ts-ignore
  suites: desktopSuites,

  logLevel: 'info',
  bail: 0,
  baseUrl: 'https://haula.kintone.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  maxInstances: 1,
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
  services: [
    // ['selenium-standalone',
    //   {
    //     skipSeleniumInstall: false,
    //   },
    //   // {
    //   //   installArgs: { drivers },
    //   //   args: { drivers } // drivers to use
    //   // }
    // ],
    'image-comparison'],
  framework: 'mocha',
  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
      },
    ],
    [
      'allure',
      {
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
    extension: ['ts'],
    grep: process.env.TEST_FILTER,
  },
  before: async (capabilities, specs, browser) => {
    await browser.setWindowSize(1200, 800);
  },
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};
