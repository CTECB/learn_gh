import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { PluginConfigPage } from '@pages/conditional-display/PluginConfig';
import { getPluginInfo, TESTING_SITE_INFO } from '@configs/test-conf';

describe('ConditionalDisplay - Settings', () => {
  let plugin, appSettingUrl;

  before('Login', async () => {
    plugin = await getPluginInfo();
    appSettingUrl = `k/admin/app/${plugin.conditionalDisplay.testingAppId}/plugin/#/`;

    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.login(TESTING_SITE_INFO.credentials);
  });

  it('Setting_001: Verify plugin can be added into app successfully', async () => {
    // Remove plugin if existing before testing adding plugin
    if (await SystemPluginSettingPage.getNumberOfPlugins() > 0) {
      await SystemPluginSettingPage.removePlugin();
    }

    await SystemPluginSettingPage.addPluginById(plugin.conditionalDisplay.id);
    await SystemPluginSettingPage.verifyPluginDisplayed(plugin.conditionalDisplay.name);
    await SystemPluginSettingPage.clickPluginSettingIcon();
    await PluginConfigPage.verifyPluginVersion(plugin.conditionalDisplay.version);
  });

  it('Setting_002: Verify plugin can be set successfully', async () => {
    console.log('This is test 2');
  });

  it('Setting_003: Verify plugin can be set successfully', async () => {
    console.log('This is test 3');
  });

  it('Setting_004: Verify plugin can be removed out of app successfully', async () => {
    await SystemPluginSettingPage.open(appSettingUrl);
    await SystemPluginSettingPage.removePlugin();
    await SystemPluginSettingPage.verifyNoPluginDisplayed();
    await (await SystemPluginSettingPage.clickSettingNavigation()).updateApp();
  });

  after('Log out', async () => {
    await SystemPluginSettingPage.open('/logout');
  });
});
