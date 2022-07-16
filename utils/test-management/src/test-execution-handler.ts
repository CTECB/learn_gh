import { Button, Notification, Spinner, Dropdown } from 'kintone-ui-component';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Octokit } from '@octokit/core';
import { triggerPluginTestWorkflow } from './github-handler';
import { updateTestManagementRecord } from './test-result-handler';
import { getPluginInfo, TEST_MANAGEMENT_APP, TESTING_SITE_INFO } from '../../../configs/test-conf';
import { createAppFromJsonObject } from '../../kintoneAPIs/appUtil';
import { getFormFieldsAndLayoutJsonObject } from '../../kintoneAPIs/recordUtil';

const octokit = new Octokit({
  auth: process.env.PAT || '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'
});

const kintoneRestApiClient = new KintoneRestAPIClient({
  baseUrl: TEST_MANAGEMENT_APP.baseUrl,
  auth: { apiToken: TEST_MANAGEMENT_APP.apiToken },
});

const testingAppAPIClient = new KintoneRestAPIClient({
  baseUrl: TESTING_SITE_INFO.baseUrl,
  auth: TESTING_SITE_INFO.credentials,
});

kintone.events.on(['app.record.index.show'], async (event: any) => {
  await handleTestExecutionAtIndexScreen(octokit, event);
});

kintone.events.on(['app.record.detail.show'], async (event: any) => {
  await handleTestExecutionAtDetailsScreen(octokit, event);
});

// TODO: handling test execution is still in-progress
const handleTestExecutionAtIndexScreen = async (octokit: Octokit, event: any) => {
  const pluginDropdown = _createPluginDropdownList();
  const runTestButton = _createRunTestButton();
  runTestButton.addEventListener('click', async () => {
    await _handleIndexScreenRunTestButtonListener(octokit, pluginDropdown, runTestButton);
  });

  const headerSpace = kintone.app.getHeaderMenuSpaceElement();
  headerSpace?.appendChild(pluginDropdown);
  headerSpace?.appendChild(runTestButton);

  setTimeout(() => {
    _setIndexScreenComponentCSS();
  }, 0);
};

const handleTestExecutionAtDetailsScreen = async (octokit: Octokit, event: any) => {
  const selectedPlugin = event.record.ddlPluginName.value;
  const runTestButton = _createRunTestButton(event);
  runTestButton.addEventListener('click', async () => {
    const formFieldLayoutJsonObject = await getFormFieldsAndLayoutJsonObject(kintoneRestApiClient, event.appId, event.recordId);
    const createdApp = await createAppFromJsonObject(testingAppAPIClient, `[Plugin] ${selectedPlugin}`, 2, formFieldLayoutJsonObject.formFieldsJsonObject, formFieldLayoutJsonObject.formLayoutJsonObject);
    const testingAppUrl = `${TESTING_SITE_INFO.baseUrl}/k/${createdApp.app}`;

    await _runTestFlow(octokit, selectedPlugin, runTestButton, false, testingAppUrl);
  });

  const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
  headerSpace?.appendChild(runTestButton);

  setTimeout(() => {
    _setDetailScreenRunTestButtonCSS();
  }, 0);
};

const _handleIndexScreenRunTestButtonListener = async (octokit: Octokit, pluginDropdown: Dropdown, runTestButton: Button) => {
  if (pluginDropdown.value === '') {
    pluginDropdown.error = 'Please select plugin';
  } else {
    await _runTestFlow(octokit, pluginDropdown.value, runTestButton, true);
  }
};

const _runTestFlow = async (octokit: Octokit, selectedPlugin: string, runTestButton: Button, isIndexScreen = false, testingAppUrl: string | undefined = undefined) => {
  const spinner = new Spinner({ text: 'Trigger test' });
  spinner.open();
  const data: any = { status: 'running' };
  if (testingAppUrl !== undefined) {
    data.testingAppUrl = testingAppUrl;
  }
  try {
    await triggerPluginTestWorkflow(octokit, selectedPlugin);
    await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, data, selectedPlugin);

    if (runTestButton !== undefined) {
      runTestButton.disabled = true;
    }
    if (!isIndexScreen) {
      setTimeout(() => {
        location.reload();
      }, 4000);
      const info = new Notification({
        text: 'Github Workflow has been triggered for testing. Please reload page after a couple minutes',
        type: 'info'
      });
      info.open();
    } else {
      await _openPluginRecordUrl(selectedPlugin);
    }
  } catch (e: any) {
    const errorMsg = new Notification({
      text: `An error occurred while triggering workflow job!\n[${e.message}]`,
      type: 'danger'
    });
    errorMsg.open();
  }
  spinner.close();
};

const _openPluginRecordUrl = async (selectedPlugin: string) => {
  const queryByPlugin = `ddlPluginName in ("${selectedPlugin}")`;
  const pluginRecord = (await kintoneRestApiClient.record.getRecords({ app: TEST_MANAGEMENT_APP.appId, query: queryByPlugin })).records[0];
  const recordNumber = pluginRecord.Record_number.value;
  const pluginRecordUrl = `${TEST_MANAGEMENT_APP.baseUrl}/k/${TEST_MANAGEMENT_APP.appId}/show#record=${recordNumber}`;
  await window.open(`${pluginRecordUrl}`, '_self');
};

const _createRunTestButton = (recordEvent: any = undefined) => {
  const button = new Button({ className: 'run-test-btn', text: 'Run test', type: 'submit' });
  if (recordEvent !== undefined) {
    const ddlTestStatusValue = recordEvent.record.ddlTestStatus.value;
    if (ddlTestStatusValue === 'running') {
      button.disabled = true;
    }
  }

  return button;
};

const _createPluginDropdownList = () => {
  const pluginList = Object.keys(getPluginInfo);
  const items = pluginList.map(value => {
    return { label: value, value: value };
  });

  const dropdownList = new Dropdown({
    className: 'plugin-list-dropdown',
    label: 'Plugin: ',
    items: items,
  });

  dropdownList.addEventListener('change', () => {
    dropdownList.error = '';
    if (dropdownList.value === '') {
      dropdownList.error = 'Please select plugin';
    }
  });

  return dropdownList;
};

const _setIndexScreenComponentCSS = () => {
  const cssDDLPlugin = document.querySelector('.plugin-list-dropdown') as HTMLElement;
  cssDDLPlugin.style.width = '270px';
  cssDDLPlugin.style.marginRight = '10px';
  cssDDLPlugin.style.display = 'inline-block';
  cssDDLPlugin.style.marginTop = '5px';

  const cssDDLGroup = document.querySelector('.plugin-list-dropdown .kuc-dropdown__group') as HTMLElement;
  cssDDLGroup.style.padding = '2.5px';
  cssDDLGroup.style.display = '-webkit-box';

  const cssDDLLabel = document.querySelector('.plugin-list-dropdown .kuc-dropdown__group .kuc-dropdown__group__label') as HTMLElement;
  cssDDLLabel.style.lineHeight = '30px';
  cssDDLLabel.style.marginRight = '6px';
  cssDDLLabel.style.fontSize = '16px';

  const cssDDLToggle = document.querySelector('.kuc-dropdown__group__toggle') as HTMLElement;
  cssDDLToggle.style.width = '215px';

  const cssDDLItemList = document.querySelector('.kuc-dropdown__group ul.kuc-dropdown__group__select-menu') as HTMLElement;
  cssDDLItemList.style.top = '43px';
  cssDDLItemList.style.left = '54px';

  const cssDDLError = document.querySelector('.kuc-dropdown__group .kuc-dropdown__group__error') as HTMLElement;
  cssDDLError.style.position = 'absolute';
  cssDDLError.style.top = '40px';
  cssDDLError.style.left = '55px';
  cssDDLError.style.width = 'inherit';
  cssDDLError.style.zIndex = '1';

  const cssRunTestBtn = document.querySelector('.run-test-btn') as HTMLElement;
  cssRunTestBtn.style.marginTop = '2px';
};

const _setDetailScreenRunTestButtonCSS = () => {
  const cssRunTestBtn = document.querySelector('.run-test-btn') as HTMLElement;
  cssRunTestBtn.style.position = 'absolute';
  cssRunTestBtn.style.top = '55px';
  cssRunTestBtn.style.left = '20px';
  cssRunTestBtn.style.zIndex = '1';
};
