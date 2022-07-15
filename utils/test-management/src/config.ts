export const FIELD_CODES = {
  btnCustomRun: 'btnCustomRun',
  ddlTestStatus: 'ddlTestStatus',
  tblTestHistory: 'tblTestHistory',
  historyWorkflowRunNumber: 'historyWorkflowRunNumber',
  executionTime: 'executionTime',
  txtWorkflowRunUrl: 'txtWorkflowRunUrl',
  ddlRunResult: 'ddlRunResult',
  txtTestingAppUrl: 'ddlRunResult',
};

export const TEST_MANAGEMENT_APP = {
  kintoneURL: process.env.TEST_MANAGEMENT_KINTONE_URL || '<url>',
  appId: process.env.TEST_MANAGEMENT_APP_ID || '<id>',
  apiToken: process.env.TEST_MANAGEMENT_APP_API_TOKEN || '<token>',
};
