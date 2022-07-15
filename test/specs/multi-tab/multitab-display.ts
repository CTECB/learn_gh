import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { AppSettingPage } from '@pages/common/AppSetting';
import { PluginConfigPage } from '@pages/multi-tab/PluginConfig';
import { RecordAddPage } from '@pages/multi-tab/RecordAdd';
import { RecordViewPage } from '@pages/multi-tab/RecordView';
import { addFormField, moveField, removeFormField } from '@utils/kintoneAPIs/formUtil';
import { credentials, plugins, testingSiteDomain } from '@configs/test-conf';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const appSettingUrl = `k/admin/app/${plugins.multiTab.testingAppId}/plugin/#/`;
const recordAddUrl = `k/${plugins.multiTab.testingAppId}/edit`;

describe('MultiTab - Display', () => {
  const addedField = {
    Added_Field_Text1:
    {
      'type': 'SINGLE_LINE_TEXT',
      'code': 'Added_Field_Text1',
      'label': 'Added Filed - Text 1',
      'noLabel': false,
      'required': true,
      'unique': false,
      'maxLength': '64',
      'minLength': '0',
      'defaultValue': '',
      'expression': '',
      'hideExpression': false
    }
  };
  const kintoneClient = new KintoneRestAPIClient({
    baseUrl: testingSiteDomain,
    auth: { username: credentials.username, password: credentials.password },
  });

  before('Add plugin', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.login(credentials);
    // if (await SystemPluginSettingPage.getNumberOfPlugins() > 0) {
    //   await SystemPluginSettingPage.removePlugin();
    // }
    // await SystemPluginSettingPage.addPluginById(plugins.multiTab.id);
  });

  it('Display_001 - Verify multi-tab display correctly if the number of tabs greater than 1', async () => {
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.selectStartTabItem(1, 'blank_space_start_1');
    await PluginConfigPage.selectEndTabItem(1, 'blank_space_end_1');

    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    await RecordAddPage.open(recordAddUrl);
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
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    // Check default tab in user screen
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab2');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_002_Tab2.html');

    await RecordAddPage.clickTab('blank_space_tab1');
    await RecordAddPage.inputTab1Data();
    await RecordAddPage.clickSaveBtn();
    await RecordViewPage.verifyIsSelectedTab('blank_space_tab2');
    await RecordViewPage.verifyHTLMContent('RecordViewDisplay_002_Tab2.html');
  });

  it.only('Display_003 - Verify "Remember last selected tab" feature work correctly', async () => {
    // Setting remember last selected tab
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.setLastSelectedTab(1, true);
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    // Verify "Remember last selected tab" when go to another screen then go back
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab2');
    await RecordAddPage.clickTab('blank_space_tab5');
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab5');

    await RecordAddPage.clickCancelBtn();
    await RecordAddPage.clickHomePageIcon();
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab5');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_003_Tab5.html');

    // Verify "Remember last selected tab" in case logout then login
    await RecordAddPage.open('/logout');
    browser.pause(5000);
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.login(credentials);

    await RecordAddPage.verifyIsSelectedTab('blank_space_tab5');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_003_Tab5.html');

    // Verify "Remember last selected tab" at detail record screen
    await RecordAddPage.clickSaveBtn();
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab5');
    await RecordAddPage.verifyHTLMContent('RecordViewDisplay_003_Tab5.html');
    const detailScreenURL = await browser.getUrl();
    await RecordAddPage.clickHomePageIcon();
    await browser.url(detailScreenURL);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab5');
    await RecordAddPage.verifyHTLMContent('RecordViewDisplay_003_Tab5.html');

  });

  it.skip('Display_004 - Verify multi-tab display correctly if there is multiple sections of multi-tab', async () => {
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
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    // Verify HTML of 2 multiple-tab sections
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyIsSelectedTab('blank_space_tab8');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_004.html');
    await RecordAddPage.clickCancelBtn();

    // Verify default tab of 2 sections

    // Verify last selected tab of 2 sections
  });

  it.skip('Display_005 - Verify multi-tab display correctly if there is new field added to any tab', async () => {
    await addFormField(kintoneClient, plugins.multiTab.testingAppId, addedField);
    await moveField(kintoneClient, plugins.multiTab.testingAppId, 5);
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.clickTab('blank_space_tab1');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_005.html');
    await RecordAddPage.clickCancelBtn();
  });

  it('Display_006 - Verify multi-tab display correctly if there is a field removed out of to any tab', async () => {
    const removedFields = [Object.keys(addedField)[0]]; // --> field "Added_Field_Text1"
    await removeFormField(kintoneClient, plugins.multiTab.testingAppId, removedFields);
    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.clickTab('blank_space_tab1');
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_006.html');
    await RecordAddPage.clickCancelBtn();
  });

  it.skip('Display_007 - Verify multi-tab display correctly if there is only 1 tab', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await RecordAddPage.login(credentials);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.setEnableTabs(1, [1, 3, 4, 5], false);
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_007.html');
  });

  after('Log out', async () => {
    await SystemPluginSettingPage.open('/logout');
  });
});
