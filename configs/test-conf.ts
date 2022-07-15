import { KintoneRestAPIClient } from '@kintone/rest-api-client';

export const testingSiteDomain = process.env.TESTING_SITE_DOMAIN || '<teting_site>';

export const credentials = {
  username: process.env.TESTING_SITE_USERNAME || '<username>',
  password: process.env.TESTING_SITE_PASSWORD || '<password>',
};

export const isPreparation = process.env.IS_PREPARATION || false;

export const getTestingAppId = async (plugin) => {
  let testingAppId;
  if (isPreparation) {
    console.log('prepare');
  } else {
    const kintoneClient = new KintoneRestAPIClient({
      baseUrl: process.env.TEST_MANAGEMENT_KINTONE_URL,
      auth: { apiToken: process.env.TEST_MANAGEMENT_APP_API_TOKEN },
    });

    const queryByPlugin = `ddlPluginName in ("${plugin}")`;
    // @ts-ignore
    const pluginRecord = (await kintoneClient.record.getRecords({ app: process.env.TEST_MANAGEMENT_APP_ID, query: queryByPlugin })).records[0];
    console.log('pluginRecord: ---- ', pluginRecord);
    const recordNumber = pluginRecord['Record_number'].value;

    const { record } = await kintoneClient.record.getRecord({
      // @ts-ignore
      app: process.env.TEST_MANAGEMENT_APP_ID,
      // @ts-ignore
      id: recordNumber,
    });
    const testingAppUrl = record['txtTestingAppUrl'].value;
    console.log('testingAppUrl: ---- ', testingAppUrl);
    // @ts-ignore
    testingAppId = testingAppUrl.match(/(?<=k\/)\d+/);
    console.log('testingAppId: ---- ', testingAppId);
  }
  return testingAppId;
};

export const plugins = {
  multiTab: {
    name: 'Multi Tab Plugin',
    id: 'hjimeoiicpfillgjebafbijognopkcfn',
    version: '3.2.1',
    testingAppId: process.env.MULTI_TAB_APP || getTestingAppId('multiTab'),
  },
  conditionalDisplay: {
    name: 'Conditional Display Plugin',
    id: '<id>',
    version: '<version>',
    testingAppId: process.env.CONDITIONAL_DISPLAY_APP || getTestingAppId('conditionalDisplay'),
  },
};
