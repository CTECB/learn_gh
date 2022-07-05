import BasePage from './BasePage';
import { AppSettingPage } from './AppSetting';

// TODO: This class will be refactored later
class SystemPluginSetting extends BasePage {
  private idEL: any;

  public get elmPluginSettingLnk() { return $("a[href*='/plugin/']")}
  public get elmAddPluginBtn() { return $('.actionmenu-item-gaia'); }
  public set elmPluginCbx(id) { this.idEL = $(`//input[contains(@id, "${id}")]`); }
  public get elmPluginCbx() { return this.idEL; }
  public get elmAddBtn() { return $('#app-plugin-add-btn'); }
  public get elmPluginSettingIcon() { return $('.gaia-admin-actionmenu-row-setting'); }
  public get elmRemoveIcon() { return $('.gaia-admin-actionmenu-row-remove'); }
  public get elmSuccessNotifierDlg() { return $('.notifier-success-cybozu'); }
  public get elmRemoveConfirmationBtn() { return $('.removelink-confirm-btn-cybozu'); }
  public get elmRemoveNotificationDlg() { return $('.notifier-remove-cybozu'); }
  public get elmNotificationDlg() { return $('.notifier-header-cybozu'); }
  public get elmSettingNav() { return $('#breadcrumb-list-gaia li:nth-child(2)>.breadcrumb-item-gaia'); }
  public get elmEnabledBtn() { return $('.gaia-admin-app-plugin-enabled-button'); }
  public get elmPluginItem() { return $$('.gaia-admin-app-plugin-name-text'); }

  public async addPluginById(id) {
    await this.elmAddPluginBtn.click();
    await (this.elmPluginCbx = id);
    await this.elmPluginCbx.scrollIntoView({
      block: 'center',
      inline: 'nearest',
    });
    await this.elmPluginCbx.click();

    await browser.execute('window.scrollTo(0,0);');
    await this.elmAddBtn.click();
    await browser.pause(2000);
  }

  public async clickPluginSettingIcon() {
    await this.elmPluginSettingIcon.click();
  }

  public async closeNotificationDialog() {
    await this.elmRemoveNotificationDlg.click();
  }

  public async clickSettingNavigation() {
    await this.elmSettingNav.click();
    return AppSettingPage;
  }

  public async removePlugin() {
    await this.elmRemoveIcon.click();
    await this.elmRemoveConfirmationBtn.waitForClickable();
    await this.elmRemoveConfirmationBtn.click();
    await this.elmRemoveNotificationDlg.waitForDisplayed();
    // await this.closeNotificationDialog();
  }

  public async clickEnabledDisabledPlugin() {
    await this.elmEnabledBtn.click();
  }

  public async verifyPluginDisplayed(pluginName, rowIndex = 1) {
    const pluginItem = (await this.elmPluginItem)[rowIndex - 1];
    await expect(pluginItem).toHaveText(pluginName);
  }

  public async verifyNoPluginDisplayed() {
    const numberOfPlugins = await this.elmPluginItem.length;
    expect(numberOfPlugins).toEqual(0);
  }
}

export const SystemPluginSettingPage = new SystemPluginSetting();