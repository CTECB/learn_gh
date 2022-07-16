import { KintoneRestAPIClient } from '@kintone/rest-api-client';

export const isPreparation = process.env.IS_PREPARATION || false;

export const TEST_MANAGEMENT_APP = {
  baseUrl: process.env.TEST_MANAGEMENT_BASE_URL || 'https://test-management-site.kintone.com',
  appId: process.env.TEST_MANAGEMENT_APP_ID || 'appId',
  apiToken: process.env.TEST_MANAGEMENT_APP_API_TOKEN || 'apiToken',
};

export const TESTING_SITE_INFO = {
  baseUrl: process.env.TESTING_SITE_BASE_URL || 'https://testing-site.kintone.com',
  credentials: {
    username: process.env.TESTING_SITE_USERNAME || 'username',
    password: process.env.TESTING_SITE_PASSWORD || 'password',
  }
};

const PLUGINS = {
  multiTab: {
    name: 'Multi Tab Plugin',
    id: 'hjimeoiicpfillgjebafbijognopkcfn',
    version: '3.2.1',
    testingAppId: '',
  },
  conditionalDisplay: {
    name: 'Conditional Display Plugin',
    id: '<id>',
    version: '<version>',
    testingAppId: '',
  },
};

export const getTestingAppId = async (plugin) => {
  let testingAppId;
  if (isPreparation) {
    console.log('prepare');
  } else {
    const kintoneClient = new KintoneRestAPIClient({
      baseUrl: TEST_MANAGEMENT_APP.baseUrl,
      auth: { apiToken: TEST_MANAGEMENT_APP.apiToken },
    });

    const queryByPlugin = `ddlPluginName in ("${plugin}")`;
    const pluginRecord = (await kintoneClient.record.getRecords({ app: TEST_MANAGEMENT_APP.appId, query: queryByPlugin })).records[0];
    console.log('pluginRecord: ---- ', pluginRecord);
    const recordNumber = pluginRecord['Record_number'].value;

    const { record } = await kintoneClient.record.getRecord({
      app: TEST_MANAGEMENT_APP.appId,
      // @ts-ignore
      id: recordNumber,
    });
    const testingAppUrl = record['txtTestingAppUrl'].value;
    if (testingAppUrl !== '')
    {
      // @ts-ignore
      testingAppId = testingAppUrl.match(/(?<=k\/)\d+/)[0];
    }
  }
  return testingAppId;
};

export const getPluginInfo = async () => {
  const plugins = PLUGINS;
  for (const [key, value] of Object.entries(plugins)) {
    if (value.testingAppId === '') {
      value.testingAppId = await getTestingAppId(key);
    }
  }
  return plugins;
};
