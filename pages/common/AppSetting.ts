import BasePage from './BasePage';

class AppSetting extends BasePage {
  public get appUpdateBtn() { return $('.gaia-admin-app-deploy-button'); }
  public get okBtn() { return $('[name="ok"]'); }

  public async updateApp() {
    await this.appUpdateBtn.click();
    await browser.pause(500);
    await this.okBtn.click();
    await this.appUpdateBtn.waitForExist({ timeout: 30000, reverse: true });
  }
}

export const AppSettingPage = new AppSetting();