import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { RecordAddPage } from '@pages/multi-tab/RecordAdd';
import { PluginConfigPage } from '@pages/multi-tab/PluginConfig';
import { AppSettingPage } from '@pages/common/AppSetting';
import { credentials, plugins, testingApps } from '@configs/test-conf';
import { RecordViewPage } from '@pages/multi-tab/RecordView';

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

  it('Display_001 - Verify multi-tab display correctly if the number of tabs greater than 1', async () => {
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.selectStartTabItem(1, 'blank_space_start_1');
    await PluginConfigPage.selectEndTabItem(1, 'blank_space_end_1');
    await PluginConfigPage.clickSubmit();
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
    console.log('test 2');
  });

  it('Display_003 - Verify "Remember last selected tab" feature work correctly', async () => {
    console.log('test 3');
  });

  it('Display_004 - Verify multi-tab display correctly if there is only 1 tab', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await RecordAddPage.login(credentials);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.setEnableTabs(1, [2, 3, 4, 5], false);
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.elmSettingNav.click();
    await AppSettingPage.updateApp();

    await RecordAddPage.open(recordAddUrl);
    await RecordAddPage.login(credentials);
    await RecordAddPage.verifyHTLMContent('RecordAddDisplay_002_Tab1.html');
  });

  it('Display_005 - Verify multi-tab display correctly if there is multiple sections of multi-tab', async () => {
    console.log('test 5');
  });

  it('Display_006 - Verify multi-tab display correctly if there is new field added to any tab', async () => {
    console.log('test 6');
  });

  it('Display_007 - Verify multi-tab display correctly if there is a field removed out of to any tab', async () => {
    console.log('test 7');
  });

  after('Log out', async () => {
    await SystemPluginSettingPage.open('/logout');
  });
});
