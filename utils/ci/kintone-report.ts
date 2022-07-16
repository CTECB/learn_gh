import { updateTestManagementRecord } from '../test-management/src/test-result-handler';
import { TEST_MANAGEMENT_APP } from '@configs/test-conf';

(async () => {
  const data = {
    workflowRunNumber: process.env.WORKFLOW_RUN_NUMBER,
    status: process.env.TEST_RESULT,
    runResult: process.env.TEST_RESULT,
    executionTime: process.env.EXECUTION_TIME,
    workflowRunUrl: process.env.GITHUB_RUN_URL,
    allureReportUrl: process.env.ALLURE_REPORT_URL,
  };
  try {
    const selectedPlugin = process.env.KINTONE_PLUGIN;
    await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, data, selectedPlugin, 'add');
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();