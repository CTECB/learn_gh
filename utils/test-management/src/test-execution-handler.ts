import { Button, Notification, Spinner, Dropdown } from 'kintone-ui-component';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Octokit } from '@octokit/core';
import { triggerPluginTestWorkflow } from './github-handler';
import { updateTestManagementRecord } from './test-result-handler';
import { createAppFromJsonObject } from '../../kintoneAPIs/appUtil';
import { getFormFieldsAndLayoutJsonObject, getTestingAppURL } from '../../kintoneAPIs/recordUtil';
import { getPluginInfo, TEST_MANAGEMENT_APP, TESTING_SITE_INFO, GIT_PAT } from '../../../configs/test-conf';

const octokit = new Octokit({ auth: GIT_PAT });

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
  const pluginDropdown = await _createPluginDropdownList();
  const runTestButton = _createRunTestButton();
  runTestButton.addEventListener('click', async () => {
    await _handleIndexScreenRunTestButtonListener(octokit, pluginDropdown, runTestButton, event);
  });

  const headerSpace = kintone.app.getHeaderMenuSpaceElement();
  headerSpace?.appendChild(pluginDropdown);
  headerSpace?.appendChild(runTestButton);

  setTimeout(() => {
    _setIndexScreenComponentCSS();
  }, 0);
};

const handleTestExecutionAtDetailsScreen = async (octokit: Octokit, event: any) => {
  const executionModeDropdown = _createExecutionModeDropdown();
  const runTestButton = _createRunTestButton(event);
  runTestButton.addEventListener('click', async () => {
    const selectedPlugin = event.record.ddlPluginName.value;
    await _runTestFlow(octokit, selectedPlugin, runTestButton, true, event, executionModeDropdown.value);
  });

  const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
  headerSpace?.appendChild(executionModeDropdown);
  headerSpace?.appendChild(runTestButton);

  setTimeout(() => {
    // _setDetailScreenRunTestButtonCSS();
    _setDetailScreenComponentCSS();
  }, 0);
};

const _handleTestingAppPreparation = async (event: any, selectedPlugin: string, executionMode: string, isDetailScreen: boolean = true) => {
  let testingAppUrl = '';
  if (executionMode === 'TEST_ONLY') {
    if (isDetailScreen) {
      testingAppUrl = await getTestingAppURL(kintoneRestApiClient, event.appId, event.recordId);
    } else {
      const queryByPlugin = `ddlPluginName in ("${selectedPlugin}")`;
      const pluginRecord = (await kintoneRestApiClient.record.getRecords({ app: TEST_MANAGEMENT_APP.appId, query: queryByPlugin })).records[0];
      testingAppUrl = await getTestingAppURL(kintoneRestApiClient, TEST_MANAGEMENT_APP.appId, pluginRecord['$id'].value);
    }
  } else {
    const formFieldLayoutJsonObject = await getFormFieldsAndLayoutJsonObject(kintoneRestApiClient, event.appId, event.recordId);
    const createdApp = await createAppFromJsonObject(testingAppAPIClient, `[Plugin] ${selectedPlugin}`, 2, formFieldLayoutJsonObject.formFieldsJsonObject, formFieldLayoutJsonObject.formLayoutJsonObject);
    testingAppUrl = `${TESTING_SITE_INFO.baseUrl}/k/${createdApp.app}`;
  }

  return testingAppUrl;
};

const _handleIndexScreenRunTestButtonListener = async (octokit: Octokit, pluginDropdown: Dropdown, runTestButton: Button, event: any) => {
  if (pluginDropdown.value === '') {
    pluginDropdown.error = 'Please select plugin';
  } else {
    await _runTestFlow(octokit, pluginDropdown.value, runTestButton, false, event);
  }
};

const _runTestFlow = async (octokit: Octokit, selectedPlugin: string, runTestButton: Button, isDetailScreen = true, event: any | undefined = undefined, executionMode = 'TEST_ONLY') => {
  const spinner = new Spinner({ text: `Trigger - ${executionMode}` });
  spinner.open();
  const data: any = { };

  try {
    const testingAppUrl = await _handleTestingAppPreparation(event, selectedPlugin, executionMode, isDetailScreen);
    if (testingAppUrl === '') {
      throw Error('There is no testing app. Please prepare testing app!');
    }
    data.testingAppUrl = testingAppUrl;

    if (executionMode !== 'PREPARATION_ONLY') {
      data.status = '🟣 running';
      if (runTestButton !== undefined) {
        runTestButton.disabled = true;
      }
      await triggerPluginTestWorkflow(octokit, selectedPlugin);
    }
    await updateTestManagementRecord(TEST_MANAGEMENT_APP.appId, data, selectedPlugin);

    if (isDetailScreen) {
      setTimeout(() => {
        location.reload();
      }, 4000);
      if (executionMode !== 'PREPARATION_ONLY') {
        const info = new Notification({
          text: 'Github Workflow has been triggered for testing!',
          type: 'info'
        });
        info.open();
      }
    } else {
      await _openPluginRecordUrl(selectedPlugin);
    }
  } catch (e: any) {
    const errorMsg = new Notification({
      text: `An error occurred while triggering ${executionMode} execution!\n[${e.message}]`,
      type: 'danger'
    });
    errorMsg.open();
  }
  spinner.close();
};

const _openPluginRecordUrl = async (selectedPlugin: string) => {
  const queryByPlugin = `ddlPluginName in ("${selectedPlugin}")`;
  const pluginRecord = (await kintoneRestApiClient.record.getRecords({ app: TEST_MANAGEMENT_APP.appId, query: queryByPlugin })).records[0];
  const recordNumber = pluginRecord['$id'].value;
  const pluginRecordUrl = `${TEST_MANAGEMENT_APP.baseUrl}/k/${TEST_MANAGEMENT_APP.appId}/show#record=${recordNumber}`;
  await window.open(`${pluginRecordUrl}`, '_self');
};

const _createRunTestButton = (recordEvent: any = undefined) => {
  const button = new Button({ className: 'run-test-btn', text: '▶️ Run', type: 'submit' });
  if (recordEvent !== undefined) {
    const ddlTestStatusValue = recordEvent.record.ddlTestStatus.value;
    if (ddlTestStatusValue === '🟣 running') {
      button.disabled = true;
    }
  }

  return button;
};

const _createPluginDropdownList = async () => {
  const plugin = await getPluginInfo();
  const pluginList = Object.keys(plugin);
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

const _createExecutionModeDropdown = () => {
  return new Dropdown({
    className: 'execution-mode-dropdown',
    label: 'Execution mode: ',
    items: [
      { label: 'Test only', value: 'TEST_ONLY' },
      { label: 'App preparation only', value: 'PREPARATION_ONLY' },
      { label: 'Preparation and Test', value: 'ALL' },
    ],
    value: 'TEST_ONLY',
  });
};

const _setIndexScreenComponentCSS = () => {
  const cssDDLPlugin = document.querySelector('.plugin-list-dropdown') as HTMLElement;
  cssDDLPlugin.style.width = '270px';
  cssDDLPlugin.style.display = 'inline-block';
  cssDDLPlugin.style.marginRight = '10px';
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

const _setDetailScreenComponentCSS = () => {
  const cssDDLPlugin = document.querySelector('.execution-mode-dropdown') as HTMLElement;
  cssDDLPlugin.style.position = 'absolute';
  cssDDLPlugin.style.display = 'inline-block';
  cssDDLPlugin.style.left = '20px';
  cssDDLPlugin.style.top = '58px';
  cssDDLPlugin.style.zIndex = '1';

  const cssDDLGroup = document.querySelector('.execution-mode-dropdown .kuc-dropdown__group') as HTMLElement;
  cssDDLGroup.style.padding = '2.5px';
  cssDDLGroup.style.display = '-webkit-box';

  const cssDDLLabel = document.querySelector('.execution-mode-dropdown .kuc-dropdown__group .kuc-dropdown__group__label') as HTMLElement;
  cssDDLLabel.style.lineHeight = '30px';
  cssDDLLabel.style.marginRight = '6px';
  cssDDLLabel.style.fontSize = '16px';

  const cssDDLToggle = document.querySelector('.kuc-dropdown__group__toggle') as HTMLElement;
  cssDDLToggle.style.width = '215px';

  const cssDDLItemList = document.querySelector('.kuc-dropdown__group ul.kuc-dropdown__group__select-menu') as HTMLElement;
  cssDDLItemList.style.top = '43px';
  cssDDLItemList.style.left = '124px';

  const cssDDLError = document.querySelector('.kuc-dropdown__group .kuc-dropdown__group__error') as HTMLElement;
  cssDDLError.style.position = 'absolute';
  cssDDLError.style.top = '40px';
  cssDDLError.style.left = '55px';
  cssDDLError.style.width = 'inherit';
  cssDDLError.style.zIndex = '1';

  const cssRunTestBtn = document.querySelector('.run-test-btn') as HTMLElement;
  cssRunTestBtn.style.position = 'absolute';
  cssRunTestBtn.style.top = '55px';
  cssRunTestBtn.style.left = '370px';
  cssRunTestBtn.style.zIndex = '1';
};
