import BasePage from '@pages/common/BasePage';
import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';

const PLUGIN_VERSION = '.gaia-admin-app-plugin-config-version';
const SUBMIT_BTN = '.plugin-layout .button-group__save';

class PluginConfig extends BasePage {
  public async clickSubmit() {
    await $(SUBMIT_BTN).click();
    await SystemPluginSettingPage.elmNotificationDlg.waitForDisplayed();
  }

  public async verifyPluginVersion(version: string) {
    await expect($(PLUGIN_VERSION)).toHaveText(version);
  }
}

export const PluginConfigPage = new PluginConfig();
