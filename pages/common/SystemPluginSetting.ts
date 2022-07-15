import BasePage from './BasePage';
import { AppSettingPage } from '@pages/common/AppSetting';
import { sprintf } from 'sprintf-js';

const PLUGIN_SETTING_LNK = 'a[href*="/plugin/"]';
const ADD_PLUGIN_BTN = '.actionmenu-item-gaia';
const PLUGIN_CBX = '//input[contains(@id, "%s")]';
const ADD_BTN = '#app-plugin-add-btn';
const PLUGIN_SETTING_ICN = '.gaia-admin-actionmenu-row-setting';
const REMOVE_ICN = '.gaia-admin-actionmenu-row-remove';
const SUCCESS_NOTIFIER_DLG = '.notifier-success-cybozu';
const REMOVE_CONFIRMATION_BTN = '.removelink-confirm-btn-cybozu';
const REMOVE_NOTIFIER_DLG = '.notifier-remove-cybozu';
const NOTIFIER_DLG = '.notifier-header-cybozu';
const SETTING_NAV = '#breadcrumb-list-gaia li:nth-child(2)>.breadcrumb-item-gaia';
const ENABLED_BTN = '.gaia-admin-app-plugin-enabled-button';
const PLUGIN_ITEM = '.gaia-admin-app-plugin-name-text';


class SystemPluginSetting extends BasePage {
  public get elmNotificationDlg() { return $(NOTIFIER_DLG); }

  public async addPluginById(id) {
    await $(ADD_PLUGIN_BTN).click();
    const pluginCheckboxLocator = sprintf(PLUGIN_CBX, id);
    await $(pluginCheckboxLocator).scrollIntoView({
      block: 'center',
      inline: 'nearest',
    });
    await $(pluginCheckboxLocator).click();

    await browser.execute('window.scrollTo(0,0);');
    await $(ADD_BTN).click();
    await browser.pause(2000);
  }

  public async clickPluginSettingIcon() {
    await $(PLUGIN_SETTING_ICN).click();
  }

  public async closeNotificationDialog() {
    await $(REMOVE_NOTIFIER_DLG).click();
  }

  public async clickSettingNavigation() {
    await $(SETTING_NAV).click();
    return AppSettingPage;
  }

  public async removePlugin() {
    await $(REMOVE_ICN).click();
    await $(REMOVE_CONFIRMATION_BTN).waitForClickable();
    await $(REMOVE_CONFIRMATION_BTN).click();
    await $(REMOVE_NOTIFIER_DLG).waitForDisplayed();
    // await this.closeNotificationDialog();
  }

  public async clickEnabledDisabledPlugin() {
    await $(ENABLED_BTN).click();
  }

  public async verifyPluginDisplayed(pluginName, rowIndex = 1) {
    const pluginItem = (await $$(PLUGIN_ITEM))[rowIndex - 1];
    await expect(pluginItem).toHaveText(pluginName);
  }

  public async getNumberOfPlugins() {
    return $$(PLUGIN_ITEM).length;
  }

  public async verifyNoPluginDisplayed() {
    const numberOfPlugins = await this.getNumberOfPlugins();
    expect(numberOfPlugins).toEqual(0);
  }
}

export const SystemPluginSettingPage = new SystemPluginSetting();