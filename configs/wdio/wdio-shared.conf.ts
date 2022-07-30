import { desktopSuites } from '@configs/wdio/desktop-suites';
import { getTestSpecs } from '@configs/wdio/getTestSpecs';
import { TESTING_SITE_INFO } from '@configs/test-conf';

const GRID = process.env.GRID || 'localhost:4444';
const GRID_PATHS = GRID.split(':');
const GRID_HOST = GRID_PATHS[0];
const GRID_PORT = GRID.includes(':') ? parseInt(GRID_PATHS[1], 10) : 4444;

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
  baseUrl: TESTING_SITE_INFO.baseUrl,
  waitforTimeout: 10000,
  connectionRetryTimeout: 150000,
  connectionRetryCount: 3,

  maxInstances: 1,
  capabilities: [] as any,
  framework: 'mocha',
  reporters: [
    'spec',
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
    timeout: 240000,
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
