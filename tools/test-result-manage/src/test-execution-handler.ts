import { Button, Notification, Spinner } from 'kintone-ui-component';
import { FIELD_CODES, TEST_MANAGEMENT_APP } from './config';
import { triggerPluginTestWorkflow } from './github-handler';
import { Octokit } from '@octokit/core';
import { updateTestManagementRecord } from './test-result-handler';

kintone.events.on(['app.record.detail.show'], async (event: any) => {
  const octokit = new Octokit({
    auth: process.env.PAT || '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'
  });
  await handleTestExecution(octokit, event);
});

const handleTestExecution = async (octokit: Octokit, event: any) => {
  const btnRunTestElm = document.getElementById(`user-js-${FIELD_CODES.btnCustomRun}`);
  const btnRunTest = new Button({ text: 'Run test', type: 'submit' });
  if (event.record.ddlTestStatus.value === 'running') {
    btnRunTest.disabled = true;
  }

  btnRunTest.addEventListener('click', async () => {
    const spinner = new Spinner({ text: 'Trigger test' });
    spinner.open();
    try {
      const selectedPlugin = event.record.ddlPluginName.value;
      await triggerPluginTestWorkflow(octokit, selectedPlugin);
      await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, { status: 'running' });
      btnRunTest.disabled = true;
      setTimeout(()=> {
        location.reload();
      }, 4000);
      const info = new Notification({
        text: 'Github Workflow has been triggered for testing. Please reload page after a couple minutes', type: 'info'
      });
      info.open();
    } catch (e) {
      const errorMsg = new Notification({
        // @ts-ignore
        text: `An error occurred while triggering workflow job!\n[${e.message}]`, type: 'danger'
      });
      errorMsg.open();
    }
    spinner.close();
  });
  // @ts-ignore
  btnRunTestElm.appendChild(btnRunTest);
};