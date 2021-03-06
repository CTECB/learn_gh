import { KintoneRestAPIClient, KintoneRestAPIError } from '@kintone/rest-api-client';
import { FIELD_CODES } from './config';
import { TEST_MANAGEMENT_APP } from '../../../configs/test-conf';

const kintoneRestApiClient = new KintoneRestAPIClient({
  baseUrl: TEST_MANAGEMENT_APP.baseUrl,
  auth: { apiToken: TEST_MANAGEMENT_APP.apiToken },
});

export const updateTestManagementRecord = async (appId: string, data: any, selectedPlugin: string | undefined, action: string = '') => {
  const queryByPlugin = `ddlPluginName in ("${selectedPlugin}")`;
  const pluginRecord = (await kintoneRestApiClient.record.getRecords({ app: appId, query: queryByPlugin })).records[0];

  const historyTable: any = pluginRecord[FIELD_CODES.tblTestHistory].value;
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
          'rtxFailureStacktrace': { value: data.allureResultFailure },
          'executionTime': { value: data.executionTime },
        }
    };
    historyTable.unshift(newHistoryRow);
  }

  const recordData: any = {
    tblTestHistory: { value: historyTable },
  };
  if (data.status !== undefined) {
    recordData.ddlTestStatus = { value: data.status };
  }
  if (data.testingAppUrl !== undefined) {
    recordData.txtTestingAppUrl = { value: data.testingAppUrl };
  }

  try {
    const record = await kintoneRestApiClient.record.updateRecord({
      app: appId,
      // @ts-ignore
      id: pluginRecord.$id.value,
      record: recordData,
    });
    console.log('[updateTestManagementRecord] data: ----- \n', record);

    return record;
  } catch (e) {
    if (e instanceof KintoneRestAPIError) {
      e.headers = {};
    }
    throw e;
  }
};
