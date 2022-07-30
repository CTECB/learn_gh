import { updateTestManagementRecord } from '../test-management/src/test-result-handler';
import { TEST_MANAGEMENT_APP } from '@configs/test-conf';

(async () => {
  let testResult: string = '';
  switch (process.env.TEST_RESULT) {
    case 'success':
      testResult = '🟢 success';
      break;
    case 'failure':
      testResult = '🔴 failure';
      break;
    case 'cancelled':
      testResult = '🟡 cancelled';
      break;
  }

  const data = {
    workflowRunNumber: process.env.WORKFLOW_RUN_NUMBER,
    status: testResult,
    runResult: testResult,
    executionTime: process.env.EXECUTION_TIME,
    workflowRunUrl: process.env.GITHUB_RUN_URL,
    allureReportUrl: process.env.ALLURE_REPORT_URL,
    allureResultFailure: process.env.ALLURE_RESULT_FAILURE
  };
  try {
    const selectedPlugin = process.env.KINTONE_PLUGIN;
    await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, data, selectedPlugin, 'add');
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();