import { FIELD_CODES, TEST_MANAGEMENT_APP } from './config';
import { KintoneRestAPIClient, KintoneRestAPIError } from '@kintone/rest-api-client';

const kintoneRestApiClient = new KintoneRestAPIClient({
  baseUrl: TEST_MANAGEMENT_APP.kintoneURL || 'https://haula.kintone.com',
  auth: { apiToken: TEST_MANAGEMENT_APP.apiToken || 'G3lCTEhs8nFo8i7X0JYZ4K4l7Ndarhqd8xO5xvxc' },
});

export const updateTestManagementRecord = async (appId: string, data: any, action: string = '') => {
  const queryByPlugin = `ddlPluginName in ("${TEST_MANAGEMENT_APP.pluginName}")`;
  const pluginRecord = (await kintoneRestApiClient.record.getRecords({ app: appId, query: queryByPlugin })).records[0];

  const historyTable: any = pluginRecord[FIELD_CODES.tblTestHistory].value;
  console.log('history: ----- ', historyTable);
  if (action === 'add') {
    if (historyTable.length === 5) {
      historyTable.pop();
    }
    const newHistoryRow = {
      'value':
        {
          'historyWorkflowRunNumber': { value: data.workflowRunNumber },
          'ddlRunResult': { value: data.runResult },
          'txtWorkflowRunUrl': { value: data.workflowRunUrl },
          'txtAllureReportUrl': { value: data.allureReportUrl },
          'executionTime': { value: data.executionTime },
        }
    };
    historyTable.unshift(newHistoryRow);
    console.log('new history: ----- ', historyTable);
  }

  try {
    const record = await kintoneRestApiClient.record.updateRecord({
      app: appId,
      // @ts-ignore
      id: pluginRecord.$id.value,
      record: {
        ddlTestStatus: { value: data.status },
        tblTestHistory: {
          value: historyTable,
        },
      },
    });
    console.log('record: ----- ', record);

    return record;
  } catch (e) {
    if (e instanceof KintoneRestAPIError) {
      e.headers = {};
    }
    throw e;
  }
};
