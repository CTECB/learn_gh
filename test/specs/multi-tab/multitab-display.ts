import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { AppSettingPage } from '@pages/common/AppSetting';
import { PluginConfigPage } from '@pages/multi-tab/PluginConfig';
import { RecordAddPage } from '@pages/multi-tab/RecordAdd';
import { RecordViewPage } from '@pages/multi-tab/RecordView';
import { credentials, plugins, testingApps, testingSiteDomain } from '@configs/test-conf';
import { KintoneFormFieldProperty, KintoneRestAPIClient } from '@kintone/rest-api-client';

const appSettingUrl = `k/admin/app/${testingApps.multiTab}/plugin/#/`;
const recordAddUrl = `k/${testingApps.multiTab}/edit`;

describe('Multi-Tab - Display', () => {
  before('Login', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.login(credentials);
    if (await SystemPluginSettingPage.elmPluginItem.length > 0) {
      await SystemPluginSettingPage.removePlugin();
    }
    await SystemPluginSettingPage.addPluginById(plugins.multiTab.id);
  });

  it.only('Display_001 - Verify multi-tab display correctly if the number of tabs greater than 1', async () => {
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.selectStartTabItem(1, 'blank_space_start_1');
    await PluginConfigPage.selectEndTabItem(1, 'blank_space_end_1');

    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await SystemPluginSettingPage.elmSettingNav.click();
    await AppSettingPage.updateApp();

    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.login(credentials);
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_001_Tab1.html');
    await RecordAddPage.clickTab('blank_space_tab2');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_001_Tab2.html');
    await RecordAddPage.clickTab('blank_space_tab3');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_001_Tab3.html');
    await RecordAddPage.clickTab('blank_space_tab4');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_001_Tab4.html');
    await RecordAddPage.clickTab('blank_space_tab5');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_001_Tab5.html');

    // Input data to some fields then verify values of each tab at detail screen
    await RecordAddPage.clickTab('blank_space_tab1');
    await RecordAddPage.inputTab1Data();
    await RecordAddPage.clickSaveBtn();
    await RecordViewPage.verifyHTLMContent('RecordViewDisplay_001_Tab1.html');
  });

  it('Display_002 - Verify default tab can be changed and display correctly', async () => {
    // Setting default tab again in setting plugin screen
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.setDefaultTabs(1, 2);
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.elmSettingNav.click();
    await AppSettingPage.updateApp();

    // Check default tab in user screen
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab2');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_002_Tab2.html');
  });

  it('Display_003 - Verify "Remember last selected tab" feature work correctly', async () => {
    console.log('test 3');
  });

  it('Display_004 - Verify multi-tab display correctly if there is multiple sections of multi-tab', async () => {
    // Setting:
    // - Add new 1 tab section
    // - Default tab & Remember last selected tab
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.clickAddSectionIcon();
    await PluginConfigPage.selectStartTabItem(2, 'blank_space_start_2');
    await PluginConfigPage.selectEndTabItem(2, 'blank_space_end_2');
    await PluginConfigPage.setDefaultTabs(2, 3);
    // TODO: Enable remember last selected tab

    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.elmSettingNav.click();
    await AppSettingPage.updateApp();

    // Verify HTML of 2 multiple-tab sections
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab8');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_004.html');

    // Verify default tab of 2 sections

    // Verify last selected tab of 2 sections
  });

  it('Display_005 - Verify multi-tab display correctly if there is only 1 tab', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await RecordAddPage.login(credentials);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.setEnableTabs(1, [2, 3, 4, 5], false);
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.elmSettingNav.click();
    await AppSettingPage.updateApp();

    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_005.html');
  });

  it('Display_006 - Verify multi-tab display correctly if there is new field added to any tab', async () => {

    await addFormField();
    console.log('test 6');
  });

  it('Display_007 - Verify multi-tab display correctly if there is a field removed out of to any tab', async () => {
    console.log('test 7');
  });

  after('Log out', async () => {
    await SystemPluginSettingPage.open('/logout');
  });
});

const addFormField = async () => {
  const kintoneRestApiClient = new KintoneRestAPIClient({
    baseUrl: testingSiteDomain,
    auth: { apiToken: plugins.multiTab.testingAppToken },
  });

  const newField: KintoneFormFieldProperty.SingleLineText = {
    'type': 'SINGLE_LINE_TEXT',
    'code': 'Text__single_line_1',
    'label': 'Added Filed - Text 3',
    'noLabel': false,
    'required': true,
    'unique': true,
    'maxLength': '64',
    'minLength': '0',
    'defaultValue': '',
    'expression': '',
    'hideExpression': false
  };

  try {
    console.log('This is test addFormFields: --- ', await kintoneRestApiClient.app.addFormFields({
      app: plugins.multiTab.testingAppId,
      properties: { Text__single_line_1: newField },
    }));
  } catch (error) {
    console.log('This is error addFormFields: --- ', error);
  }

  try {
    console.log('This is test deployApp1: --- ', await kintoneRestApiClient.app.deployApp({ apps: [{ app: plugins.multiTab.testingAppId }] }));
  } catch (error) {
    console.log('This is error deployApp1: --- ', error);
  }

  const response = await kintoneRestApiClient.app.getFormLayout({
    app: plugins.multiTab.testingAppId,
  });
  console.log('response here: --- ', response);

  const layout = response.layout;
  // @ts-ignore
  console.log('fields here: --- ', response.layout[layout.length - 1].fields);

  const fromIndex = layout.length - 1;
  const toIndex = 5;
  const element = layout.splice(fromIndex, 1)[0];
  console.log('element here: ---', element);
  // @ts-ignore
  console.log('fields 5 here: --- ', layout[toIndex].fields);

  layout.splice(toIndex, 0, element);
  // @ts-ignore
  console.log('fields 5 new here: --- ', layout[toIndex].fields);
  // @ts-ignore
  console.log('fields update here: --- ', layout[layout.length - 1].fields);

  // const newLayout = response.layout.map(layout);
  try {
    console.log(
      'This is test updateFormLayout: --- ',
      await kintoneRestApiClient.app.updateFormLayout({ app: plugins.multiTab.testingAppId, layout: layout })
    );
  } catch (error) {
    console.log('This is error updateFormLayout: --- ', error);
  }

  try {
    console.log(
      'This is test deployApp2: --- ',
      await kintoneRestApiClient.app.deployApp({ apps: [{ app: plugins.multiTab.testingAppId }] })
    );
  } catch (error) {
    console.log('This is error deployApp2: --- ', error);
  }
};

