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
  kintoneURL: process.env.TEST_MANAGEMENT_KINTONE_URL || 'https://sdd-demo.cybozu.com',
  appId: process.env.TEST_MANAGEMENT_APP_ID || '1282',
  apiToken: process.env.TEST_MANAGEMENT_APP_API_TOKEN || 'yqBptSVGRYfoCGPyT4q6vzKVToI7Y7aR9MeeTx0y',
  pluginName: process.env.KINTONE_PLUGIN || 'multiTab'
};
