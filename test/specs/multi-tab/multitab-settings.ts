import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { PluginConfigPage } from '@pages/multi-tab/PluginConfig';
import { AppSettingPage } from '@pages/common/AppSetting';
import { credentials, plugins } from '@configs/test-conf';

describe('MultiTab - Settings', async () => {
  let pls, appSettingUrl;

  before('Login', async () => {
    pls = await plugins();
    console.log('this is plugin info: ---- ', pls);
    appSettingUrl = `k/admin/app/${pls.multiTab.testingAppId}/plugin/#/`;

    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.login(credentials);
  });

  it('Setting_001: Verify plugin can be added into app successfully', async () => {
    // Remove plugin if existing before testing adding plugin
    if (await SystemPluginSettingPage.getNumberOfPlugins() > 0) {
      await SystemPluginSettingPage.removePlugin();
    }

    await SystemPluginSettingPage.addPluginById(pls.multiTab.id);
    await SystemPluginSettingPage.verifyPluginDisplayed(pls.multiTab.name);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.verifyPluginVersion(pls.multiTab.version);
  });

  it('Setting_002: Verify plugin can be set successfully - section 1', async () => {
    // - Verify only display blank spaces have id displayed in Start tab / End tab selection
    const expectedTabItems = [
      '-------',
      'blank_space_start_1',
      'blank_space_tab1',
      'blank_space_tab2',
      'blank_space_tab3',
      'blank_space_tab4',
      'blank_space_tab5',
      'blank_space_end_1',
      'blank_space_start_2',
      'blank_space_tab6',
      'blank_space_tab7',
      'blank_space_tab8',
      'blank_space_end_2'
    ];
    const actualStartTabItems = await PluginConfigPage.getStartTabItems(1);
    const actualEndTabItems = await PluginConfigPage.getEndTabItems(1);
    expect(actualStartTabItems).toEqual(expectedTabItems);
    expect(actualEndTabItems).toEqual(expectedTabItems);

    // - Setting start tab and end tab
    await PluginConfigPage.selectStartTabItem(1, 'blank_space_start_1');
    await PluginConfigPage.selectEndTabItem(1, 'blank_space_end_1');
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    // - Verify settings reflect on setting screen
    await SystemPluginSettingPage.open(appSettingUrl, '.gaia-admin-actionmenu-row-setting');
    await SystemPluginSettingPage.clickPluginSettingIcon();
    //   + verify selected Start tab / End tab
    await PluginConfigPage.verifyStartTab(1, 'blank_space_start_1');
    await PluginConfigPage.verifyEndTab(1, 'blank_space_end_1');
    //   + verify tab setting info table
    const expectedTabInfo = [
      { blankSpaceId: 'blank_space_tab1', isDefault: true, isEnabled: true, tabName: 'blank_space_tab1' },
      { blankSpaceId: 'blank_space_tab2', isDefault: false, isEnabled: true, tabName: 'blank_space_tab2' },
      { blankSpaceId: 'blank_space_tab3', isDefault: false, isEnabled: true, tabName: 'blank_space_tab3' },
      { blankSpaceId: 'blank_space_tab4', isDefault: false, isEnabled: true, tabName: 'blank_space_tab4' },
      { blankSpaceId: 'blank_space_tab5', isDefault: false, isEnabled: true, tabName: 'blank_space_tab5' },
    ];
    await PluginConfigPage.verifyTabSelectionList(1, expectedTabInfo);
  });

  it('Setting_003: Verify plugin can be set successfully - section 2', async () => {
    await PluginConfigPage.clickAddSectionIcon();
    // - Verify only display blank spaces have id displayed in Start tab / End tab selection
    const expectedTabItems = [
      '-------',
      'blank_space_start_1',
      'blank_space_tab1',
      'blank_space_tab2',
      'blank_space_tab3',
      'blank_space_tab4',
      'blank_space_tab5',
      'blank_space_end_1',
      'blank_space_start_2',
      'blank_space_tab6',
      'blank_space_tab7',
      'blank_space_tab8',
      'blank_space_end_2'
    ];
    const actualStartTabItems = await PluginConfigPage.getStartTabItems(2);
    const actualEndTabItems = await PluginConfigPage.getEndTabItems(2);
    expect(actualStartTabItems).toEqual(expectedTabItems);
    expect(actualEndTabItems).toEqual(expectedTabItems);

    // - Setting start tab and end tab
    await PluginConfigPage.selectStartTabItem(2, 'blank_space_start_2');
    await PluginConfigPage.selectEndTabItem(2, 'blank_space_end_2');
    await PluginConfigPage.clickSubmit();
    await SystemPluginSettingPage.clickSettingNavigation();
    await AppSettingPage.updateApp();

    // - Verify settings reflect on setting screen
    await SystemPluginSettingPage.open(appSettingUrl, '.gaia-admin-actionmenu-row-setting');
    await SystemPluginSettingPage.clickPluginSettingIcon();
    //   + verify selected Start tab / End tab
    await PluginConfigPage.verifyStartTab(2, 'blank_space_start_2');
    await PluginConfigPage.verifyEndTab(2, 'blank_space_end_2');
    //   + verify tab setting info table
    const expectedTabInfo = [
      { blankSpaceId: 'blank_space_tab6', isDefault: true, isEnabled: true, tabName: 'blank_space_tab6' },
      { blankSpaceId: 'blank_space_tab7', isDefault: false, isEnabled: true, tabName: 'blank_space_tab7' },
      { blankSpaceId: 'blank_space_tab8', isDefault: false, isEnabled: true, tabName: 'blank_space_tab8' },
    ];
    await PluginConfigPage.verifyTabSelectionList(2, expectedTabInfo);
  });

  it('Setting_004: Verify plugin can be removed out of app successfully', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.removePlugin();
    await SystemPluginSettingPage.verifyNoPluginDisplayed();
    await (await SystemPluginSettingPage.clickSettingNavigation()).updateApp();
  });

  // after('Log out', async () => {
  //   await SystemPluginSettingPage.open('/logout');
  // });
});
