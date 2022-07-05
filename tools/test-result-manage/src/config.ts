export const FIELD_CODES = {
  btnCustomRun: 'btnCustomRun',
  ddlTestStatus: 'ddlTestStatus',
  tblTestHistory: 'tblTestHistory',
  historyWorkflowRunNumber: 'historyWorkflowRunNumber',
  executionTime: 'executionTime',
  txtWorkflowRunUrl: 'txtWorkflowRunUrl',
  ddlRunResult: 'ddlRunResult',
};

export const TEST_MANAGEMENT_APP = {
  kintoneURL: process.env.TEST_MANAGEMENT_KINTONE_URL || 'https://haula.kintone.com',
  appId: process.env.TEST_MANAGEMENT_APP_ID || '101',
  apiToken: process.env.TEST_MANAGEMENT_APP_API_TOKEN || 'G3lCTEhs8nFo8i7X0JYZ4K4l7Ndarhqd8xO5xvxc',
  pluginName: process.env.KINTONE_PLUGIN || 'multiTab'
};
