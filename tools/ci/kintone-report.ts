import { updateTestManagementRecord } from '../test-result-manage/src/test-result-handler';
import { TEST_MANAGEMENT_APP } from '../test-result-manage/src/config';

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
    await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, data, 'add');
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();